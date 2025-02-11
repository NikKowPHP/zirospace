import { google } from '@google-analytics/data/build/protos/protos';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

const propertyId = process.env.GA4_PROPERTY_ID!;

export async function GET() {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      metrics: [
        { name: 'activeUsers' },
        { name: 'screenPageViews' },
        { name: 'sessions' },
      ],
      dimensions: [{ name: 'date' }],
    });

    return Response.json({ data: response });
  } catch (error) {
    console.error('Error fetching GA data:', error);
    return Response.json({ error: 'Failed to fetch analytics data' }, { status: 500 });
  }
}