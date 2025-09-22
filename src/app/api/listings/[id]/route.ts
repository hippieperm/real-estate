import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase-server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerComponentClient()

    const { data: listing, error } = await supabase
      .from('listings')
      .select(`
        *,
        listing_images(path, sort_order),
        listing_stations(
          station_id,
          distance_m,
          stations(name, line)
        ),
        listing_regions(
          region_id,
          regions(sido, sigungu, dong)
        ),
        listing_themes(
          theme_id,
          theme_categories(key, label_ko)
        ),
        created_by(
          name,
          phone,
          company
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Listing not found' },
          { status: 404 }
        )
      }
      throw error
    }

    // Track view if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from('recently_viewed')
        .upsert({
          user_id: user.id,
          listing_id: params.id,
          viewed_at: new Date().toISOString(),
        })
        .select()
    }

    return NextResponse.json(listing)

  } catch (error) {
    console.error('Listing fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listing' },
      { status: 500 }
    )
  }
}