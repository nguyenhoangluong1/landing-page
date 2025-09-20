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
    
    const result = await client.query(`
      SELECT * FROM story_milestones 
      ORDER BY sort_order ASC, created_at ASC
    `);

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
    const { title, description, date, image_url, sort_order } = body

    if (!title || !description || !date) {
      return NextResponse.json(
        { error: 'Title, description, and date are required' },
        { status: 400 }
      )
    }

    // Get the next sort order if not provided
    let nextSortOrder = sort_order;
    if (nextSortOrder === undefined || nextSortOrder === null) {
      const maxResult = await client.query('SELECT COALESCE(MAX(sort_order), 0) + 1 as next_order FROM story_milestones');
      nextSortOrder = maxResult.rows[0].next_order;
    }

    const result = await client.query(`
      INSERT INTO story_milestones (title, description, date, image_url, sort_order)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [title, description, date, image_url, nextSortOrder]);

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Story milestone created successfully'
    })
  } catch (error) {
    console.error('Create story milestone error:', error)
    return NextResponse.json(
      { error: 'Failed to create story milestone' },
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
    const { id, title, description, date, image_url, sort_order } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Milestone ID is required' },
        { status: 400 }
      )
    }

    const result = await client.query(`
      UPDATE story_milestones 
      SET 
        title = $1,
        description = $2,
        date = $3,
        image_url = $4,
        sort_order = $5,
        updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `, [title, description, date, image_url, sort_order, id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Milestone not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Story milestone updated successfully'
    })
  } catch (error) {
    console.error('Update story milestone error:', error)
    return NextResponse.json(
      { error: 'Failed to update story milestone' },
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
        { error: 'Milestone ID is required' },
        { status: 400 }
      )
    }

    const result = await client.query(`
      DELETE FROM story_milestones 
      WHERE id = $1
      RETURNING *
    `, [id]);

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
  } finally {
    if (client) {
      await client.end();
    }
  }
}