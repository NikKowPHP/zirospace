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

    // Sorting
    const sortBy = searchParams.get('sortBy') || 'name_asc';
    const [orderBy, orderDirection] = sortBy.split('_');

    // Pagination
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '9', 10); // Use 'limit' from client, default 9
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let queryBuilder = supabaseAdmin!
      .from('apps')
      .select('*', { count: 'exact' }) // Request total count for pagination metadata
      .order(orderBy, { ascending: orderDirection === 'asc' });

    // Filtering - use 'searchTerm' as per client request
    const searchTerm = searchParams.get('searchTerm');
    if (searchTerm && searchTerm.trim() !== '') {
      const decodedSearchTerm = decodeURIComponent(searchTerm);
      queryBuilder = queryBuilder.or(`name.ilike.%${decodedSearchTerm}%,description.ilike.%${decodedSearchTerm}%`);
    }

    // Apply range for pagination
    queryBuilder = queryBuilder.range(start, end);

    const { data: apps, error, count } = await queryBuilder;

    if (error) {
      console.error('Error fetching apps from Supabase:', error);
      console.error('Request URL:', request.url);
      return NextResponse.json({ error: 'Error fetching apps', details: error.message }, { status: 500 });
    }

    return NextResponse.json({
        data: apps,
        total: count,
        page,
        limit,
     }, { status: 200 });

  } catch (error: unknown) { // Catch any other errors
    console.error('An unexpected error occurred while fetching apps:', error);
    console.error('Request URL:', request.url);
    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}

// Add other HTTP methods (PUT, DELETE) later as per the todo list
