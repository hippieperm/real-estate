import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient()
    const body = await request.json()

    const {
      query,
      property_type,
      min_deposit,
      max_deposit,
      min_monthly,
      max_monthly,
      min_pyeong,
      max_pyeong,
      floors,
      themes,
      stations,
      regions,
      near_boulevard,
      sort_by = 'created_at',
      sort_order = 'desc',
      page = 1,
      limit = 20,
      bounds, // Map bounds: { north, south, east, west }
    } = body

    // Start building the query
    let queryBuilder = supabase
      .from('listings')
      .select(`
        *,
        listing_images(path, sort_order),
        listing_stations(
          station_id,
          distance_m,
          stations(name, line)
        ),
        listing_themes(
          theme_id,
          theme_categories(key, label_ko)
        )
      `, { count: 'exact' })
      .eq('status', 'active')

    // Text search
    if (query) {
      queryBuilder = queryBuilder.or(
        `title.ilike.%${query}%,address_road.ilike.%${query}%,address_jibun.ilike.%${query}%`
      )
    }

    // Property type filter
    if (property_type && property_type.length > 0) {
      queryBuilder = queryBuilder.in('property_type', property_type)
    }

    // Price filters
    if (min_deposit !== undefined) {
      queryBuilder = queryBuilder.gte('price_deposit', min_deposit)
    }
    if (max_deposit !== undefined) {
      queryBuilder = queryBuilder.lte('price_deposit', max_deposit)
    }
    if (min_monthly !== undefined) {
      queryBuilder = queryBuilder.gte('price_monthly', min_monthly)
    }
    if (max_monthly !== undefined) {
      queryBuilder = queryBuilder.lte('price_monthly', max_monthly)
    }

    // Area filters (pyeong)
    if (min_pyeong !== undefined) {
      queryBuilder = queryBuilder.gte('pyeong_exclusive', min_pyeong)
    }
    if (max_pyeong !== undefined) {
      queryBuilder = queryBuilder.lte('pyeong_exclusive', max_pyeong)
    }

    // Floor filter
    if (floors && floors.length > 0) {
      queryBuilder = queryBuilder.in('floor', floors)
    }

    // Boulevard filter
    if (near_boulevard !== undefined) {
      queryBuilder = queryBuilder.eq('near_boulevard', near_boulevard)
    }

    // Theme filter
    if (themes && themes.length > 0) {
      const { data: themedListings } = await supabase
        .from('listing_themes')
        .select('listing_id')
        .in('theme_id', themes)

      if (themedListings) {
        const listingIds = themedListings.map(lt => lt.listing_id)
        queryBuilder = queryBuilder.in('id', listingIds)
      }
    }

    // Station filter
    if (stations && stations.length > 0) {
      const { data: stationListings } = await supabase
        .from('listing_stations')
        .select('listing_id')
        .in('station_id', stations)
        .lte('distance_m', 500) // Within 500m of station

      if (stationListings) {
        const listingIds = stationListings.map(ls => ls.listing_id)
        queryBuilder = queryBuilder.in('id', listingIds)
      }
    }

    // Region filter
    if (regions && regions.length > 0) {
      const { data: regionListings } = await supabase
        .from('listing_regions')
        .select('listing_id')
        .in('region_id', regions)

      if (regionListings) {
        const listingIds = regionListings.map(lr => lr.listing_id)
        queryBuilder = queryBuilder.in('id', listingIds)
      }
    }

    // Sorting
    if (sort_by === 'price_deposit') {
      queryBuilder = queryBuilder.order('price_deposit', { ascending: sort_order === 'asc' })
    } else if (sort_by === 'price_monthly') {
      queryBuilder = queryBuilder.order('price_monthly', { ascending: sort_order === 'asc' })
    } else if (sort_by === 'pyeong_exclusive') {
      queryBuilder = queryBuilder.order('pyeong_exclusive', { ascending: sort_order === 'asc' })
    } else {
      queryBuilder = queryBuilder.order('created_at', { ascending: false })
    }

    // Pagination
    const offset = (page - 1) * limit
    queryBuilder = queryBuilder.range(offset, offset + limit - 1)

    // Execute query
    const { data, count, error } = await queryBuilder

    if (error) {
      throw error
    }

    // If map bounds are provided, filter by location
    let filteredData = data
    if (bounds && data) {
      // This would normally be done with PostGIS ST_Within, but for simplicity:
      filteredData = data.filter((listing: any) => {
        // Parse location coordinates from PostGIS
        // Actual implementation would depend on how location is stored
        return true // Placeholder
      })
    }

    return NextResponse.json({
      listings: filteredData || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    })

  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}