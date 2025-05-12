import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase'; // Import supabaseAdmin
import { put } from '@vercel/blob';

// TODO: Address the @vercel/blob/server import issue to implement POST

export async function GET(request: Request, { params }: { params: { appId: string } }) {
  try {
    const { appId } = params;

    const { data: screenshots, error } = await supabaseAdmin!
      .from('screenshots')
      .select('*')
      .eq('app_id', appId)
      .order('order_index', { ascending: true }); // Order by order_index

    if (error) {
      console.error('Error fetching screenshots:', error);
      return NextResponse.json({ error: 'Error fetching screenshots' }, { status: 500 });
    }

    return NextResponse.json(screenshots, { status: 200 });
  } catch (error) {
    console.error('Error fetching screenshots:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { appId: string } }) {
  try {
    const { appId } = params;
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const screenNames = formData.getAll('screen_name') as string[];
    const routePaths = formData.getAll('route_path') as string[];
    const descriptions = formData.getAll('description') as string[];
    const orderIndices = formData.getAll('order_index') as string[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const uploadedScreenshots = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const screenName = screenNames[i] || null;
      const routePath = routePaths[i] || null;
      const description = descriptions[i] || null;
      const orderIndex = parseInt(orderIndices[i], 10) || 0;

      // Upload file to Vercel Blob
      // Assuming /api/upload-token handles the server-side part for @vercel/blob/client
      const filename = `apps/${appId}/screenshots/${Date.now()}-${file.name}`;
      const blob = await put(filename, file, {
        access: 'public',
      });

      // Save screenshot data to the database
      const { data, error } = await supabaseAdmin!
        .from('screenshots')
        .insert([
          {
            app_id: appId,
            image_url: blob.url,
            screen_name: screenName,
            route_path: routePath,
            description: description,
            order_index: orderIndex,
          },
        ])
        .select('*')
        .single();

      if (error) {
        console.error('Error saving screenshot to database:', error);
        // Depending on requirements, you might want to delete the uploaded blob here
        return NextResponse.json({ error: 'Error saving screenshot data' }, { status: 500 });
      }

      uploadedScreenshots.push(data);
    }

    return NextResponse.json(uploadedScreenshots, { status: 201 });

  } catch (error) {
    console.error('Error uploading screenshots:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Add other HTTP methods (PUT, DELETE) later as per the todo list
