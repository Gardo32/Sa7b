import { NextResponse } from 'next/server';
import { getParticipants, selectParticipant } from '@/lib/db';
import { selectRandomParticipant } from '@/lib/utils';

// Update convertRanking to map user-friendly names to stored rankings without any 1D conditions
function convertRanking(ranking: string): string {
  if (ranking === 'First') return '1';
  if (ranking === 'Second') return '2';
  if (ranking === 'Third') return '3';
  if (ranking === 'Fourth') return '4';
  if (ranking === 'Fifth') return '5';
  return ranking;
}

export async function POST(request: Request) {
  try {
    const { program, ranking } = await request.json();
    const storedRanking = convertRanking(ranking);
    
    // Get all eligible participants using storedRanking
    const participants = await getParticipants(program, storedRanking);
    
    if (!participants || participants.length === 0) {
      console.log(`No participants found for ${program} with ranking ${storedRanking}`);
      return NextResponse.json(
        { 
          success: false, 
          message: `لا يوجد مشاركين متاحين لفئة ${ranking}` 
        },
        { status: 404 }
      );
    }
    
    const winner = selectRandomParticipant(participants);
    
    if (!winner) {
      return NextResponse.json(
        { success: false, message: 'فشل في اختيار فائز' },
        { status: 500 }
      );
    }
    
    await selectParticipant(program, winner.id);
    
    return NextResponse.json({ success: true, winner });
  } catch (error) {
    console.error('Draw error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في السحب' },
      { status: 500 }
    );
  }
}
