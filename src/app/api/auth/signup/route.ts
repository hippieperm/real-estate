import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password } = await request.json()

    console.log('Signup request received:', { name, email, phone: phone ? '***' : 'null', password: password ? '***' : 'null' })

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: '모든 필수 항목을 입력해주세요' },
        { status: 400 }
      )
    }

    console.log('Creating Supabase admin client...')

    // Admin 클라이언트로 이메일 확인 없이 사용자 생성
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    console.log('Attempting signup with admin client...')
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        name,
        phone,
      },
      email_confirm: true, // 이메일 확인을 자동으로 완료
    })

    console.log('Signup result:', { data: data ? 'success' : 'no data', error: error ? error.message : 'none' })

    if (error) {
      console.error('Signup error:', error)
      console.error('Error details:', {
        message: error.message,
        code: error.status,
        details: error
      })

      if (error.message.includes('already registered') || error.message.includes('User already registered')) {
        return NextResponse.json(
          { error: '이미 등록된 이메일입니다' },
          { status: 409 }
        )
      }

      return NextResponse.json(
        { error: `회원가입에 실패했습니다: ${error.message}` },
        { status: 400 }
      )
    }

    // 현재는 profiles 테이블 없이 진행 (나중에 필요시 추가)
    console.log('User created successfully:', data.user?.id)

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