import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, validatePassword, updateLastLogin } from '@/lib/userUtils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // For backward compatibility, also accept username field
    const userEmail = email || body.username;
    
    if (!userEmail || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Handle legacy 'admin' username
    const lookupEmail = userEmail === 'admin' ? 'admin@shreeradhemarble.com' : userEmail;
    
    const user = findUserByEmail(lookupEmail);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValidPassword = await validatePassword(password, user.passwordHash);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Update last login timestamp
    updateLastLogin(user.id);

    // Return user info (without password hash)
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { success: false, message: 'Login failed' },
      { status: 500 }
    );
  }
}
