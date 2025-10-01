import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();

    console.log("Received body:", JSON.stringify(body, null, 2));

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
      latitude,
      longitude,
      status = "active",
      created_by,
    } = body;

    // 필수 필드 검증
    if (
      !title ||
      !property_type ||
      price_deposit === null ||
      price_deposit === undefined ||
      !exclusive_m2 ||
      floor === null ||
      floor === undefined ||
      !address_road ||
      !latitude ||
      !longitude
    ) {
      console.error("Missing required fields:", {
        title,
        property_type,
        price_deposit,
        exclusive_m2,
        floor,
        address_road,
        latitude,
        longitude,
      });
      return NextResponse.json(
        { error: "필수 필드가 누락되었습니다" },
        { status: 400 }
      );
    }

    // Generate unique code
    const code = `L${Date.now()}`;

    // Create location point - PostGIS 형식으로 변경
    const insertData = {
      code,
      title,
      description,
      property_type,
      price_deposit: Number(price_deposit),
      price_monthly: price_monthly ? Number(price_monthly) : null,
      exclusive_m2: Number(exclusive_m2),
      floor: Number(floor),
      floors_total: floors_total ? Number(floors_total) : null,
      address_road,
      address_jibun: address_jibun || null,
      status,
      location: `POINT(${longitude} ${latitude})`, // PostGIS POINT 형식으로 설정
      created_by: created_by || null, // created_by 필드 추가
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log("Insert data:", JSON.stringify(insertData, null, 2));
    console.log("Created by user ID:", created_by);

    // 매물 생성
    const { data: listing, error } = await supabase
      .from("listings")
      .insert(insertData as any)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        {
          error: "매물 생성에 실패했습니다",
          details: error.message,
          fullError: error,
        },
        { status: 500 }
      );
    }

    // location은 이미 insertData에 포함되어 있으므로 별도 업데이트 불필요

    // Materialized view 새로고침
    try {
      await supabase.rpc("refresh_listings_with_search");
    } catch (refreshError) {
      console.error("Materialized view refresh error:", refreshError);
    }

    return NextResponse.json({
      message: "매물이 성공적으로 생성되었습니다",
      listing,
    });
  } catch (error) {
    console.error("Create listing error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
