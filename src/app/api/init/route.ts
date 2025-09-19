import { NextRequest, NextResponse } from 'next/server'
import { createTables, seedDatabase } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    // This endpoint should be protected in production
    const { action } = await request.json()

    if (action === 'init') {
      await createTables()
      await seedDatabase()
      
      return NextResponse.json({
        success: true,
        message: 'Database initialized successfully'
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Database initialization error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize database' },
      { status: 500 }
    )
  }
}