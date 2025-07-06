import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';          // use '@/lib/db' *if* you added the alias in tsconfig.json
// import pool from '../../../../lib/db'; // otherwise keep the long relative path

/** Row shape returned by SELECT * FROM product */
interface Product {
  id: number;
  name: string;
  price: number;
}

/** GET /api/products – list all products */
export async function GET() {
  const { rows } = await pool.query<Product>('SELECT * FROM product ORDER BY id');
  return NextResponse.json(rows);
}

/** POST /api/products – create a product */
export async function POST(request: NextRequest) {
  const { name, price } = (await request.json()) as {
    name: string;
    price: number;
  };

  await pool.query(
    'INSERT INTO product (name, price) VALUES ($1, $2)',
    [name, price]
  );

  return NextResponse.json({ success: true }, { status: 201 });
}
