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

export async function GET(request: Request) {
  try {
    const { data: tags, error } = await supabaseAdmin!
      .from('zirospace_tags')
      .select('id, name');

    if (error) {
      console.error('Error fetching tags:', error);
      return NextResponse.json({ error: 'Error fetching tags' }, { status: 500 });
    }

    return NextResponse.json(tags, { status: 200 });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // Check if the user is authenticated and is an admin
  if (!await isAuthenticatedAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Check for duplicate tag name
    const { data: existingTag, error: fetchError } = await supabaseAdmin!
      .from('zirospace_tags')
      .select('id')
      .eq('name', name)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error('Error checking for existing tag:', fetchError);
      return NextResponse.json({ error: 'Error creating tag' }, { status: 500 });
    }

    if (existingTag) {
      return NextResponse.json({ error: 'Tag with this name already exists' }, { status: 409 }); // 409 Conflict
    }

    const { data: newTag, error: insertError } = await supabaseAdmin!
      .from('zirospace_tags')
      .insert([{ name }])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating tag:', insertError);
      return NextResponse.json({ error: 'Error creating tag' }, { status: 500 });
    }

    return NextResponse.json(newTag, { status: 201 });
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Add PUT, DELETE methods later
