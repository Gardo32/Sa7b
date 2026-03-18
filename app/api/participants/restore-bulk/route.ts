import { NextResponse } from 'next/server';
import { resetAllExclusions } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST() {
  try {
    resetAllExclusions();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'تعذر تنفيذ استعادة الجميع.' }, { status: 500 });
  }
}
