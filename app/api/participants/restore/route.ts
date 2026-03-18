import { NextResponse } from 'next/server';
import { resetParticipant } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type RestoreRequest = {
  id?: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RestoreRequest;

    if (!body.id || Number.isNaN(Number(body.id))) {
      return NextResponse.json({ error: 'معرّف غير صالح.' }, { status: 400 });
    }

    resetParticipant(Number(body.id));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'تعذر تنفيذ الاستعادة.' }, { status: 500 });
  }
}
