import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { sql } from '@vercel/postgres'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as string
    const alt_text = formData.get('alt_text') as string
    const is_featured = formData.get('is_featured') === 'true'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Upload to Vercel Blob Storage
    const blob = await put(file.name, file, {
      access: 'public',
    })

    // Save metadata to database
    const result = await sql`
      INSERT INTO media (
        filename, 
        original_filename, 
        url, 
        blob_url, 
        mime_type, 
        size,
        category,
        alt_text,
        is_featured,
        sort_order
      ) VALUES (
        ${blob.url.split('/').pop()},
        ${file.name},
        ${blob.url},
        ${blob.url},
        ${file.type},
        ${file.size},
        ${category || 'gallery'},
        ${alt_text || ''},
        ${is_featured},
        (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM media WHERE category = ${category || 'gallery'})
      )
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    let query = `SELECT * FROM media`
    const conditions: string[] = []
    const params: any[] = []

    if (category) {
      conditions.push(`category = $${params.length + 1}`)
      params.push(category)
    }

    if (featured === 'true') {
      conditions.push(`is_featured = true`)
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`
    }

    query += ` ORDER BY sort_order ASC, created_at DESC`

    const result = await sql.query(query, params)

    return NextResponse.json({
      success: true,
      data: result.rows
    })
  } catch (error) {
    console.error('Get media error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, alt_text, category, is_featured, sort_order } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Media ID is required' },
        { status: 400 }
      )
    }

    const result = await sql`
      UPDATE media 
      SET 
        alt_text = ${alt_text},
        category = ${category},
        is_featured = ${is_featured},
        sort_order = ${sort_order},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Update media error:', error)
    return NextResponse.json(
      { error: 'Failed to update media' },
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
        { error: 'Media ID is required' },
        { status: 400 }
      )
    }

    // Get media info before deletion
    const mediaResult = await sql`
      SELECT * FROM media WHERE id = ${id}
    `

    if (mediaResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      )
    }

    // Delete from database
    await sql`
      DELETE FROM media WHERE id = ${id}
    `

    // Note: In a production app, you'd also delete from Vercel Blob Storage
    // using the del() function from @vercel/blob

    return NextResponse.json({
      success: true,
      message: 'Media deleted successfully'
    })
  } catch (error) {
    console.error('Delete media error:', error)
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    )
  }
}