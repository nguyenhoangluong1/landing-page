import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { Client } from 'pg'
import type { User, AdminUser } from '@/types'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = '7d'

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

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: AdminUser): string {
  return jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

export function verifyToken(token: string): { userId: string; email: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string }
  } catch (error) {
    return null
  }
}

export async function authenticate(email: string, password: string): Promise<AdminUser | null> {
  let client;
  try {
    client = await createDbConnection();
    
    const result = await client.query(
      'SELECT id, email, password_hash, role FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return null
    }

    const user = result.rows[0]
    const isValidPassword = await verifyPassword(password, user.password_hash)
    
    if (!isValidPassword) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  } finally {
    if (client) {
      await client.end();
    }
  }
}

export async function createAdminUser(email: string, password: string, role: 'admin' | 'editor' = 'editor'): Promise<AdminUser | null> {
  let client;
  try {
    client = await createDbConnection();
    const hashedPassword = await hashPassword(password)
    
    const result = await client.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role',
      [email, hashedPassword, role]
    );
    
    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0] as AdminUser
  } catch (error) {
    console.error('Create admin user error:', error)
    return null
  } finally {
    if (client) {
      await client.end();
    }
  }
}

export async function getUserById(userId: string): Promise<AdminUser | null> {
  let client;
  try {
    client = await createDbConnection();
    
    const result = await client.query(
      'SELECT id, email, role FROM users WHERE id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0] as AdminUser
  } catch (error) {
    console.error('Get user by ID error:', error)
    return null
  } finally {
    if (client) {
      await client.end();
    }
  }
}

export function requireAuth(requiredRole?: 'admin' | 'editor') {
  return function(handler: Function) {
    return async function(req: any, res: any, ...args: any[]) {
      const authHeader = req.headers.authorization
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' })
      }

      const token = authHeader.substring(7)
      const payload = verifyToken(token)
      
      if (!payload) {
        return res.status(401).json({ error: 'Invalid token' })
      }

      // Check role if required
      if (requiredRole && payload.role !== 'admin' && payload.role !== requiredRole) {
        return res.status(403).json({ error: 'Insufficient permissions' })
      }

      // Add user info to request
      req.user = payload
      
      return handler(req, res, ...args)
    }
  }
}