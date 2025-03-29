import { NextResponse } from 'next/server';
import { getParticipants, getSelectedParticipants, executeQuery } from '@/lib/db';

// Update convertRanking to map user-friendly names to stored rankings without any 1D conditions
function convertRanking(ranking: string): string {
  if (ranking === 'First') return '1';
  if (ranking === 'Second') return '2';
  if (ranking === 'Third') return '3';
  if (ranking === 'Fourth') return '4';
  if (ranking === 'Fifth') return '5';
  return ranking;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const program = searchParams.get('program') as 'Primary_Program' | 'Secondary_Program';
    const selected = searchParams.get('selected');
    const ranking = searchParams.get('ranking');
    
    if (!program) {
      return NextResponse.json(
        { success: false, message: 'Program parameter is required' },
        { status: 400 }
      );
    }
    
    let participants;
    
    if (selected === 'true') {
      participants = await getSelectedParticipants(program, ranking || undefined);
    } else {
      if (!ranking) {
        // Fetch all unselected participants regardless of ranking
        const query = `
          SELECT * FROM ${program}
          WHERE selected IS NULL OR selected = FALSE
          ORDER BY id ASC
        `;
        const result = await executeQuery(query);
        participants = result.rows;
        console.log(`Found ${participants.length} unselected participants for ${program} (all rankings)`);
      } else {
        const storedRanking = convertRanking(ranking);
        participants = await getParticipants(program, storedRanking);
        console.log(`Found ${participants.length} unselected participants for ${program} with ranking ${storedRanking}`);
      }
    }
    
    return NextResponse.json(participants || []);
  } catch (error) {
    console.error('Fetch participants error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
