import { NextRequest, NextResponse } from 'next/server'import { NextRequest, NextResponse } from 'next/server'import { NextRequest, NextResponse } from 'next/server'

import { Client } from 'pg'

import fs from 'fs'import { Client } from 'pg'import { Client } from 'pg'

import path from 'path'

import fs from 'fs'import fs from 'fs'

// Create a database connection

async function createDbConnection() {import path from 'path'import path from 'path'

  const client = new Client({

    connectionString: process.env.POSTGRES_URL,

    ssl: {

      rejectUnauthorized: false// Create a database connection// Create a database connection

    }

  });async function createDbConnection() {async function createDbConnection() {

  

  await client.connect();  const client = new Client({  const client = new Client({

  return client;

}    connectionString: process.env.POSTGRES_URL,    connectionString: process.env.POSTGRES_URL,



export async function GET(request: NextRequest) {    ssl: {    ssl: {

  let client;

  try {      rejectUnauthorized: false      rejectUnauthorized: false

    client = await createDbConnection();

        }    }

    const { searchParams } = new URL(request.url)

    const category = searchParams.get('category') || 'gallery'  });  });



    const result = await client.query(`    

      SELECT * FROM media 

      WHERE category = $1   await client.connect();  await client.connect();

      ORDER BY sort_order ASC, created_at DESC

    `, [category])  return client;  return client;



    return NextResponse.json({}}

      success: true,

      data: result.rows

    })

  } catch (error) {export async function GET(request: NextRequest) {export async function GET(request: NextRequest) {

    console.error('Get media error:', error)

    return NextResponse.json(  let client;  let client;

      { error: 'Failed to fetch media' },

      { status: 500 }  try {  try {

    )

  } finally {    client = await createDbConnection();    client = await createDbConnection();

    if (client) {

      await client.end();        

    }

  }    const { searchParams } = new URL(request.url)    const { searchParams } = new URL(request.url)

}

    const category = searchParams.get('category') || 'gallery'    const category = searchParams.get('category') || 'gallery'

export async function POST(request: NextRequest) {

  let client;

  try {

    client = await createDbConnection();    const result = await client.query(`    const result = await client.query(`

    

    const formData = await request.formData()      SELECT * FROM media       SELECT * FROM media 

    const file = formData.get('image') as File || formData.get('file') as File

    const category = formData.get('category') as string || 'gallery'      WHERE category = $1       WHERE category = $1 

    const alt_text = formData.get('alt_text') as string || ''

    const is_featured = formData.get('is_featured') === 'true'      ORDER BY sort_order ASC, created_at DESC      ORDER BY sort_order ASC, created_at DESC



    if (!file) {    `, [category])    `, [category])

      return NextResponse.json(

        { error: 'No file provided' },

        { status: 400 }

      )    return NextResponse.json({    return NextResponse.json({

    }

      success: true,      success: true,

    // Create uploads directory if it doesn't exist

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')      data: result.rows      data: result.rows

    if (!fs.existsSync(uploadsDir)) {

      fs.mkdirSync(uploadsDir, { recursive: true })    })    })

    }

  } catch (error) {  } catch (error) {

    // Generate unique filename

    const timestamp = Date.now()    console.error('Get media error:', error)    console.error('Get media error:', error)

    const filename = `${timestamp}-${file.name}`

    const filepath = path.join(uploadsDir, filename)    return NextResponse.json(    return NextResponse.json(



    // Save file to public/uploads directory      { error: 'Failed to fetch media' },      { error: 'Failed to fetch media' },

    const buffer = Buffer.from(await file.arrayBuffer())

    fs.writeFileSync(filepath, buffer)      { status: 500 }      { status: 500 }



    const publicUrl = `/uploads/${filename}`    )    )



    // Save metadata to database  } finally {  } finally {

    const result = await client.query(`

      INSERT INTO media (    if (client) {    if (client) {

        filename, 

        original_filename,       await client.end();      await client.end();

        url, 

        mime_type,     }    }

        size,

        category,  }  }

        alt_text,

        is_featured,}}

        sort_order

      ) VALUES (

        $1, $2, $3, $4, $5, $6, $7, $8,

        (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM media WHERE category = $6)export async function POST(request: NextRequest) {export async function POST(request: NextRequest) {

      )

      RETURNING *  let client;  let client;

    `, [

      filename,  try {  try {

      file.name,

      publicUrl,    client = await createDbConnection();    client = await createDbConnection();

      file.type,

      file.size,        

      category,

      alt_text,    const formData = await request.formData()    const formData = await request.formData()

      is_featured

    ])    const file = formData.get('image') as File || formData.get('file') as File    const file = formData.get('image') as File || formData.get('file') as File



    return NextResponse.json({    const category = formData.get('category') as string || 'gallery'    const category = formData.get('category') as string || 'gallery'

      success: true,

      data: result.rows[0]    const alt_text = formData.get('alt_text') as string || ''    const alt_text = formData.get('alt_text') as string || ''

    })

  } catch (error) {    const is_featured = formData.get('is_featured') === 'true'    const is_featured = formData.get('is_featured') === 'true'

    console.error('Upload media error:', error)

    return NextResponse.json(

      { error: 'Failed to upload media' },

      { status: 500 }    if (!file) {    if (!file) {

    )

  } finally {      return NextResponse.json(      return NextResponse.json(

    if (client) {

      await client.end();        { error: 'No file provided' },        { error: 'No file provided' },

    }

  }        { status: 400 }        { status: 400 }

}

      )      )

export async function DELETE(request: NextRequest) {

  let client;    }    }

  try {

    client = await createDbConnection();

    

    const { searchParams } = new URL(request.url)    // Create uploads directory if it doesn't exist    // Create uploads directory if it doesn't exist

    const id = searchParams.get('id')

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

    if (!id) {

      return NextResponse.json(    if (!fs.existsSync(uploadsDir)) {    if (!fs.existsSync(uploadsDir)) {

        { error: 'Media ID is required' },

        { status: 400 }      fs.mkdirSync(uploadsDir, { recursive: true })      fs.mkdirSync(uploadsDir, { recursive: true })

      )

    }    }    }



    // Get media info before deleting

    const mediaResult = await client.query(`

      SELECT * FROM media WHERE id = $1    // Generate unique filename    // Generate unique filename

    `, [id])

    const timestamp = Date.now()    const timestamp = Date.now()

    if (mediaResult.rows.length === 0) {

      return NextResponse.json(    const filename = `${timestamp}-${file.name}`    const filename = `${timestamp}-${file.name}`

        { error: 'Media not found' },

        { status: 404 }    const filepath = path.join(uploadsDir, filename)    const filepath = path.join(uploadsDir, filename)

      )

    }



    const media = mediaResult.rows[0]    // Save file to public/uploads directory    // Save file to public/uploads directory



    // Delete file from filesystem    const buffer = Buffer.from(await file.arrayBuffer())    const buffer = Buffer.from(await file.arrayBuffer())

    const filepath = path.join(process.cwd(), 'public', media.url)

    if (fs.existsSync(filepath)) {    fs.writeFileSync(filepath, buffer)    fs.writeFileSync(filepath, buffer)

      fs.unlinkSync(filepath)

    }



    // Delete from database    const publicUrl = `/uploads/${filename}`    const publicUrl = `/uploads/${filename}`

    await client.query(`

      DELETE FROM media WHERE id = $1

    `, [id])

    // Save metadata to database    // Save metadata to database

    return NextResponse.json({

      success: true,    const result = await client.query(`    const result = await client.query(`

      message: 'Media deleted successfully'

    })      INSERT INTO media (      INSERT INTO media (

  } catch (error) {

    console.error('Delete media error:', error)        filename,         filename, 

    return NextResponse.json(

      { error: 'Failed to delete media' },        original_filename,         original_filename, 

      { status: 500 }

    )        url,         url, 

  } finally {

    if (client) {        mime_type,         mime_type, 

      await client.end();

    }        size,        size,

  }

}        category,        category,

        alt_text,        alt_text,

        is_featured,        is_featured,

        sort_order        sort_order

      ) VALUES (      ) VALUES (

        $1, $2, $3, $4, $5, $6, $7, $8,        $1, $2, $3, $4, $5, $6, $7, $8,

        (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM media WHERE category = $6)        (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM media WHERE category = $6)

      )      )

      RETURNING *      RETURNING *

    `, [    `, [

      filename,      filename,

      file.name,      file.name,

      publicUrl,      publicUrl,

      file.type,      file.type,

      file.size,      file.size,

      category,      category,

      alt_text,      alt_text,

      is_featured      is_featured

    ])    ])



    return NextResponse.json({    return NextResponse.json({

      success: true,      success: true,

      data: result.rows[0]      data: result.rows[0]

    })    })

  } catch (error) {  } catch (error) {

    console.error('Upload media error:', error)    console.error('Upload media error:', error)

    return NextResponse.json(    return NextResponse.json(

      { error: 'Failed to upload media' },      { error: 'Failed to upload media' },

      { status: 500 }      { status: 500 }

    )    )

  } finally {  } finally {

    if (client) {    if (client) {

      await client.end();      await client.end();

    }    }

  }  }

}}

    `

export async function DELETE(request: NextRequest) {

  let client;    return NextResponse.json({

  try {      success: true,

    client = await createDbConnection();      data: result.rows[0]

        })

    const { searchParams } = new URL(request.url)  } catch (error) {

    const id = searchParams.get('id')    console.error('Upload error:', error)

    return NextResponse.json(

    if (!id) {      { error: 'Failed to upload file' },

      return NextResponse.json(      { status: 500 }

        { error: 'Media ID is required' },    )

        { status: 400 }  }

      )}

    }

export async function GET(request: NextRequest) {

    // Get media info before deleting  try {

    const mediaResult = await client.query(`    const { searchParams } = new URL(request.url)

      SELECT * FROM media WHERE id = $1    const category = searchParams.get('category')

    `, [id])    const featured = searchParams.get('featured')



    if (mediaResult.rows.length === 0) {    let query = `SELECT * FROM media`

      return NextResponse.json(    const conditions: string[] = []

        { error: 'Media not found' },    const params: any[] = []

        { status: 404 }

      )    if (category) {

    }      conditions.push(`category = $${params.length + 1}`)

      params.push(category)

    const media = mediaResult.rows[0]    }



    // Delete file from filesystem    if (featured === 'true') {

    const filepath = path.join(process.cwd(), 'public', media.url)      conditions.push(`is_featured = true`)

    if (fs.existsSync(filepath)) {    }

      fs.unlinkSync(filepath)

    }    if (conditions.length > 0) {

      query += ` WHERE ${conditions.join(' AND ')}`

    // Delete from database    }

    await client.query(`

      DELETE FROM media WHERE id = $1    query += ` ORDER BY sort_order ASC, created_at DESC`

    `, [id])

    const result = await sql.query(query, params)

    return NextResponse.json({

      success: true,    return NextResponse.json({

      message: 'Media deleted successfully'      success: true,

    })      data: result.rows

  } catch (error) {    })

    console.error('Delete media error:', error)  } catch (error) {

    return NextResponse.json(    console.error('Get media error:', error)

      { error: 'Failed to delete media' },    return NextResponse.json(

      { status: 500 }      { error: 'Failed to fetch media' },

    )      { status: 500 }

  } finally {    )

    if (client) {  }

      await client.end();}

    }

  }export async function PUT(request: NextRequest) {

}  try {
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