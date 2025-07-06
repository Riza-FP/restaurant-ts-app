import { NextResponse } from 'next/server';
import pool from '@/lib/db'; // your shared Postgres client

interface Product {
  id: number;
  name: string;
  price: number;
}

export async function GET() {
  const { rows } = await pool.query<Product>('SELECT * FROM product ORDER BY id');
  return NextResponse.json(rows);
}
