
'use client';

import { useState, useEffect } from 'react';
import {
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
  Query,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
} from 'firebase/firestore';
import { useFirestore } from '..';

interface CollectionData<T> {
  data: T[] | null;
  loading: boolean;
  error: FirestoreError | null;
}

export function useCollection<T>(q: Query | null): CollectionData<T> {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!q) {
      setLoading(false);
      return;
    };
    
    setLoading(true);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        const docs: T[] = [];
        querySnapshot.forEach((doc) => {
          docs.push({ id: doc.id, ...doc.data() } as T);
        });
        setData(docs);
        setLoading(false);
      },
      (err: FirestoreError) => {
        console.error('Error fetching collection:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [q]);

  return { data, loading, error };
}
