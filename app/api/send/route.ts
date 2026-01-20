import { NextRequest, NextResponse } from 'next/server';

const BOT_API_URL = process.env.BOT_API_URL || 'http://localhost:3001';
const BOT_API_SECRET = process.env.BOT_API_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, toUsername, amount, message } = body;

    // Validate required fields
    if (!walletAddress || !toUsername || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Forward to bot API
    const response = await fetch(`${BOT_API_URL}/api/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(BOT_API_SECRET && { Authorization: `Bearer ${BOT_API_SECRET}` }),
      },
      body: JSON.stringify({ walletAddress, toUsername, amount, message }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error || 'Send failed' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying send request:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
