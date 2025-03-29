import { NextResponse } from 'next/server';
import { selectParticipant } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { program, id } = await request.json();
    
    if (!program || !id) {
      return NextResponse.json(
        { success: false, message: 'Program and ID are required' },
        { status: 400 }
      );
    }
    
    const participant = await selectParticipant(program, id);
    
    if (!participant) {
      return NextResponse.json(
        { success: false, message: 'Participant not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, participant });
  } catch (error) {
    console.error('Select participant error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
