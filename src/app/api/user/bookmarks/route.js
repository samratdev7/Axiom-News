import { NextResponse } from 'next/server';
import { getUserBookmarks, addBookmark, removeBookmark, clearBookmarks } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const bookmarks = getUserBookmarks(email);
    return NextResponse.json({ success: true, bookmarks });
  } catch (error) {
    console.error('Fetch bookmarks error:', error);
    return NextResponse.json({ error: 'Server error fetching bookmarks' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { email, action, article, articleId } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    let bookmarks = [];
    if (action === 'add') {
      if (!article) {
        return NextResponse.json({ error: 'Article payload is required for addition' }, { status: 400 });
      }
      bookmarks = addBookmark(email, article);
    } else if (action === 'remove') {
      if (!articleId) {
        return NextResponse.json({ error: 'Article ID is required for removal' }, { status: 400 });
      }
      bookmarks = removeBookmark(email, articleId);
    } else {
      return NextResponse.json({ error: 'Invalid action specify add or remove' }, { status: 400 });
    }

    return NextResponse.json({ success: true, bookmarks });
  } catch (error) {
    console.error('Update bookmarks error:', error);
    return NextResponse.json({ error: 'Server error updating bookmarks' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const bookmarks = clearBookmarks(email);
    return NextResponse.json({ success: true, bookmarks });
  } catch (error) {
    console.error('Clear bookmarks error:', error);
    return NextResponse.json({ error: 'Server error clearing bookmarks' }, { status: 500 });
  }
}
