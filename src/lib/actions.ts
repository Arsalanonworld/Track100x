
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

// Initialize Firebase Admin SDK for server-side actions
// Note: This is a simplified example. In a real app, you'd want to
// initialize the admin SDK once and share the instance.
function getFirebaseInstances() {
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
  return { auth: getAuth(), firestore: getFirestore() };
}

export async function login(prevState: any, formData: FormData) {
  const { auth } = getFirebaseInstances();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const next = formData.get('next') as string || '/';

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    return { error: error.message };
  }
  revalidatePath('/');
  redirect(next);
}

export async function signup(prevState: any, formData: FormData) {
  const { auth, firestore } = getFirebaseInstances();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const next = formData.get('next') as string || '/';

  if (!email || !password) {
    return { error: 'Email and password are required.' };
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
        alerts: {
          maxActive: 3,
          channels: ["email"]
        },
        feed: {
          delayMinutes: 15
        },
        leaderboard: {
          topN: 10
        },
        apiAccess: false
      },
      quotas: {
        exportsPerDay: 1
      }
    });

  } catch (error: any) {
    return { error: error.message };
  }

  revalidatePath('/');
  redirect(next);
}

export async function resetPassword(prevState: any, formData: FormData) {
    const { auth } = getFirebaseInstances();
    const email = formData.get('email') as string;
    
    if (!email) {
        return { error: 'Email is required.' };
    }

    try {
        await sendPasswordResetEmail(auth, email);
        return { message: 'A password reset link has been sent to your email.'}
    } catch(error: any) {
        return { error: error.message };
    }
}

export async function logout() {
  const { auth } = getFirebaseInstances();
  await auth.signOut();
  revalidatePath('/');
  redirect('/');
}
