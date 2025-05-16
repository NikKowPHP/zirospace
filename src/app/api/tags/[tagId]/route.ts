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

export async function PUT(request: Request, { params }: { params: { tagId: string } }) {
  // Check if the user is authenticated and is an admin
  if (!await isAuthenticatedAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { tagId } = params;
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Check for duplicate tag name, excluding the current tag being updated
    const { data: existingTag, error: fetchError } = await supabaseAdmin!
      .from('zirospace_tags')
      .select('id')
      .eq('name', name)
      .neq('id', tagId) // Exclude the current tag
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error('Error checking for existing tag:', fetchError);
      return NextResponse.json({ error: 'Error updating tag' }, { status: 500 });
    }

    if (existingTag) {
      return NextResponse.json({ error: 'Tag with this name already exists' }, { status: 409 }); // 409 Conflict
    }

    const { data: updatedTag, error: updateError } = await supabaseAdmin!
      .from('zirospace_tags')
      .update({ name })
      .eq('id', tagId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating tag:', updateError);
      if (updateError.code === 'PGRST116') { // Supabase error code for not found
        return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Error updating tag' }, { status: 500 });
    }

    return NextResponse.json(updatedTag, { status: 200 });
  } catch (error) {
    console.error('Error updating tag:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { tagId: string } }) {
  // Check if the user is authenticated and is an admin
  if (!await isAuthenticatedAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { tagId } = params;

    const { error } = await supabaseAdmin!
      .from('zirospace_tags')
      .delete()
      .eq('id', tagId);

    if (error) {
      console.error('Error deleting tag:', error);
      return NextResponse.json({ error: 'Error deleting tag' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Tag deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { tagId: string } }) {
  try {
    const { tagId } = params;

    const { data: tag, error } = await supabaseAdmin!
      .from('zirospace_tags')
      .select('id, name')
      .eq('id', tagId)
      .single();

    if (error) {
      console.error('Error fetching tag:', error);
      if (error.code === 'PGRST116') { // Supabase error code for not found
        return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Error fetching tag' }, { status: 500 });
    }

    return NextResponse.json(tag, { status: 200 });
  } catch (error) {
    console.error('Error fetching tag:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
