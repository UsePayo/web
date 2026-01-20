import { NextRequest, NextResponse } from 'next/server';

const BOT_API_URL = process.env.BOT_API_URL ?? 'http://localhost:3001';
const BOT_API_SECRET = process.env.BOT_API_SECRET ?? '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, walletAddress } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Code is required' },
        { status: 400 }
      );
    }

    if (!walletAddress || typeof walletAddress !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Proxy to bot API
    const response = await fetch(`${BOT_API_URL}/api/link/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': BOT_API_SECRET ? `Bearer ${BOT_API_SECRET}` : '',
      },
      body: JSON.stringify({ code, walletAddress }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error verifying link:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify link' },
      { status: 500 }
    );
  }
}
