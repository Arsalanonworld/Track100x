
import { NextResponse } from 'next/server';
import { whaleTransactions } from '@/lib/mock-data';

export async function GET() {
  // In a real application, this would fetch data from a third-party API
  // or a database that is populated by your complex data pipeline.
  // For this simulation, we just return our mock data.
  return NextResponse.json(whaleTransactions);
}

    