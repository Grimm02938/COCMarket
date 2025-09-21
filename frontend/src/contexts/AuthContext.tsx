import React, { createContext, useContext, useEffect, useState } from 'react';

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

  // Load token from localStorage on mount
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
        // Token is invalid, clear it
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
    console.log('🔐 AuthContext: Tentative de connexion pour:', email);
    console.log('🌐 Backend URL:', BACKEND_URL);
    
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('📡 Réponse du serveur - Status:', response.status);

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Erreur de connexion:', error);
      throw new Error(error.detail || 'Login failed');
    }

    const authData = await response.json();
    console.log('✅ Données d\'authentification reçues:', { 
      hasToken: !!authData.token, 
      hasUser: !!authData.user,
      username: authData.user?.username 
    });
    
    setToken(authData.token);
    setUser(authData.user);
    localStorage.setItem('auth_token', authData.token);
  };

  const register = async (username: string, email: string, password: string) => {
    console.log('📝 AuthContext: Tentative d\'inscription pour:', { username, email });
    console.log('🌐 Backend URL:', BACKEND_URL);
    
    const requestData = {
      username,
      email,
      password,
      location: 'fr',
    };
    
    console.log('📤 Données envoyées:', { ...requestData, password: '[MASQUÉ]' });
    
    const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    console.log('📡 Réponse du serveur - Status:', response.status);

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Erreur d\'inscription:', error);
      throw new Error(error.detail || 'Registration failed');
    }

    const authData = await response.json();
    console.log('✅ Inscription réussie, données reçues:', { 
      hasToken: !!authData.token, 
      hasUser: !!authData.user,
      username: authData.user?.username,
      userId: authData.user?.id 
    });
    
    setToken(authData.token);
    setUser(authData.user);
    localStorage.setItem('auth_token', authData.token);
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch(`${BACKEND_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
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
      headers: {
        'Content-Type': 'application/json',
      },
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
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};