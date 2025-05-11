import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase'; // Import supabaseAdmin

export async function POST(request: Request, { params }: { params: { screenshotId: string } }) {
  try {
    const { screenshotId } = params;
    const { rating_value, user_id } = await request.json(); // Assuming rating_value and optional user_id are in the body

    if (rating_value === undefined || rating_value === null) {
      return NextResponse.json({ error: 'Rating value is required' }, { status: 400 });
    }

    // Insert the new rating
    const { data: newRating, error: insertError } = await supabaseAdmin!
      .from('screenshot_ratings')
      .insert([{ screenshot_id: parseInt(screenshotId), user_id: user_id || null, rating_value: rating_value }])
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting screenshot rating:', insertError);
      return NextResponse.json({ error: 'Error submitting rating' }, { status: 500 });
    }

    // Calculate and update the average rating for the screenshot
    const { data: ratings, error: fetchError } = await supabaseAdmin!
      .from('screenshot_ratings')
      .select('rating_value')
      .eq('screenshot_id', screenshotId);

    if (fetchError) {
      console.error('Error fetching screenshot ratings for average calculation:', fetchError);
      // Proceed without updating average rating, but log the error
    } else {
      const totalRatings = ratings.length;
      const sumRatings = ratings.reduce((sum, rating) => sum + rating.rating_value, 0);
      const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

      const { error: updateError } = await supabaseAdmin!
        .from('screenshots')
        .update({ average_rating: averageRating })
        .eq('id', screenshotId);

      if (updateError) {
        console.error('Error updating screenshot average rating:', updateError);
        // Log the error, but the rating was still saved
      }
    }

    // Return the updated average rating or the newly inserted rating
    // For simplicity, returning a success message for now
    return NextResponse.json({ message: 'Rating submitted successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error handling screenshot rating submission:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
