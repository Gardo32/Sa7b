import { NextResponse } from 'next/server';
import { getParticipants } from '@/lib/db';
import type { ParticipantDto, StatsDto } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const participants = getParticipants();

    const totalParticipants = participants.length;
    const totalExcluded = participants.filter((p) => p.excluded_all === 1).length;
    const remainingPreKK3 = participants.filter(
      (p) => p.cohort === 'pre_k_k3' && p.excluded_all === 0,
    ).length;
    const remainingK4K7 = participants.filter(
      (p) => p.cohort === 'k4_k7' && p.excluded_all === 0,
    ).length;

    const excludedParticipants = participants
      .filter((p) => p.excluded_all === 1)
      .reverse() as ParticipantDto[];

    const stats: StatsDto = {
      totalParticipants,
      totalExcluded,
      remainingPreKK3,
      remainingK4K7,
    };

    return NextResponse.json({ stats, excludedParticipants });
  } catch {
    return NextResponse.json({ error: 'تعذر تحميل الإحصائيات.' }, { status: 500 });
  }
}
