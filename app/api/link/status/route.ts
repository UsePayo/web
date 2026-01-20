import { NextRequest, NextResponse } from 'next/server';

const BOT_API_URL = process.env.BOT_API_URL ?? 'http://localhost:3001';
const BOT_API_SECRET = process.env.BOT_API_SECRET ?? '';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');

    if (!wallet) {
      return NextResponse.json(
        { success: false, error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Proxy to bot API
    const response = await fetch(
      `${BOT_API_URL}/api/link/status?wallet=${encodeURIComponent(wallet)}`,
      {
        headers: {
          'Authorization': BOT_API_SECRET ? `Bearer ${BOT_API_SECRET}` : '',
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error checking link status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check link status' },
      { status: 500 }
    );
  }
}
