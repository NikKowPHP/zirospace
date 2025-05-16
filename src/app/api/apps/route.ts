import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase'; // Import supabaseAdmin

interface ZirospaceAppTag {
  zirospace_tags: {
    id: number;
    name: string;
  };
}

interface ZirospaceApp {
  // Assuming other app properties exist, add them here if needed for type safety
  // For now, we'll just include the nested tags structure
  zirospace_app_tags: ZirospaceAppTag[];
  // Add other properties like id, name, description, etc. if you want full type coverage
  id: number;
  name: string;
  description: string | null;
  // Add other columns from zirospace_apps table
}


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
    const { name, description, tag_ids } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const { data: newApp, error: appError } = await supabaseAdmin!
      .from('zirospace_apps')
      .insert([{ name, description }])
      .select()
      .single();

    if (appError) {
      console.error('Error creating app:', appError);
      return NextResponse.json({ error: 'Error creating app' }, { status: 500 });
    }

    // If tag_ids are provided, create associations in zirospace_app_tags
    if (tag_ids && Array.isArray(tag_ids) && tag_ids.length > 0) {
      const appTagAssociations = tag_ids.map(tagId => ({
        app_id: newApp.id,
        tag_id: tagId,
      }));

      const { error: appTagError } = await supabaseAdmin!
        .from('zirospace_app_tags')
        .insert(appTagAssociations);

      if (appTagError) {
        console.error('Error creating app tag associations:', appTagError);
        // Depending on requirements, you might want to roll back the app creation here
        // For now, we'll just log the error and return the created app
      }
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

    // Tag filtering
    const tagsParam = searchParams.get('tags');
    const tagIds = tagsParam ? tagsParam.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id)) : [];

    let queryBuilder = supabaseAdmin!
      .from('zirospace_apps')
      .select('*, zirospace_app_tags(zirospace_tags(id, name))', { count: 'exact' }) // Fetch apps and their tags, request total count
      .order(orderBy, { ascending: orderDirection === 'asc' });

    // Filtering - use 'searchTerm' as per client request
    const searchTerm = searchParams.get('searchTerm');
    if (searchTerm && searchTerm.trim() !== '') {
      const decodedSearchTerm = decodeURIComponent(searchTerm);
      queryBuilder = queryBuilder.or(`name.ilike.%${decodedSearchTerm}%,description.ilike.%${decodedSearchTerm}%`);
    }

    // Apply tag filtering if tagIds are provided
    if (tagIds.length > 0) {
      // This filter finds apps that have *at least one* of the specified tags.
      // Filtering for apps that have *all* specified tags is more complex and might require a different approach (e.g., RPC function).
      queryBuilder = queryBuilder.filter('tags.id', 'in', `(${tagIds.join(',')})`);
    }

    // Apply range for pagination
    queryBuilder = queryBuilder.range(start, end);

    const { data, error, count } = await queryBuilder;

    if (error) {
      console.error('Error fetching apps from Supabase:', error);
      console.error('Request URL:', request.url);
      return NextResponse.json({ error: 'Error fetching apps', details: error.message }, { status: 500 });
    }

    // Map the data to flatten the tags structure
    const apps = data.map((app: ZirospaceApp) => ({
      ...app,
      tags: app.zirospace_app_tags.map(appTag => appTag.zirospace_tags),
      zirospace_app_tags: undefined, // Remove the original nested structure
    }));

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
