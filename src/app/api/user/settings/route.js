import { NextResponse } from 'next/server';
import { saveUser, getUser } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = getUser(email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Fetch settings error:', error);
    return NextResponse.json({ error: 'Server error fetching settings' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { email, name, avatarId, settings, avatarUrl } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const existingUser = getUser(email);
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update settings in database
    const updatedUser = saveUser(
      email,
      name,
      avatarId,
      settings,
      avatarUrl
    );

    return NextResponse.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json({ error: 'Server error updating settings' }, { status: 500 });
  }
}

