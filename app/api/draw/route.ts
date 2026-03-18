import { NextResponse } from 'next/server';
import { getAvailableParticipants, excludeParticipant } from '@/lib/db';
import type { DrawMode, ParticipantDto } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type DrawRequest = {
  mode?: DrawMode;
};

const isValidMode = (mode: unknown): mode is DrawMode => {
  return mode === 'all' || mode === 'pre_k_k3' || mode === 'k4_k7';
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DrawRequest;
    const mode: DrawMode = isValidMode(body.mode) ? body.mode : 'all';

    const available = getAvailableParticipants(mode);

    if (available.length === 0) {
      return NextResponse.json(
        { error: 'لا يوجد مشاركون متبقون في هذه الفئة.' },
        { status: 404 },
      );
    }

    // Pick a random winner
    const winner = available[Math.floor(Math.random() * available.length)] as ParticipantDto;

    // Exclude the winner
    excludeParticipant(winner.id, mode);

    return NextResponse.json({ winner });
  } catch {
    return NextResponse.json({ error: 'حدث خطأ أثناء السحب.' }, { status: 500 });
  }
}
