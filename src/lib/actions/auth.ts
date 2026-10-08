'use server';

import { loginAdmin, logoutAdmin } from '@/lib/auth';

export async function loginAdminAction(email: string, pass: string) {
  return await loginAdmin(email, pass);
}

export async function logoutAdminAction() {
  return await logoutAdmin();
}
