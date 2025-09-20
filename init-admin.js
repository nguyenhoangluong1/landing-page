require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcryptjs');
const { createClient } = require('@vercel/postgres');

async function initializeDatabase() {
  // Create a client instance
  const client = createClient({
    connectionString: process.env.POSTGRES_URL
  });

  try {
    console.log('🚀 Starting database initialization...');
    console.log('Connecting to database...');
    
    console.log('Creating users table...');
    
    // Users table for admin authentication
    await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    console.log('✅ Users table created/verified!');
    console.log('Checking for existing admin user...');
    
    // Check if admin exists
    const adminExists = await client.sql`SELECT id FROM users WHERE email = 'admin@wedding.com'`;
    
    if (adminExists.rows.length === 0) {
      console.log('Creating new admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      await client.sql`
        INSERT INTO users (email, password_hash, role)
        VALUES ('admin@wedding.com', ${hashedPassword}, 'admin')
      `;
      
      console.log('');
      console.log('🎉 SUCCESS! Admin user created!');
      console.log('');
      console.log('🔐 LOGIN CREDENTIALS:');
      console.log('📧 Email: admin@wedding.com');
      console.log('🔒 Password: admin123');
      console.log('');
      console.log('✨ You can now login to your admin panel!');
    } else {
      console.log('');
      console.log('✅ Admin user already exists!');
      console.log('');
      console.log('🔐 LOGIN CREDENTIALS:');
      console.log('📧 Email: admin@wedding.com');
      console.log('🔒 Password: admin123');
      console.log('');
    }

    console.log('🎊 Database initialization completed successfully!');
  } catch (error) {
    console.error('');
    console.error('❌ Database initialization failed:');
    console.error('Error details:', error.message);
    
    if (error.code === 'missing_connection_string') {
      console.error('');
      console.error('💡 SOLUTION: Make sure your .env.local file contains:');
      console.error('POSTGRES_URL="your-database-connection-string"');
    }
  }
}

console.log('🚀 Initializing wedding website database...');
console.log('');
initializeDatabase();