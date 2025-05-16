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

export async function GET(request: Request, { params }: { params: { screenshotId: string } }) {
  try {
    const { screenshotId } = params;

    const { data: screenshot, error } = await supabaseAdmin!
      .from('zirospace_screenshots')
      .select('*')
      .eq('id', screenshotId)
      .single();

    if (error) {
      console.error('Error fetching screenshot details:', error);
      if (error.code === 'PGRST116') { // Supabase error code for not found
        return NextResponse.json({ error: 'Screenshot not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Error fetching screenshot details' }, { status: 500 });
    }

    return NextResponse.json(screenshot, { status: 200 });
  } catch (error) {
    console.error('Error fetching screenshot details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { screenshotId: string } }) {
  // Check if the user is authenticated and is an admin
  if (!await isAuthenticatedAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { screenshotId } = params;
    const updates = await request.json();

    const { data: updatedScreenshot, error } = await supabaseAdmin!
      .from('zirospace_screenshots')
      .update(updates)
      .eq('id', screenshotId)
      .select()
      .single();

    if (error) {
      console.error('Error updating screenshot:', error);
      if (error.code === 'PGRST116') { // Supabase error code for not found
        return NextResponse.json({ error: 'Screenshot not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Error updating screenshot' }, { status: 500 });
    }

    return NextResponse.json(updatedScreenshot, { status: 200 });
  } catch (error) {
    console.error('Error updating screenshot:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { screenshotId: string } }) {
  // Check if the user is authenticated and is an admin
  if (!await isAuthenticatedAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { screenshotId } = params;

    const { error } = await supabaseAdmin!
      .from('zirospace_screenshots')
      .delete()
      .eq('id', screenshotId);

    if (error) {
      console.error('Error deleting screenshot:', error);
      return NextResponse.json({ error: 'Error deleting screenshot' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Screenshot deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting screenshot:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
