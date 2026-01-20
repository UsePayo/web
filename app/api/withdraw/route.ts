import { NextRequest, NextResponse } from 'next/server';

const BOT_API_URL = process.env.BOT_API_URL || 'http://localhost:3001';
const BOT_API_SECRET = process.env.BOT_API_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, toAddress, amount } = body;

    // Validate required fields
    if (!walletAddress || !toAddress || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate wallet address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json(
        { success: false, error: 'Invalid wallet address format' },
        { status: 400 }
      );
    }

    // Validate destination address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(toAddress)) {
      return NextResponse.json(
        { success: false, error: 'Invalid destination address format' },
        { status: 400 }
      );
    }

    // Validate amount
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Forward to bot API
    const response = await fetch(`${BOT_API_URL}/api/withdraw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(BOT_API_SECRET && { Authorization: `Bearer ${BOT_API_SECRET}` }),
      },
      body: JSON.stringify({ walletAddress, toAddress, amount }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error || 'Withdraw failed' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying withdraw request:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
