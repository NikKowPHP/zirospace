import { POST } from './route'; // Import the POST function from the API route
// import { NextResponse } from 'next/server'; // Remove unused import
import { supabaseAdmin } from '@/lib/supabase'; // Import supabaseAdmin

// Mock supabaseAdmin for testing
jest.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    auth: {
      getUser: jest.fn() as jest.Mock, // Explicitly type as jest.Mock
    },
    from: jest.fn(() => ({ // Mock the 'from' method to return a mock query builder
      insert: jest.fn(() => ({
        returning: jest.fn() as jest.Mock, // Explicitly type as jest.Mock
      })) as jest.Mock, // Explicitly type as jest.Mock
      where: jest.fn(() => ({
        first: jest.fn() as jest.Mock, // Explicitly type as jest.Mock
      })) as jest.Mock, // Explicitly type as jest.Mock
    })) as jest.Mock, // Explicitly type as jest.Mock
  },
}));

describe('POST /api/apps', () => {
  test('should create a new app if authenticated', async () => {
    // Mock authenticated user
    (supabaseAdmin!.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null });

    // Mock the database insert and select operations
    const mockReturning = jest.fn().mockResolvedValue([{ id: 1 }]);
    const mockInsert = jest.fn().mockReturnValue({
      returning: mockReturning,
    });
    const mockFirst = jest.fn().mockResolvedValue({ id: 1, name: 'Test App', description: 'Test Description' });
    const mockWhere = jest.fn().mockReturnValue({
      first: mockFirst,
    });
    (supabaseAdmin!.from as jest.Mock).mockReturnValue({
      insert: mockInsert,
      where: mockWhere,
    });


    // Create a mock request object
    const mockRequest = {
      json: async () => ({ name: 'Test App', description: 'Test Description' }),
    } as Request;

    // Call the POST function
    const response = await POST(mockRequest);

    // Assertions
    expect(response.status).toBe(201);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ id: 1, name: 'Test App', description: 'Test Description' });
    expect(supabaseAdmin!.auth.getUser).toHaveBeenCalled();
    expect(supabaseAdmin!.from).toHaveBeenCalledWith('apps');
    expect(mockInsert).toHaveBeenCalledWith([{ name: 'Test App', description: 'Test Description' }]);
    expect(mockReturning).toHaveBeenCalled();
    expect(mockWhere).toHaveBeenCalledWith('id', 1);
    expect(mockFirst).toHaveBeenCalled();
  });

  test('should return 401 if not authenticated', async () => {
    // Mock unauthenticated user
    (supabaseAdmin!.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: null }, error: null });

    // Create a mock request object
    const mockRequest = {
      json: async () => ({ name: 'Test App', description: 'Test Description' }),
    } as Request;

    // Call the POST function
    const response = await POST(mockRequest);

    // Assertions
    expect(response.status).toBe(401);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ error: 'Unauthorized' });
    expect(supabaseAdmin!.auth.getUser).toHaveBeenCalled();
    expect(supabaseAdmin!.from).not.toHaveBeenCalled(); // Ensure database operations are not called
  });

  test('should return 400 if name is missing', async () => {
    // Mock authenticated user
    (supabaseAdmin!.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null });

    // Create a mock request object with missing name
    const mockRequest = {
      json: async () => ({ description: 'Test Description' }),
    } as Request;

    // Call the POST function
    const response = await POST(mockRequest);

    // Assertions
    expect(response.status).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ error: 'Name is required' });
    expect(supabaseAdmin!.auth.getUser).toHaveBeenCalled();
    expect(supabaseAdmin!.from).not.toHaveBeenCalled(); // Ensure database operations are not called
  });

  // Add more test cases for error handling, database errors, etc.
});
