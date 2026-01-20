import { NextRequest, NextResponse } from 'next/server';
import { findUserById, updateUser, deleteUser, hashPassword } from '@/lib/userUtils';
import { AdminRole } from '@/lib/types';

// PUT: Update user (role, password reset)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { role, newPassword } = body;

    const user = findUserById(id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const updates: { role?: AdminRole; passwordHash?: string } = {};

    // Update role if provided
    if (role) {
      const validRoles: AdminRole[] = ['super_admin', 'admin'];
      if (!validRoles.includes(role)) {
        return NextResponse.json(
          { error: 'Invalid role' },
          { status: 400 }
        );
      }
      updates.role = role;
    }

    // Reset password if provided
    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters' },
          { status: 400 }
        );
      }
      updates.passwordHash = await hashPassword(newPassword);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid updates provided' },
        { status: 400 }
      );
    }

    const updatedUser = updateUser(id, updates);

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }

    // Return user without password hash
    const { passwordHash, ...safeUser } = updatedUser;
    return NextResponse.json(safeUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE: Remove user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = findUserById(id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const success = deleteUser(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete user' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
