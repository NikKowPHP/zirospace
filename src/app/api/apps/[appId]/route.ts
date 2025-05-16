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

export async function GET(request: Request, { params }: { params: { appId: string } }) {
  try {
    const { appId } = params;

    const { data: app, error } = await supabaseAdmin!
      .from('zirospace_apps')
      .select('*')
      .eq('id', appId)
      .single();

    if (error) {
      console.error('Error fetching app details:', error);
      if (error.code === 'PGRST116') { // Supabase error code for not found
        return NextResponse.json({ error: 'App not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Error fetching app details' }, { status: 500 });
    }

    return NextResponse.json(app, { status: 200 });
  } catch (error) {
    console.error('Error fetching app details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { appId: string } }) {
  // Check if the user is authenticated and is an admin
  if (!await isAuthenticatedAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { appId } = params;
    const updates = await request.json();

    const { data: updatedApp, error } = await supabaseAdmin!
      .from('zirospace_apps')
      .update(updates)
      .eq('id', appId)
      .select()
      .single();

    if (error) {
      console.error('Error updating app:', error);
      if (error.code === 'PGRST116') { // Supabase error code for not found
        return NextResponse.json({ error: 'App not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Error updating app' }, { status: 500 });
    }

    return NextResponse.json(updatedApp, { status: 200 });
  } catch (error) {
    console.error('Error updating app:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { appId: string } }) {
  // Check if the user is authenticated and is an admin
  if (!await isAuthenticatedAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { appId } = params;

    const { error } = await supabaseAdmin!
      .from('zirospace_apps')
      .delete()
      .eq('id', appId);

    if (error) {
      console.error('Error deleting app:', error);
      return NextResponse.json({ error: 'Error deleting app' }, { status: 500 });
    }

    return NextResponse.json({ message: 'App deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting app:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
