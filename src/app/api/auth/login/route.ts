import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log('Login request received:', { email, password: password ? '***' : 'null' })

    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요' },
        { status: 400 }
      )
    }

    console.log('Creating Supabase client for login...')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    console.log('Attempting login...')
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log('Login result:', { data: data ? 'success' : 'no data', error: error ? error.message : 'none' })

    if (error) {
      console.error('Login error:', error)
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        details: error
      })

      return NextResponse.json(
        { error: `로그인에 실패했습니다: ${error.message}` },
        { status: 401 }
      )
    }

    console.log('Login successful for user:', data.user?.id)

    return NextResponse.json({
      message: '로그인되었습니다',
      user: data.user,
    })

  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}