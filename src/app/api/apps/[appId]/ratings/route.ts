import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase'; // Import supabaseAdmin

export async function POST(request: Request, { params }: { params: { appId: string } }) {
  try {
    const { appId } = params;
    const { rating_value, user_id } = await request.json(); // Assuming rating_value and optional user_id are in the body

    if (rating_value === undefined || rating_value === null) {
      return NextResponse.json({ error: 'Rating value is required' }, { status: 400 });
    }

    // Insert the new rating
    const { error: insertError } = await supabaseAdmin!
      .from('app_ratings')
      .insert([{ app_id: parseInt(appId), user_id: user_id || null, rating_value: rating_value }]);

    if (insertError) {
      console.error('Error inserting app rating:', insertError);
      return NextResponse.json({ error: 'Error submitting rating' }, { status: 500 });
    }

    // Calculate and update the average rating for the app
    const { data: ratings, error: fetchError } = await supabaseAdmin!
      .from('app_ratings')
      .select('rating_value')
      .eq('app_id', appId);

    if (fetchError) {
      console.error('Error fetching app ratings for average calculation:', fetchError);
      // Proceed without updating average rating, but log the error
    } else {
      const totalRatings = ratings.length;
      const sumRatings = ratings.reduce((sum, rating) => sum + rating.rating_value, 0);
      const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

      const { error: updateError } = await supabaseAdmin!
        .from('zirospace_apps')
        .update({ average_rating: averageRating })
        .eq('id', appId);

      if (updateError) {
        console.error('Error updating app average rating:', updateError);
        // Log the error, but the rating was still saved
      }
    }

    // Return the updated average rating or the newly inserted rating
    // For simplicity, returning a success message for now
    return NextResponse.json({ message: 'Rating submitted successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error handling app rating submission:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
