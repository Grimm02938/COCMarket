import React, { createContext, useContext, useEffect, useState } from 'react';
import { signInWithGoogle } from '../lib/firebase'; // Import the new function

interface User {
  id: string;
  username: string;
  email: string;
  display_name?: string;
  bio?: string;
  location_display?: string;
  avatar?: string;
  trust_score: number;
  total_sales: number;
  total_purchases: number;
  member_since: string;
  is_verified: boolean;
  badges: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>; // Add the new function
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      fetchCurrentUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/me?token=${authToken}`);
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const authData = await response.json();
    setToken(authData.token);
    setUser(authData.user);
    localStorage.setItem('auth_token', authData.token);
  };

  const register = async (username: string, email: string, password: string) => {
    const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, location: 'fr' }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    const authData = await response.json();
    setToken(authData.token);
    setUser(authData.user);
    localStorage.setItem('auth_token', authData.token);
  };

  // --- New Function for Google Login ---
  const loginWithGoogle = async () => {
    try {
      const firebaseUserCredential = await signInWithGoogle();
      const firebaseToken = await firebaseUserCredential.user.getIdToken();

      const response = await fetch(`${BACKEND_URL}/api/auth/social-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: firebaseToken }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Google login failed');
      }

      const authData = await response.json();
      setToken(authData.token);
      setUser(authData.user);
      localStorage.setItem('auth_token', authData.token);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      // Handle errors here, e.g., show a notification to the user
    }
  };
  // --- End of New Function ---

  const logout = async () => {
    try {
      if (token) {
        await fetch(`${BACKEND_URL}/api/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('auth_token');
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${BACKEND_URL}/api/auth/profile?token=${token}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Profile update failed');
    }
    const updatedUser = await response.json();
    setUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    loginWithGoogle, // Expose the new function
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
