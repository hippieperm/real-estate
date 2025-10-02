import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  console.log('=== Save URL Images API Started ===');
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    
    const { listingId, urls } = body
    
    console.log('Request data:', {
      listingId,
      urlsCount: urls?.length,
      urls
    });
    
    if (!listingId || !urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: '매물 ID와 이미지 URL이 필요합니다' },
        { status: 400 }
      )
    }

    // URL 유효성 검사
    const validUrls = urls.filter(url => {
      try {
        new URL(url)
        return true
      } catch {
        console.warn('Invalid URL:', url)
        return false
      }
    })

    if (validUrls.length === 0) {
      return NextResponse.json(
        { error: '유효한 URL이 없습니다' },
        { status: 400 }
      )
    }

    console.log('Valid URLs:', validUrls.length)

    // 데이터베이스에 URL들 저장
    const insertPromises = validUrls.map(async (url, index) => {
      const { error: dbError } = await supabase
        .from('listing_images')
        .insert({
          listing_id: listingId,
          path: url,
          sort_order: index
        })

      if (dbError) {
        console.error('Database insert error for URL:', url, dbError)
        throw dbError
      }

      return {
        path: url,
        sort_order: index,
        originalUrl: url
      }
    })

    const results = await Promise.all(insertPromises)

    console.log('URL images saved successfully:', results.length)

    return NextResponse.json({
      message: 'URL 이미지가 저장되었습니다',
      images: results
    })

  } catch (error) {
    console.error('=== Save URL Images API Error ===');
    console.error('Error type:', typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Full error:', error);
    
    return NextResponse.json(
      { 
        error: 'URL 이미지 저장에 실패했습니다',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}