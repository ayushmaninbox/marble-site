import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db';
import { initializeDefaultAdmin } from '@/lib/userUtils';

// POST: Initialize database tables and default admin
export async function POST() {
  try {
    // Initialize all database tables
    await initializeDatabase();
    
    // Create default admin if no users exist
    await initializeDefaultAdmin();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database initialized successfully' 
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database', details: String(error) },
      { status: 500 }
    );
  }
}
