import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase'; // Import supabaseAdmin

// Helper function to check for authenticated admin user
async function isAuthenticatedAdmin(): Promise<boolean> {
  // In a real application, you would check for a valid session or token
  // and verify if the user has admin privileges.
  // For now, we'll just check if there's any authenticated user as a placeholder.
  const { data: { user } } = await supabaseAdmin!.auth.getUser();
  return !!user; // Return true if user exists, false otherwise
}

export async function POST(request: Request) {
  // Check if the user is authenticated and is an admin
  if (!await isAuthenticatedAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

    // Implement filtering based on query parameters
    const filter = searchParams.get('filter');
    if (filter) {
      query.or(`name.ilike.%${filter}%,description.ilike.%${filter}%`);
    }

    const { error } = await query;

    if (error) {
      console.error('Error fetching apps:', error);
      return NextResponse.json({ error: 'Error fetching apps' }, { status: 500 });
    }

    // Implement pagination
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    const { data: paginatedApps, error: paginationError } = await supabaseAdmin!
      .from('apps')
      .select('*')
      .order(orderBy, { ascending: orderDirection === 'asc' })
      .range(start, end);

    if (paginationError) {
      console.error('Error fetching paginated apps:', paginationError);
      return NextResponse.json({ error: 'Error fetching paginated apps' }, { status: 500 });
    }

    return NextResponse.json(paginatedApps, { status: 200 });
  } catch (error) {
    console.error('Error fetching apps:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Add other HTTP methods (PUT, DELETE) later as per the todo list
