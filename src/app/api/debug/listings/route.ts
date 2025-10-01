import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();

    // Get all listings with basic info
    const { data: listings, error } = await supabase
      .from("listings")
      .select("id, code, title, status, created_by, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Debug listings error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get count by status
    const { count: activeCount } = await supabase
      .from("listings")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    const { count: totalCount } = await supabase
      .from("listings")
      .select("*", { count: "exact", head: true });

    return NextResponse.json({
      totalCount,
      activeCount,
      listings: listings || [],
      summary: {
        total: listings?.length || 0,
        active: listings?.filter((l) => l.status === "active").length || 0,
        withCreatedBy:
          listings?.filter((l) => l.created_by !== null).length || 0,
        withoutCreatedBy:
          listings?.filter((l) => l.created_by === null).length || 0,
      },
    });
  } catch (error) {
    console.error("Debug API error:", error);
    return NextResponse.json({ error: "Debug API failed" }, { status: 500 });
  }
}

