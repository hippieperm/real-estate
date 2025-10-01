import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();

    // Create a test listing
    const testListing = {
      code: `TEST${Date.now()}`,
      title: "테스트 매물 - 강남 오피스텔",
      description: "테스트용 매물입니다.",
      property_type: "office",
      price_deposit: 10000,
      price_monthly: 300,
      exclusive_m2: 165.3,
      floor: 15,
      floors_total: 20,
      address_road: "서울시 강남구 테헤란로 123",
      address_jibun: "서울시 강남구 역삼동 456",
      status: "active",
      location: "POINT(127.0543 37.5065)", // 강남 좌표
      created_by: null, // 테스트용으로 null로 설정
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("listings")
      .insert(testListing)
      .select()
      .single();

    if (error) {
      console.error("Create dummy listing error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "테스트 매물이 생성되었습니다",
      listing: data,
    });
  } catch (error) {
    console.error("Test API error:", error);
    return NextResponse.json(
      { error: "테스트 매물 생성 실패" },
      { status: 500 }
    );
  }
}

