import { NextResponse } from 'next/server';
import { resetSelections } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { program } = await request.json();
    
    if (!program) {
      return NextResponse.json(
        { success: false, message: 'Program is required' },
        { status: 400 }
      );
    }
    
    await resetSelections(program);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reset selections error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
