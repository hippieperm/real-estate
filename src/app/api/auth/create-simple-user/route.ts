import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "이메일과 비밀번호를 입력해주세요" },
        { status: 400 }
      );
    }

    // 일반 클라이언트로 회원가입 시도
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 회원가입
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Signup error:", error);
      return NextResponse.json(
        { error: `회원가입에 실패했습니다: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "회원가입이 완료되었습니다. 이메일 확인이 필요할 수 있습니다.",
      user: {
        id: data.user?.id,
        email: data.user?.email,
        email_confirmed_at: data.user?.email_confirmed_at,
      },
    });
  } catch (error) {
    console.error("Create simple user API error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
