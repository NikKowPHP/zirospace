import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase'; // Import supabaseAdmin

export async function POST(request: Request) {
  try {
    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const { data: newApp, error } = await supabaseAdmin!
      .from('apps')
      .insert([{ name, description }])
      .select()
      .single();

    if (error) {
      console.error('Error creating app:', error);
      return NextResponse.json({ error: 'Error creating app' }, { status: 500 });
    }

    return NextResponse.json(newApp, { status: 201 });
  } catch (error) {
    console.error('Error creating app:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sortBy') || 'name_asc'; // Default sort by name ascending
    const [orderBy, orderDirection] = sortBy.split('_');

    const query = supabaseAdmin!
      .from('apps')
      .select('*')
      .order(orderBy, { ascending: orderDirection === 'asc' });

    // TODO: Implement filtering based on query parameters

    const { data: apps, error } = await query;

    if (error) {
      console.error('Error fetching apps:', error);
      return NextResponse.json({ error: 'Error fetching apps' }, { status: 500 });
    }

    // TODO: Implement pagination

    return NextResponse.json(apps, { status: 200 });
  } catch (error) {
    console.error('Error fetching apps:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Add other HTTP methods (PUT, DELETE) later as per the todo list
