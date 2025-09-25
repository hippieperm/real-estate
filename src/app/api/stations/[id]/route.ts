import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase-server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerComponentClient()
    const stationId = params.id

    // Get station info
    const { data: station, error } = await supabase
      .from('stations')
      .select('*')
      .eq('id', stationId)
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      station,
    })

  } catch (error) {
    console.error('Station fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch station' },
      { status: 500 }
    )
  }
}