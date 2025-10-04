
'use server';

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// This function should be carefully managed to avoid re-initialization.
function getFirebaseInstances() {
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
  return { auth: getAuth(), firestore: getFirestore() };
}

type ActionState = {
  error?: string | null;
  message?: string | null;
};

export async function login(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const { auth } = getFirebaseInstances();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const next = formData.get('next') as string || '/account';

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    // Return a more user-friendly error message
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        return { error: 'Invalid email or password. Please try again.' };
    }
    return { error: 'An unexpected error occurred. Please try again later.' };
  }

  // On success, revalidate and redirect
  revalidatePath('/', 'layout');
  redirect(next);
}

export async function signup(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const { auth, firestore } = getFirebaseInstances();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const next = formData.get('next') as string || '/account';

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  if(password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user profile in Firestore
    const userRef = doc(firestore, "users", user.uid);
    await setDoc(userRef, {
      id: user.uid,
      email: user.email,
      username: user.email?.split('@')[0], // default username
      plan: "free",
      createdAt: serverTimestamp(),
      entitlements: {
        alerts: { maxActive: 1, channels: ["in-app"] },
        feed: { delayMinutes: 2 },
        leaderboard: { topN: 10 },
        apiAccess: false
      },
      quotas: { exportsPerDay: 0 }
    });

  } catch (error: any) {
     if (error.code === 'auth/email-already-in-use') {
        return { error: 'This email is already in use. Please log in.' };
     }
     return { error: 'An unexpected error occurred during sign up.' };
  }

  revalidatePath('/', 'layout');
  redirect(next);
}


export async function resetPassword(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const { auth } = getFirebaseInstances();
    const email = formData.get('email') as string;
    
    if (!email) {
        return { error: 'Email is required.' };
    }

    try {
        await sendPasswordResetEmail(auth, email);
        return { message: 'A password reset link has been sent to your email.'}
    } catch(error: any) {
        return { error: 'Failed to send password reset email.' };
    }
}

export async function logout() {
  const { auth } = getFirebaseInstances();
  await auth.signOut();
  revalidatePath('/', 'layout');
}
