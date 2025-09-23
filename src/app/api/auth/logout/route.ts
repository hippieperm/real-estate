import { NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase-server'

export async function POST() {
  try {
    const supabase = await createServerComponentClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout error:', error)
      return NextResponse.json(
        { error: '로그아웃에 실패했습니다' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: '로그아웃되었습니다',
    })

  } catch (error) {
    console.error('Logout API error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}