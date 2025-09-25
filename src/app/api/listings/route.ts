import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient()
    const body = await request.json()

    const {
      title,
      description,
      property_type,
      price_deposit,
      price_monthly,
      exclusive_m2,
      floor,
      building_floor,
      address_road,
      address_jibun,
      address_detail,
      latitude,
      longitude,
      status = 'active'
    } = body

    // 필수 필드 검증
    if (!title || !property_type || !price_deposit || !exclusive_m2 || !floor || !address_road) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다' },
        { status: 400 }
      )
    }

    // pyeong 계산 (㎡ / 3.305785)
    const pyeong_exclusive = exclusive_m2 / 3.305785

    // 매물 생성
    const { data: listing, error } = await supabase
      .from('listings')
      .insert({
        title,
        description,
        property_type,
        price_deposit,
        price_monthly,
        exclusive_m2,
        pyeong_exclusive,
        floor,
        building_floor,
        address_road,
        address_jibun,
        address_detail,
        latitude,
        longitude,
        status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: '매물 생성에 실패했습니다' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: '매물이 성공적으로 생성되었습니다',
      listing
    })

  } catch (error) {
    console.error('Create listing error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}