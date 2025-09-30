import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerComponentClient();
    const { id: listingId } = await params;

    // RPC 함수를 사용하여 좌표를 포함한 매물 정보 조회
    const { data: listingData, error: rpcError } = await supabase
      .rpc("get_listing_with_coords", { listing_id: listingId })
      .single();

    // 연관 데이터 조회
    const { data: images } = await supabase
      .from("listing_images")
      .select("path, sort_order")
      .eq("listing_id", listingId)
      .order("sort_order");

    const { data: themes } = await supabase
      .from("listing_themes")
      .select(
        `
        theme_id,
        theme_categories(key, label_ko)
      `
      )
      .eq("listing_id", listingId);

    if (rpcError || !listingData) {
      console.error("Error fetching listing:", rpcError);

      // RPC 함수가 없는 경우 기존 방식으로 fallback
      const { data: listing, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", listingId)
        .single();

      if (error || !listing) {
        return NextResponse.json(
          { error: "매물을 찾을 수 없습니다" },
          { status: 404 }
        );
      }

      // location 필드에서 좌표 추출 (fallback)
      let latitude = null;
      let longitude = null;

      if (listing.location) {
        console.log("Raw location data:", listing.location);

        if (typeof listing.location === "string") {
          const match = listing.location.match(
            /POINT\(([-\d.]+)\s+([-\d.]+)\)/
          );
          if (match) {
            longitude = parseFloat(match[1]);
            latitude = parseFloat(match[2]);
          }
        } else if (listing.location && listing.location.coordinates) {
          longitude = listing.location.coordinates[0];
          latitude = listing.location.coordinates[1];
        }
      }

      // 좌표가 여전히 null인 경우 기본값 설정 (서울 중심)
      if (!latitude || !longitude) {
        console.log("No coordinates found, using default Seoul coordinates");
        latitude = 37.5665; // 서울시청 위도
        longitude = 126.9780; // 서울시청 경도
      }

      console.log("Extracted coordinates:", { latitude, longitude });

      return NextResponse.json({
        listing: {
          ...listing,
          latitude,
          longitude,
          listing_images: images || [],
          listing_themes: themes || [],
        },
      });
    }

    return NextResponse.json({
      listing: {
        ...listingData,
        listing_images: images || [],
        listing_themes: themes || [],
      },
    });
  } catch (error) {
    console.error("Get listing error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminClient();
    const { id: listingId } = await params;
    const body = await request.json();

    const {
      title,
      description,
      property_type,
      price_deposit,
      price_monthly,
      exclusive_m2,
      floor,
      floors_total,
      address_road,
      address_jibun,
      address_detail,
      latitude,
      longitude,
      status,
    } = body;

    // 디버깅을 위한 로깅
    console.log("Received data:", {
      title,
      property_type,
      price_deposit,
      exclusive_m2,
      floor,
      address_road,
      latitude,
      longitude,
    });

    // 필수 필드 검증
    const missingFields = [];
    if (!title) missingFields.push("title");
    if (!property_type) missingFields.push("property_type");
    if (price_deposit === null || price_deposit === undefined)
      missingFields.push("price_deposit");
    if (!exclusive_m2) missingFields.push("exclusive_m2");
    if (floor === null || floor === undefined) missingFields.push("floor");
    if (!address_road) missingFields.push("address_road");
    if (!latitude) missingFields.push("latitude");
    if (!longitude) missingFields.push("longitude");

    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields);
      return NextResponse.json(
        { error: `필수 필드가 누락되었습니다: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Create location point
    const locationPoint = `POINT(${longitude} ${latitude})`;

    // 매물 업데이트
    const { data: listing, error } = await supabase
      .from("listings")
      .update({
        title,
        description,
        property_type,
        price_deposit,
        price_monthly,
        exclusive_m2,
        floor,
        floors_total,
        address_road,
        address_jibun,
        address_detail,
        location: locationPoint,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", listingId)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "매물 수정에 실패했습니다" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "매물이 성공적으로 수정되었습니다",
      listing,
    });
  } catch (error) {
    console.error("Update listing error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminClient();
    const { id: listingId } = await params;

    // 연관된 데이터 먼저 삭제 (이미지, 테마 등)
    await supabase.from("listing_images").delete().eq("listing_id", listingId);

    await supabase.from("listing_themes").delete().eq("listing_id", listingId);

    await supabase
      .from("listing_stations")
      .delete()
      .eq("listing_id", listingId);

    await supabase.from("listing_regions").delete().eq("listing_id", listingId);

    // 매물 삭제
    const { error } = await supabase
      .from("listings")
      .delete()
      .eq("id", listingId);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "매물 삭제에 실패했습니다" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "매물이 성공적으로 삭제되었습니다",
    });
  } catch (error) {
    console.error("Delete listing error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
