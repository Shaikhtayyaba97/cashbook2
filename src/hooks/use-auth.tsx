
"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { 
    onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    type User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase-client';

interface User {
  uid: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (phone: string, password?: string) => Promise<void>;
  signup: (phone: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
});

const formatEmail = (phone: string) => `${phone}@ledgerlite.app`;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
            const userDocRef = doc(db, "users", firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                setUser({ uid: firebaseUser.uid, phone: userDoc.data().phone });
            } else {
                // This case can happen if the user doc creation failed after signup
                // Or if they were authenticated but their doc was deleted.
                // For this app's logic, we treat them as not fully logged in.
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (phone: string, password?: string) => {
    if (!password) throw new Error("Password is required.");
    await signInWithEmailAndPassword(auth, formatEmail(phone), password);
  };

  const signup = async (phone: string, password?: string) => {
    if (!password) throw new Error("Password is required.");
    const userCredential = await createUserWithEmailAndPassword(auth, formatEmail(phone), password);
    const firebaseUser = userCredential.user;

    // Create the user document in Firestore
    const userDocRef = doc(db, "users", firebaseUser.uid);
    await setDoc(userDocRef, {
        uid: firebaseUser.uid,
        phone: phone,
        createdAt: Timestamp.now(),
    });
    
    // Set the user state immediately after successful doc creation
    setUser({ uid: firebaseUser.uid, phone: phone });
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
