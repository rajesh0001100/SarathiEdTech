import { cookies } from 'next/headers';

const TOKEN_COOKIE_NAME = 'sarathi_admin_token';
const TOKEN_SECRET = process.env.JWT_SECRET || 'sarathi_edtech_default_secret_key_2026';

let scriptMockToken: string | null = null;

function createSessionHash(email: string): string {
  return `${email.trim().toLowerCase()}:${TOKEN_SECRET}:${email.length}`;
}

async function getSafeCookieStore() {
  try {
    return await cookies();
  } catch {
    return null;
  }
}

export async function loginAdmin(email: string, pass: string): Promise<{ success: boolean; message?: string }> {
  const envEmail = (process.env.ADMIN_EMAIL || 'admin@sarathiedtech.com').trim();
  const envPassword = (process.env.ADMIN_PASSWORD || 'admin_dev_password_123').trim();

  if (email.trim().toLowerCase() !== envEmail.toLowerCase() || pass.trim() !== envPassword) {
    return { success: false, message: 'Invalid admin credentials' };
  }

  const token = createSessionHash(envEmail);
  const cookieStore = await getSafeCookieStore();

  if (cookieStore) {
    cookieStore.set(TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
  } else {
    scriptMockToken = token;
  }

  return { success: true };
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await getSafeCookieStore();
  if (cookieStore) {
    cookieStore.delete(TOKEN_COOKIE_NAME);
  } else {
    scriptMockToken = null;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const envEmail = (process.env.ADMIN_EMAIL || 'admin@sarathiedtech.com').trim();
    const expectedToken = createSessionHash(envEmail);

    const cookieStore = await getSafeCookieStore();
    if (cookieStore) {
      const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
      return token === expectedToken;
    }

    return scriptMockToken === expectedToken;
  } catch (error) {
    console.error('Error verifying admin authentication:', error);
    return false;
  }
}

export async function requireAdminAuth(): Promise<void> {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    throw new Error('Unauthorized: Admin authentication required.');
  }
}
