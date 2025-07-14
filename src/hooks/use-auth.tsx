
"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => boolean;
  signup: (email: string, password?: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => false,
  signup: () => false,
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
        console.error("Failed to parse user from local storage", error);
        setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email: string, password?: string): boolean => {
    try {
        const storedUsers = localStorage.getItem('users');
        const users = storedUsers ? JSON.parse(storedUsers) : {};
        
        // In a real app, you'd check the hashed password. Here, we just check for existence.
        if (users[email]) {
            const loggedInUser = { email };
            localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
            setUser(loggedInUser);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Login failed", error);
        return false;
    }
  };

  const signup = (email: string, password?: string): boolean => {
    try {
        const storedUsers = localStorage.getItem('users');
        const users = storedUsers ? JSON.parse(storedUsers) : {};
        
        if (users[email]) {
            return false; // User already exists
        }
        
        // In a real app, you would hash the password
        users[email] = { password };
        localStorage.setItem('users', JSON.stringify(users));

        const newUser = { email };
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        setUser(newUser);
        return true;
    } catch (error) {
        console.error("Signup failed", error);
        return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
