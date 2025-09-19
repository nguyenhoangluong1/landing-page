import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function GET(request: NextRequest) {
  try {
    const result = await sql`
      SELECT * FROM story_milestones 
      ORDER BY sort_order ASC
    `

    return NextResponse.json({
      success: true,
      data: result.rows
    })
  } catch (error) {
    console.error('Get story milestones error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch story milestones' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, date, image_url, sort_order } = body

    if (!title || !description || !date) {
      return NextResponse.json(
        { error: 'Title, description, and date are required' },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO story_milestones (title, description, date, image_url, sort_order)
      VALUES (
        ${title}, 
        ${description}, 
        ${date}, 
        ${image_url || null},
        ${sort_order || (await sql`SELECT COALESCE(MAX(sort_order), 0) + 1 FROM story_milestones`).rows[0].coalesce}
      )
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Create story milestone error:', error)
    return NextResponse.json(
      { error: 'Failed to create story milestone' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, description, date, image_url, sort_order } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Milestone ID is required' },
        { status: 400 }
      )
    }

    const result = await sql`
      UPDATE story_milestones 
      SET 
        title = ${title},
        description = ${description},
        date = ${date},
        image_url = ${image_url},
        sort_order = ${sort_order},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Milestone not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Update story milestone error:', error)
    return NextResponse.json(
      { error: 'Failed to update story milestone' },
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
        { error: 'Milestone ID is required' },
        { status: 400 }
      )
    }

    const result = await sql`
      DELETE FROM story_milestones 
      WHERE id = ${id}
      RETURNING *
    `

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Milestone not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Story milestone deleted successfully'
    })
  } catch (error) {
    console.error('Delete story milestone error:', error)
    return NextResponse.json(
      { error: 'Failed to delete story milestone' },
      { status: 500 }
    )
  }
}