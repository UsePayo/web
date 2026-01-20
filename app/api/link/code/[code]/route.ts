import { NextRequest, NextResponse } from 'next/server';

const BOT_API_URL = process.env.BOT_API_URL ?? 'http://localhost:3001';
const BOT_API_SECRET = process.env.BOT_API_SECRET ?? '';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Code is required' },
        { status: 400 }
      );
    }

    // Proxy to bot API
    const response = await fetch(
      `${BOT_API_URL}/api/link/code/${encodeURIComponent(code)}`,
      {
        headers: {
          'Authorization': BOT_API_SECRET ? `Bearer ${BOT_API_SECRET}` : '',
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error getting code info:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get code info' },
      { status: 500 }
    );
  }
}
