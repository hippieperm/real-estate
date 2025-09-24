import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();

    // 전체 지역 통계 조회
    const { data, error } = await supabase
      .from("region_stats")
      .select("*")
      .order("building_count", { ascending: false });

    if (error) {
      console.error("Get regions error:", error);
      return NextResponse.json(
        { error: "지역 데이터를 가져오는데 실패했습니다" },
        { status: 500 }
      );
    }

    const query = data;

    // 데이터 포맷팅
    const formattedRegions = query.map((region: any) => ({
      id: region.region_name,
      name: region.region_name,
      district: region.district,
      buildingCount: region.building_count || 0,
      avgPrice: Math.round(region.avg_price || 0),
      avgDeposit: Math.round(region.avg_deposit || 0),
      recentListings: region.recent_listings || 0,
      popular: region.popular || false,
      trend: region.price_trend ? `+${region.price_trend}%` : "+0%",
      description: getRegionDescription(region.region_name),
      subRegions: getSubRegions(region.region_name),
    }));

    return NextResponse.json({
      regions: formattedRegions,
      total: formattedRegions.length,
    });
  } catch (error) {
    console.error("Regions API error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

// 지역별 설명 생성
function getRegionDescription(regionName: string): string {
  const descriptions: { [key: string]: string } = {
    강남구: "강남의 핵심 비즈니스 중심지",
    서초구: "법조타운과 IT 중심의 프리미엄 지역",
    송파구: "잠실과 올림픽공원을 중심으로 한 신도시",
    마포구: "홍대와 상암동을 중심으로 한 창업 허브",
    영등포구: "여의도 금융센터와 연결된 비즈니스 지역",
    중구: "서울의 심장부, 전통과 현대가 공존하는 지역",
  };

  return descriptions[regionName] || "서울의 주요 비즈니스 지역";
}

// 지역별 주요 동네 생성
function getSubRegions(regionName: string): string[] {
  const subRegions: { [key: string]: string[] } = {
    강남구: ["역삼동", "삼성동", "청담동", "압구정동", "신사동", "논현동"],
    서초구: ["서초동", "방배동", "잠원동", "반포동", "내곡동"],
    송파구: ["잠실동", "문정동", "가락동", "석촌동", "방이동", "송파동"],
    마포구: ["홍대", "상암동", "합정동", "성산동", "공덕동", "대흥동"],
    영등포구: ["여의도", "영등포동", "당산동", "문래동", "신길동"],
    중구: ["명동", "을지로", "회현동", "중림동", "봉래동"],
  };

  return subRegions[regionName] || [];
}
