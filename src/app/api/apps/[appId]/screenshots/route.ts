import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase'; // Import supabaseAdmin

// TODO: Address the @vercel/blob/server import issue to implement POST

export async function GET(request: Request, { params }: { params: { appId: string } }) {
  try {
    const { appId } = params;

    const { data: screenshots, error } = await supabaseAdmin!
      .from('screenshots')
      .select('*')
      .eq('app_id', appId)
      .order('order_index', { ascending: true }); // Order by order_index

    if (error) {
      console.error('Error fetching screenshots:', error);
      return NextResponse.json({ error: 'Error fetching screenshots' }, { status: 500 });
    }

    return NextResponse.json(screenshots, { status: 200 });
  } catch (error) {
    console.error('Error fetching screenshots:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Add other HTTP methods (PUT, DELETE) later as per the todo list
// TODO: Implement POST /api/apps/{appId}/screenshots once @vercel/blob/server issue is resolved
