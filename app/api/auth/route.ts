import { NextResponse } from 'next/server';
import { validatePassword } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const { password, type } = await request.json();
    
    // Get the correct stored password based on the type
    const storedPassword = type === 'admin' 
      ? process.env.ADMIN_PASSWORD 
      : process.env.MAIN_PAGE_PASSWORD;
    
    if (!storedPassword) {
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      );
    }
    
    // Validate the password
    const isValid = await validatePassword(password, storedPassword);
    
    if (isValid) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
