import { NextResponse } from 'next/server';
import { verifyOtp, getUser, saveUser, getUserBookmarks } from '@/lib/db';

export async function POST(request) {
  try {
    const { email, code, name } = await request.json();
    if (!email || !code) {
      return NextResponse.json({ error: 'Email and verification code are required' }, { status: 400 });
    }

    const success = verifyOtp(email, code);
    if (!success) {
      return NextResponse.json({ error: 'Incorrect or expired verification code. Please try again.' }, { status: 400 });
    }

    // Check if user already exists
    let user = getUser(email);
    if (!user) {
      // Create a new user profile using Gravatar as default PFP
      user = saveUser(email, name || email.split('@')[0], 'gravatar', {
        defaultCountry: '',
        defaultFeedMode: 'detailed',
        notifications: true
      });
    }

    const bookmarks = getUserBookmarks(email);

    return NextResponse.json({
      success: true,
      user,
      bookmarks
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json({ error: 'Server error verifying OTP' }, { status: 500 });
  }
}
