import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Add any global middleware logic here
  // For example, you could implement session validation checks
  
  // For now, we're handling auth in individual pages with client-side checks
  // but you could implement more secure server-side auth here

  return NextResponse.next();
}
