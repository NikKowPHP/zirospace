import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase'; // Import supabaseAdmin

export async function GET(request: Request, { params }: { params: { appId: string } }) {
  try {
    const { appId } = params;

    const { data: app, error } = await supabaseAdmin!
      .from('apps')
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
  try {
    const { appId } = params;
    const updates = await request.json();

    const { data: updatedApp, error } = await supabaseAdmin!
      .from('apps')
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
  try {
    const { appId } = params;

    const { error } = await supabaseAdmin!
      .from('apps')
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
