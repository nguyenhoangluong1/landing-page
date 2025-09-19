import { sql } from '@vercel/postgres'

// Database initialization scripts
export const createTables = async () => {
  try {
    // Users table for admin authentication
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Media table for file management
    await sql`
      CREATE TABLE IF NOT EXISTS media (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        filename VARCHAR(255) NOT NULL,
        original_filename VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        blob_url TEXT NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        size INTEGER NOT NULL,
        width INTEGER,
        height INTEGER,
        alt_text TEXT,
        category VARCHAR(50) NOT NULL CHECK (category IN ('hero', 'gallery', 'story', 'venue', 'couple', 'family')),
        sort_order INTEGER DEFAULT 0,
        is_featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Wedding content table for dynamic content management
    await sql`
      CREATE TABLE IF NOT EXISTS wedding_content (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        section VARCHAR(100) NOT NULL,
        content_key VARCHAR(100) NOT NULL,
        content_value JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(section, content_key)
      )
    `

    // Story milestones table
    await sql`
      CREATE TABLE IF NOT EXISTS story_milestones (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        date VARCHAR(50) NOT NULL,
        image_url TEXT,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Family members table
    await sql`
      CREATE TABLE IF NOT EXISTS family_members (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('bride', 'groom', 'bridesmaid', 'groomsman', 'parent', 'family')),
        description TEXT,
        image_url TEXT,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_media_category ON media(category)`
    await sql`CREATE INDEX IF NOT EXISTS idx_media_sort_order ON media(sort_order)`
    await sql`CREATE INDEX IF NOT EXISTS idx_wedding_content_section ON wedding_content(section)`
    await sql`CREATE INDEX IF NOT EXISTS idx_story_milestones_sort_order ON story_milestones(sort_order)`
    await sql`CREATE INDEX IF NOT EXISTS idx_family_members_role ON family_members(role)`

    console.log('Database tables created successfully')
  } catch (error) {
    console.error('Error creating tables:', error)
    throw error
  }
}

// Default data insertion
export const seedDatabase = async () => {
  try {
    // Insert default admin user (password: admin123)
    const adminExists = await sql`SELECT id FROM users WHERE email = 'admin@wedding.com'`
    if (adminExists.rows.length === 0) {
      const bcrypt = require('bcryptjs')
      const hashedPassword = await bcrypt.hash('admin123', 12)
      
      await sql`
        INSERT INTO users (email, password_hash, role)
        VALUES ('admin@wedding.com', ${hashedPassword}, 'admin')
      `
    }

    // Insert default wedding content
    const defaultContent = [
      {
        section: 'hero',
        content_key: 'couple_names',
        content_value: { bride: 'Emma', groom: 'James' }
      },
      {
        section: 'hero',
        content_key: 'wedding_date',
        content_value: { date: '2024-06-15', display: 'June 15, 2024' }
      },
      {
        section: 'hero',
        content_key: 'hero_text',
        content_value: { 
          title: 'Together Forever',
          subtitle: 'Join us as we begin our journey as one'
        }
      },
      {
        section: 'venue',
        content_key: 'ceremony',
        content_value: {
          name: 'St. Mary\'s Cathedral',
          address: '123 Church Street, New York, NY 10001',
          date: '2024-06-15',
          time: '3:00 PM'
        }
      },
      {
        section: 'venue',
        content_key: 'reception',
        content_value: {
          name: 'The Grand Ballroom',
          address: '456 Celebration Ave, New York, NY 10002',
          date: '2024-06-15',
          time: '6:00 PM'
        }
      },
      {
        section: 'rsvp',
        content_key: 'deadline',
        content_value: { date: '2024-05-15', display: 'May 15, 2024' }
      }
    ]

    for (const content of defaultContent) {
      await sql`
        INSERT INTO wedding_content (section, content_key, content_value)
        VALUES (${content.section}, ${content.content_key}, ${JSON.stringify(content.content_value)})
        ON CONFLICT (section, content_key) DO NOTHING
      `
    }

    // Insert default story milestones
    const defaultStoryMilestones = [
      {
        title: 'First Meeting',
        description: 'We met at a coffee shop downtown on a rainy Tuesday morning.',
        date: 'Fall 2020',
        sort_order: 1
      },
      {
        title: 'First Date',
        description: 'Our first official date was at the botanical gardens.',
        date: 'Winter 2020',
        sort_order: 2
      },
      {
        title: 'Moving In Together',
        description: 'We decided to take the next step and move in together.',
        date: 'Summer 2021',
        sort_order: 3
      },
      {
        title: 'The Proposal',
        description: 'James proposed during our weekend getaway to the mountains.',
        date: 'Spring 2023',
        sort_order: 4
      }
    ]

    for (const milestone of defaultStoryMilestones) {
      await sql`
        INSERT INTO story_milestones (title, description, date, sort_order)
        VALUES (${milestone.title}, ${milestone.description}, ${milestone.date}, ${milestone.sort_order})
        ON CONFLICT DO NOTHING
      `
    }

    console.log('Database seeded successfully')
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}