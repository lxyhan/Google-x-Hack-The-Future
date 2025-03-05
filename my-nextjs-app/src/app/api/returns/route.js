// app/api/returns/route.js
import { NextResponse } from 'next/server';
import { 
  getReturnsData, 
  getRecentReturns, 
  getReturnStatistics, 
  getReturnInsights 
} from './data';

export async function GET(request) {
  // Get query parameters
  const { searchParams } = new URL(request.url);
  const dataType = searchParams.get('type');
  
  try {
    let responseData;
    
    // Return different data based on the requested type
    switch (dataType) {
      case 'recent':
        responseData = await getRecentReturns();
        break;
      case 'statistics':
        responseData = await getReturnStatistics();
        break;
      case 'insights':
        responseData = await getReturnInsights();
        break;
      default:
        // Return all data if no specific type is requested
        responseData = await getReturnsData();
    }
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching returns data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch returns data' },
      { status: 500 }
    );
  }
}