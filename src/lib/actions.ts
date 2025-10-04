'use server';

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps } from 'firebase/app';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// Initialize Firebase Admin SDK for server-side actions
// Note: This is a simplified example. In a real app, you'd want to
// initialize the admin SDK once and share the instance.
function getAuthInstance() {
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
  return getAuth();
}

export async function login(prevState: any, formData: FormData) {
  const auth = getAuthInstance();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const next = formData.get('next') as string || '/';

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    return { error: error.message };
  }
  revalidatePath('/');
  redirect(next);
}

export async function signup(prevState: any, formData: FormData) {
  const auth = getAuthInstance();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const next = formData.get('next') as string || '/';

  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    return { error: error.message };
  }

  revalidatePath('/');
  redirect(next);
}

export async function resetPassword(prevState: any, formData: FormData) {
    const auth = getAuthInstance();
    const email = formData.get('email') as string;

    try {
        await sendPasswordResetEmail(auth, email);
        return { message: 'A password reset link has been sent to your email.'}
    } catch(error: any) {
        return { error: error.message };
    }
}

export async function logout() {
  const auth = getAuthInstance();
  await auth.signOut();
  revalidatePath('/');
  redirect('/');
}
