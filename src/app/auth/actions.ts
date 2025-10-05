'use server';

import { initializeFirebase } from '@/firebase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getAuth } from 'firebase/auth';

export async function logout() {
  const { auth } = initializeFirebase();
  await auth.signOut();
  revalidatePath('/');
  redirect('/');
}