import { NextResponse } from 'next/server';
import { getGroupStats } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const program = searchParams.get('program') as 'Primary_Program' | 'Secondary_Program';
    
    if (!program) {
      return NextResponse.json(
        { success: false, message: 'Program parameter is required' },
        { status: 400 }
      );
    }
    
    const stats = await getGroupStats(program);
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Fetch stats error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
