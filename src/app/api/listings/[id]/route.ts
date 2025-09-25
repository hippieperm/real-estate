import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerComponentClient()
    const { id: listingId } = await params

    const { data: listing, error } = await supabase
      .from('listings')
      .select(`
        *,
        listing_images(path, sort_order),
        listing_themes(
          theme_id,
          theme_categories(key, label_ko)
        )
      `)
      .eq('id', listingId)
      .single()

    if (error) {
      return NextResponse.json(
        { error: '매물을 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      listing
    })

  } catch (error) {
    console.error('Get listing error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminClient()
    const { id: listingId } = await params
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
      status
    } = body

    // 필수 필드 검증
    if (!title || !property_type || price_deposit === null || price_deposit === undefined || !exclusive_m2 || floor === null || floor === undefined || !address_road || !latitude || !longitude) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다' },
        { status: 400 }
      )
    }

    // Create location point
    const locationPoint = `POINT(${longitude} ${latitude})`

    // 매물 업데이트
    const { data: listing, error } = await supabase
      .from('listings')
      .update({
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
        updated_at: new Date().toISOString()
      })
      .eq('id', listingId)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: '매물 수정에 실패했습니다' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: '매물이 성공적으로 수정되었습니다',
      listing
    })

  } catch (error) {
    console.error('Update listing error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminClient()
    const { id: listingId } = await params

    // 연관된 데이터 먼저 삭제 (이미지, 테마 등)
    await supabase
      .from('listing_images')
      .delete()
      .eq('listing_id', listingId)

    await supabase
      .from('listing_themes')
      .delete()
      .eq('listing_id', listingId)

    await supabase
      .from('listing_stations')
      .delete()
      .eq('listing_id', listingId)

    await supabase
      .from('listing_regions')
      .delete()
      .eq('listing_id', listingId)

    // 매물 삭제
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', listingId)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: '매물 삭제에 실패했습니다' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: '매물이 성공적으로 삭제되었습니다'
    })

  } catch (error) {
    console.error('Delete listing error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}