import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';           // or use the long relative path if you haven’t added "@/"

/** Shape of a user row in the DB */
interface User {
  id: number;
  email: string;
  password: string;  // plaintext in your current schema – consider hashing!
  // add other columns (name, role, etc.) if they exist
}

/** Expected JSON body for POST /api/login */
interface LoginBody {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  const { email, password } = (await request.json()) as LoginBody;

  try {
    const { rows } = await pool.query<User>(
      'SELECT * FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (rows.length) {
      return NextResponse.json({ success: true, user: rows[0] });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: (err as Error).message },
      { status: 500 }
    );
  }
}
