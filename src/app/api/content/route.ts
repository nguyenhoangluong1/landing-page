import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')

    let query = `SELECT * FROM wedding_content`
    let params: any[] = []

    if (section) {
      query += ` WHERE section = $1`
      params = [section]
    }

    query += ` ORDER BY section, content_key`

    const result = await sql.query(query, params)

    return NextResponse.json({
      success: true,
      data: result.rows
    })
  } catch (error) {
    console.error('Get content error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { section, content_key, content_value } = body

    if (!section || !content_key || content_value === undefined) {
      return NextResponse.json(
        { error: 'Section, content_key, and content_value are required' },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO wedding_content (section, content_key, content_value)
      VALUES (${section}, ${content_key}, ${JSON.stringify(content_value)})
      ON CONFLICT (section, content_key) 
      DO UPDATE SET 
        content_value = ${JSON.stringify(content_value)},
        updated_at = NOW()
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Create/update content error:', error)
    return NextResponse.json(
      { error: 'Failed to save content' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, section, content_key, content_value } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      )
    }

    const result = await sql`
      UPDATE wedding_content 
      SET 
        section = ${section},
        content_key = ${content_key},
        content_value = ${JSON.stringify(content_value)},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Update content error:', error)
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      )
    }

    const result = await sql`
      DELETE FROM wedding_content 
      WHERE id = ${id}
      RETURNING *
    `

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Content deleted successfully'
    })
  } catch (error) {
    console.error('Delete content error:', error)
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    )
  }
}