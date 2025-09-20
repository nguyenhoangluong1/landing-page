require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcryptjs');
const { Client } = require('pg');

async function initializeDatabase() {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🚀 Initializing wedding website database...');
    console.log('');
    console.log('Connecting to database...');
    
    await client.connect();
    console.log('✅ Connected to database!');
    
    console.log('Creating all necessary tables...');
    
    // Users table for admin authentication
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Media table for file management
    await client.query(`
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
    `);

    // Wedding content table for dynamic content management
    await client.query(`
      CREATE TABLE IF NOT EXISTS wedding_content (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        section VARCHAR(100) NOT NULL,
        content_key VARCHAR(100) NOT NULL,
        content_value JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(section, content_key)
      )
    `);

    // Story milestones table
    await client.query(`
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
    `);

    // Family members table
    await client.query(`
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
    `);

    // RSVP responses table
    await client.query(`
      CREATE TABLE IF NOT EXISTS rsvp_responses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        attendance VARCHAR(20) NOT NULL CHECK (attendance IN ('yes', 'no', 'maybe')),
        guests INTEGER DEFAULT 1,
        dietary_restrictions TEXT,
        message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create indexes for better performance
    await client.query('CREATE INDEX IF NOT EXISTS idx_media_category ON media(category)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_media_sort_order ON media(sort_order)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_wedding_content_section ON wedding_content(section)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_story_milestones_sort_order ON story_milestones(sort_order)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_family_members_role ON family_members(role)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_rsvp_responses_attendance ON rsvp_responses(attendance)');

    console.log('✅ All tables created/verified!');
    console.log('Checking for existing admin user...');
    
    // Check if admin exists
    const adminExists = await client.query('SELECT id FROM users WHERE email = $1', ['admin@wedding.com']);
    
    if (adminExists.rows.length === 0) {
      console.log('Creating new admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      await client.query(
        'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)',
        ['admin@wedding.com', hashedPassword, 'admin']
      );
      
      console.log('');
      console.log('🎉 SUCCESS! Admin user created!');
    } else {
      console.log('');
      console.log('✅ Admin user already exists!');
    }

    // Insert default content if it doesn't exist
    console.log('Setting up default wedding content...');
    
    const defaultContent = [
      { section: 'hero', key: 'couple_names', value: { bride: 'Emma', groom: 'James' } },
      { section: 'hero', key: 'wedding_date', value: { date: '2024-06-15', display: 'June 15, 2024' } },
      { section: 'hero', key: 'hero_text', value: { title: 'Together Forever', subtitle: 'Join us as we begin our journey as one' } },
      { section: 'venue', key: 'ceremony', value: { name: 'St. Mary\'s Cathedral', address: '123 Church Street, New York, NY 10001', date: '2024-06-15', time: '3:00 PM' } },
      { section: 'venue', key: 'reception', value: { name: 'The Grand Ballroom', address: '456 Celebration Ave, New York, NY 10002', date: '2024-06-15', time: '6:00 PM' } }
    ];

    for (const content of defaultContent) {
      await client.query(`
        INSERT INTO wedding_content (section, content_key, content_value)
        VALUES ($1, $2, $3)
        ON CONFLICT (section, content_key) DO NOTHING
      `, [content.section, content.key, JSON.stringify(content.value)]);
    }

    // Insert default story milestones if none exist
    const existingMilestones = await client.query('SELECT COUNT(*) FROM story_milestones');
    if (parseInt(existingMilestones.rows[0].count) === 0) {
      const defaultMilestones = [
        { title: 'First Met', description: 'Our paths crossed for the first time', date: '2019-03-15', sort_order: 1 },
        { title: 'First Date', description: 'Our first official date', date: '2019-04-10', sort_order: 2 },
        { title: 'Moving In Together', description: 'We decided to take the next step', date: '2020-08-22', sort_order: 3 },
        { title: 'The Proposal', description: 'He asked, and she said yes!', date: '2023-12-24', sort_order: 4 },
        { title: 'Wedding Day', description: 'The beginning of our forever', date: '2024-06-15', sort_order: 5 }
      ];

      for (const milestone of defaultMilestones) {
        await client.query(`
          INSERT INTO story_milestones (title, description, date, sort_order)
          VALUES ($1, $2, $3, $4)
        `, [milestone.title, milestone.description, milestone.date, milestone.sort_order]);
      }
      
      console.log('✅ Default story milestones created!');
    }

    await client.end();
    
    console.log('');
    console.log('🔐 YOUR LOGIN CREDENTIALS:');
    console.log('📧 Email: admin@wedding.com');
    console.log('🔒 Password: admin123');
    console.log('');
    console.log('🌐 Admin Panel URL:');
    console.log('🔗 Production: https://nhluong2809-ku2hvqa3u-hluongng2809s-projects-98aa8592.vercel.app/admin');
    console.log('🔗 Local: http://localhost:3000/admin');
    console.log('');
    console.log('✨ You can now login and manage:');
    console.log('  • Wedding content (hero, venue details)');
    console.log('  • Story milestones');
    console.log('  • Photo gallery');
    console.log('  • RSVP responses');
    console.log('  • Family members');
    console.log('');
    console.log('🎊 Database initialization completed successfully!');
  } catch (error) {
    console.error('');
    console.error('❌ Database initialization failed:');
    console.error('Error details:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('');
      console.error('💡 CONNECTION ISSUE: Cannot connect to database');
      console.error('Check your POSTGRES_URL in .env.local file');
    }
    
    try {
      await client.end();
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

initializeDatabase();