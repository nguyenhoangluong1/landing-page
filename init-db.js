const bcrypt = require('bcryptjs');
const { sql } = require('@vercel/postgres');

async function initializeDatabase() {
  try {
    console.log('Creating tables...');
    
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
    `;

    console.log('Creating admin user...');
    
    // Check if admin exists
    const adminExists = await sql`SELECT id FROM users WHERE email = 'admin@wedding.com'`;
    
    if (adminExists.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      await sql`
        INSERT INTO users (email, password_hash, role)
        VALUES ('admin@wedding.com', ${hashedPassword}, 'admin')
      `;
      
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: admin@wedding.com');
      console.log('🔒 Password: admin123');
    } else {
      console.log('✅ Admin user already exists!');
    }

    console.log('🎉 Database initialization completed!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
}

initializeDatabase();