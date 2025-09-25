import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()

    const {
      title,
      description,
      property_type,
      price_deposit,
      price_monthly,
      exclusive_m2,
      floor,
      floors_total,
      address_road,
      address_jibun,
      address_detail,
      latitude,
      longitude,
      status = 'active'
    } = body

    // 필수 필드 검증
    if (!title || !property_type || price_deposit === null || price_deposit === undefined || !exclusive_m2 || floor === null || floor === undefined || !address_road || !latitude || !longitude) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다' },
        { status: 400 }
      )
    }

    // Generate unique code
    const code = `L${Date.now()}`
    
    // Create location point
    const locationPoint = `POINT(${longitude} ${latitude})`

    // 매물 생성
    const { data: listing, error } = await supabase
      .from('listings')
      .insert({
        code,
        title,
        description,
        property_type,
        price_deposit,
        price_monthly,
        exclusive_m2,
        floor,
        floors_total,
        address_road,
        address_jibun,
        location: locationPoint,
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