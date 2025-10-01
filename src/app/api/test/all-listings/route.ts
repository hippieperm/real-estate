import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();

    // 모든 활성 매물 조회 (조인 없이)
    const {
      data: listings,
      error,
      count,
    } = await supabase
      .from("listings")
      .select("*", { count: "exact" })
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get all listings error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("All listings query result:", {
      count,
      dataLength: listings?.length,
      sampleData: listings?.slice(0, 2),
    });

    return NextResponse.json({
      message: "모든 활성 매물 조회 완료",
      total: count,
      listings: listings || [],
      summary: {
        total: listings?.length || 0,
        withCreatedBy:
          listings?.filter((l) => l.created_by !== null).length || 0,
        withoutCreatedBy:
          listings?.filter((l) => l.created_by === null).length || 0,
      },
    });
  } catch (error) {
    console.error("Test API error:", error);
    return NextResponse.json({ error: "모든 매물 조회 실패" }, { status: 500 });
  }
}

