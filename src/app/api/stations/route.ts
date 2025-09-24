import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();

    // 지하철역 데이터 조회 (매물 수 포함)
    const { data: stations, error } = await supabase
      .from("stations")
      .select(
        `
        *,
        listing_stations(
          listing_id,
          listings!inner(status)
        )
      `
      )
      .order("name");

    if (error) {
      console.error("Get stations error:", error);
      return NextResponse.json(
        { error: "지하철역 데이터를 가져오는데 실패했습니다" },
        { status: 500 }
      );
    }

    // 데이터 포맷팅
    const formattedStations =
      stations?.map((station: any) => ({
        id: station.id,
        name: station.name,
        line: station.line,
        location: station.location,
        listing_count:
          station.listing_stations?.filter(
            (ls: any) => ls.listings.status === "active"
          ).length || 0,
        popular:
          station.name === "강남역" ||
          station.name === "역삼역" ||
          station.name === "선릉역",
      })) || [];

    return NextResponse.json({
      stations: formattedStations,
      total: formattedStations.length,
    });
  } catch (error) {
    console.error("Stations API error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
