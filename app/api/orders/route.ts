import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';                     // adjust if you didn’t add "@/"

interface OrderItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

interface OrderRow {
  id: number;
  items: OrderItem[] | string;                  // TEXT column in DB → string when fetched
  created_at: string;
}

/** ----------  POST /api/orders  ---------- **/
interface CreateOrderBody {
  items: OrderItem[];
}

export async function POST(request: NextRequest) {
  const { items } = (await request.json()) as CreateOrderBody;

  await pool.query(
    'INSERT INTO orders (items) VALUES ($1)',
    [JSON.stringify(items)]                     // store as TEXT (or JSONB if you altered the table)
  );

  return NextResponse.json({ success: true }, { status: 201 });
}

/** ----------  GET /api/orders  ---------- **/
export async function GET() {
  const { rows } = await pool.query<OrderRow>(
    'SELECT * FROM orders ORDER BY created_at DESC'
  );

  const orders = rows.map((o) => ({
    ...o,
    // If the column is TEXT, parse; if you switched to JSONB, this is already an array
    items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items,
  }));

  return NextResponse.json(orders);
}

/** ----------  DELETE /api/orders  ---------- **/
export async function DELETE() {
  await pool.query('DELETE FROM orders');
  return NextResponse.json({ success: true });
}
