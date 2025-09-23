import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "이메일을 입력해주세요" },
        { status: 400 }
      );
    }

    // Service Role Key를 사용하여 관리자 권한으로 사용자 수정
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // 먼저 사용자를 찾기
    const { data: users, error: searchError } =
      await supabase.auth.admin.listUsers();

    if (searchError) {
      console.error("User search error:", searchError);
      return NextResponse.json(
        { error: `사용자 검색에 실패했습니다: ${searchError.message}` },
        { status: 400 }
      );
    }

    const user = users.users.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: "해당 이메일의 사용자를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 사용자의 이메일 확인 상태를 강제로 완료 처리
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      email_confirm: true,
    });

    if (error) {
      console.error("User update error:", error);
      return NextResponse.json(
        { error: `사용자 수정에 실패했습니다: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "사용자의 이메일 확인이 완료되었습니다",
      user: {
        id: data.user.id,
        email: data.user.email,
        email_confirmed_at: data.user.email_confirmed_at,
      },
    });
  } catch (error) {
    console.error("Fix user API error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
