import { IAuthService } from '@/domain/services/auth.service'
import { Session, User } from '@supabase/supabase-js'

export class MockAuthService implements IAuthService {
  async login(email: string, password: string): Promise<{ user: User | null; session: Session | null }> {
    console.error('login', email, password)
    return {
      user: {
        id: '123',
        email: email,
        aud: 'authenticated',
        role: 'authenticated',
        app_metadata: {},
        user_metadata: {},
        identities: [],
        factors: [],
        created_at: '2023-10-20T00:00:00Z',
        updated_at: '2023-10-20T00:00:00Z',
        email_confirmed_at: '2023-10-20T00:00:00Z',
        phone_confirmed_at: '2023-10-20T00:00:00Z',
        last_sign_in_at: '2023-10-20T00:00:00Z',
      },
      session: {
        access_token: '123',
        refresh_token: '123',
        expires_in: 1000,
        token_type: 'Bearer',
        user: null,
      } as unknown as Session,
    };
  }

  async logout(): Promise<void> {
    return;
  }

  async getSession(): Promise<Session | null> {
    return {
      access_token: '123',
      refresh_token: '123',
      expires_in: 1000,
      token_type: 'Bearer',
      user: {
        id: 'mock-user-id',
        aud: 'authenticated',
        role: 'authenticated',
        email: 'mock@example.com',
        email_confirmed_at: '2023-10-20T00:00:00Z',
        phone_confirmed_at: '2023-10-20T00:00:00Z',
        last_sign_in_at: '2023-10-20T00:00:00Z',
        app_metadata: {},
        user_metadata: {},
        identities: [],
        factors: [],
        created_at: '2023-10-20T00:00:00Z',
        updated_at: '2023-10-20T00:00:00Z',
      }
    } as Session;
  }
} 