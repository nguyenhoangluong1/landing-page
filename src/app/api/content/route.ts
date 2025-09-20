import { NextRequest, NextResponse } from 'next/server'
import { Client } from 'pg'

// Create a database connection
async function createDbConnection() {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  await client.connect();
  return client;
}

export async function GET(request: NextRequest) {
  let client;
  try {
    client = await createDbConnection();
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')

    let query = `SELECT * FROM wedding_content`
    let params: any[] = []

    if (section) {
      query += ` WHERE section = $1`
      params = [section]
    }

    query += ` ORDER BY section, content_key`

    const result = await client.query(query, params)

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
  } finally {
    if (client) {
      await client.end();
    }
  }
}

export async function POST(request: NextRequest) {
  let client;
  try {
    client = await createDbConnection();
    const body = await request.json()
    const { section, content_key, content_value } = body

    if (!section || !content_key || content_value === undefined) {
      return NextResponse.json(
        { error: 'Section, content_key, and content_value are required' },
        { status: 400 }
      )
    }

    const result = await client.query(`
      INSERT INTO wedding_content (section, content_key, content_value)
      VALUES ($1, $2, $3)
      ON CONFLICT (section, content_key) 
      DO UPDATE SET 
        content_value = $3,
        updated_at = NOW()
      RETURNING *
    `, [section, content_key, JSON.stringify(content_value)]);

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
  } finally {
    if (client) {
      await client.end();
    }
  }
}

export async function PUT(request: NextRequest) {
  let client;
  try {
    client = await createDbConnection();
    const body = await request.json()
    const { id, section, content_key, content_value } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      )
    }

    const result = await client.query(`
      UPDATE wedding_content 
      SET 
        section = $1,
        content_key = $2,
        content_value = $3,
        updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `, [section, content_key, JSON.stringify(content_value), id]);

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
  } finally {
    if (client) {
      await client.end();
    }
  }
}

export async function DELETE(request: NextRequest) {
  let client;
  try {
    client = await createDbConnection();
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      )
    }

    const result = await client.query(`
      DELETE FROM wedding_content 
      WHERE id = $1
      RETURNING *
    `, [id]);

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
  } finally {
    if (client) {
      await client.end();
    }
  }
}