import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient()
    const formData = await request.formData()
    
    const files = formData.getAll('files') as File[]
    const listingId = formData.get('listingId') as string
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: '업로드할 파일이 없습니다' },
        { status: 400 }
      )
    }

    const uploadPromises = files.map(async (file, index) => {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `listings/${listingId || 'temp'}/${fileName}`

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('listing-images')
        .getPublicUrl(filePath)

      // If listingId is provided, save to database
      if (listingId) {
        const { error: dbError } = await supabase
          .from('listing_images')
          .insert({
            listing_id: listingId,
            path: publicUrl,
            sort_order: index
          })

        if (dbError) {
          throw dbError
        }
      }

      return {
        path: publicUrl,
        filename: fileName,
        originalName: file.name
      }
    })

    const results = await Promise.all(uploadPromises)

    return NextResponse.json({
      message: '이미지 업로드가 완료되었습니다',
      images: results
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: '이미지 업로드에 실패했습니다' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient()
    const { searchParams } = new URL(request.url)
    const imagePath = searchParams.get('path')
    const imageId = searchParams.get('id')

    if (!imagePath) {
      return NextResponse.json(
        { error: '삭제할 이미지 경로가 없습니다' },
        { status: 400 }
      )
    }

    // Extract file path from URL
    const urlParts = imagePath.split('/listing-images/')
    const filePath = urlParts[1]

    if (!filePath) {
      return NextResponse.json(
        { error: '유효하지 않은 이미지 경로입니다' },
        { status: 400 }
      )
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('listing-images')
      .remove([filePath])

    if (storageError) {
      throw storageError
    }

    // Delete from database if imageId is provided
    if (imageId) {
      const { error: dbError } = await supabase
        .from('listing_images')
        .delete()
        .eq('id', imageId)

      if (dbError) {
        throw dbError
      }
    }

    return NextResponse.json({
      message: '이미지가 삭제되었습니다'
    })

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: '이미지 삭제에 실패했습니다' },
      { status: 500 }
    )
  }
}