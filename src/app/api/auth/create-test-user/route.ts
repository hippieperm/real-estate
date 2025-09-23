import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "이메일과 비밀번호를 입력해주세요" },
        { status: 400 }
      );
    }

    // Service Role Key를 사용하여 관리자 권한으로 사용자 생성
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

    // 사용자 생성 (이메일 확인 없이)
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // 이메일 확인을 강제로 완료 처리
      user_metadata: {
        name: name || "테스트 사용자",
      },
    });

    if (error) {
      console.error("User creation error:", error);
      return NextResponse.json(
        { error: `사용자 생성에 실패했습니다: ${error.message}` },
        { status: 400 }
      );
    }

    // 프로필 테이블에 사용자 정보 추가
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      name: name || "테스트 사용자",
      role: "user",
    });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      // 프로필 생성 실패해도 사용자는 생성되었으므로 성공으로 처리
    }

    return NextResponse.json({
      message: "테스트 사용자가 생성되었습니다",
      user: {
        id: data.user.id,
        email: data.user.email,
        email_confirmed_at: data.user.email_confirmed_at,
      },
    });
  } catch (error) {
    console.error("Create test user API error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
