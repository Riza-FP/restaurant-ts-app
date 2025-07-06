import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';                 // or the long relative path if you didn’t add "@/"

interface Params {
  id: string;                               // dynamic segment from the URL
}

/** DELETE /api/products/[id] – remove a product by ID */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Params }
) {
  const { id } = params;

  await pool.query('DELETE FROM product WHERE id = $1', [id]);

  return NextResponse.json({ success: true });
}
