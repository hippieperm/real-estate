import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient()
    const body = await request.json()

    const {
      listing_id,
      name,
      phone,
      message,
      source = 'web',
    } = body

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { status: 400 }
      )
    }

    // Create inquiry
    const { data, error } = await supabase
      .from('inquiries')
      .insert({
        listing_id,
        name,
        phone,
        message,
        source,
        status: 'new',
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Here you could add email notification or Slack webhook
    // await sendNotification(data)

    return NextResponse.json({
      success: true,
      inquiry: data,
    })

  } catch (error) {
    console.error('Inquiry submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit inquiry' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's profile to check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    let query = supabase
      .from('inquiries')
      .select(`
        *,
        listings(title, address_road)
      `)

    // Filter based on role
    if (profile?.role === 'admin') {
      // Admin sees all
    } else if (profile?.role === 'agent') {
      // Agent sees assigned
      query = query.eq('assigned_to', user.id)
    } else {
      // Regular user sees none (or could see their own based on phone/email)
      return NextResponse.json({ inquiries: [] })
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ inquiries: data || [] })

  } catch (error) {
    console.error('Inquiries fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    )
  }
}