import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password } = await request.json()

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: '모든 필수 항목을 입력해주세요' },
        { status: 400 }
      )
    }

    const supabase = await createServerComponentClient()

    // 회원가입
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
        }
      }
    })

    if (error) {
      console.error('Signup error:', error)

      if (error.message.includes('already registered')) {
        return NextResponse.json(
          { error: '이미 등록된 이메일입니다' },
          { status: 409 }
        )
      }

      return NextResponse.json(
        { error: '회원가입에 실패했습니다. 다시 시도해주세요.' },
        { status: 400 }
      )
    }

    // 사용자 프로필 정보를 profiles 테이블에 추가
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          name,
          email,
          phone,
          created_at: new Date().toISOString(),
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        // 프로필 생성 실패해도 회원가입은 성공으로 처리
      }
    }

    return NextResponse.json({
      message: '회원가입이 완료되었습니다',
      user: data.user,
    })

  } catch (error) {
    console.error('Signup API error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}