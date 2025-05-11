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

export async function POST(request: Request, { params }: { params: { appId: string } }) {
  // Check if the user is authenticated and is an admin
  if (!await isAuthenticatedAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { appId } = params;
    const screenshotIdsInOrder: string[] = await request.json(); // Assuming the request body is an array of screenshot IDs

    if (!screenshotIdsInOrder || !Array.isArray(screenshotIdsInOrder)) {
      return NextResponse.json({ error: 'Invalid request body. Expected an array of screenshot IDs.' }, { status: 400 });
    }

    // Update the order_index for each screenshot
    const updatePromises = screenshotIdsInOrder.map((screenshotId, index) => {
      return supabaseAdmin!
        .from('screenshots')
        .update({ order_index: index })
        .eq('id', screenshotId)
        .eq('app_id', appId); // Ensure the screenshot belongs to the correct app
    });

    const updateResults = await Promise.all(updatePromises);

    // Check for errors in the update results
    const errors = updateResults.filter(result => result.error);
    if (errors.length > 0) {
      console.error('Error reordering screenshots:', errors);
      return NextResponse.json({ error: 'Error reordering screenshots' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Screenshots reordered successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error reordering screenshots:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
