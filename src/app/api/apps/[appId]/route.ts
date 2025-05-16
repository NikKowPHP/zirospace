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

export async function GET(request: Request, { params }: { params: { appId: string } }) {
  try {
    const { appId } = params;

    const { data, error } = await supabaseAdmin!
      .from('zirospace_apps')
      .select('*, zirospace_app_tags(zirospace_tags(id, name))') // Fetch app and its tags
      .eq('id', appId)
      .single();

    if (error) {
      console.error('Error fetching app details:', error);
      if (error.code === 'PGRST116') { // Supabase error code for not found
        return NextResponse.json({ error: 'App not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Error fetching app details' }, { status: 500 });
    }

    // Map the data to flatten the tags structure
    const app: ZirospaceApp = {
      ...data,
      tags: data.zirospace_app_tags.map((appTag: ZirospaceAppTag) => appTag.zirospace_tags),
      zirospace_app_tags: undefined, // Remove the original nested structure
    };


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
    const { tag_ids, ...updates } = await request.json();

    // If tag_ids are provided, update associations in zirospace_app_tags
    if (tag_ids !== undefined) { // Check if tag_ids was explicitly sent in the request
      // First, delete existing associations for this app
      const { error: deleteError } = await supabaseAdmin!
        .from('zirospace_app_tags')
        .delete()
        .eq('app_id', appId);

      if (deleteError) {
        console.error('Error deleting existing app tag associations:', deleteError);
        // Continue with app update even if deleting associations failed
      }

      // Then, insert new associations if tag_ids is not empty
      if (Array.isArray(tag_ids) && tag_ids.length > 0) {
        const appTagAssociations = tag_ids.map(tagId => ({
          app_id: parseInt(appId, 10), // Ensure appId is a number
          tag_id: tagId,
        }));

        const { error: insertError } = await supabaseAdmin!
          .from('zirospace_app_tags')
          .insert(appTagAssociations);

        if (insertError) {
          console.error('Error inserting new app tag associations:', insertError);
          // Continue with app update even if inserting associations failed
        }
      }
    }

    // Update the app details
    const { data: updatedApp, error: appError } = await supabaseAdmin!
      .from('zirospace_apps')
      .update(updates)
      .eq('id', appId)
      .select()
      .single();

    if (appError) {
      console.error('Error updating app:', appError);
      if (appError.code === 'PGRST116') { // Supabase error code for not found
        return NextResponse.json({ error: 'App not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Error updating app' }, { status: 500 });
    }

    // Fetch the updated app with the new tag associations to return in the response
    const { data: finalApp, error: fetchError } = await supabaseAdmin!
      .from('zirospace_apps')
      .select('*, zirospace_app_tags(zirospace_tags(id, name))')
      .eq('id', appId)
      .single();

    if (fetchError) {
      console.error('Error fetching updated app with tags:', fetchError);
      // Return the updated app without tags if fetching with tags fails
      return NextResponse.json(updatedApp, { status: 200 });
    }

    // Map the data to flatten the tags structure
    const appWithTags: ZirospaceApp = {
      ...finalApp,
      tags: finalApp.zirospace_app_tags.map((appTag: ZirospaceAppTag) => appTag.zirospace_tags),
      zirospace_app_tags: undefined, // Remove the original nested structure
    };


    return NextResponse.json(appWithTags, { status: 200 });
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
