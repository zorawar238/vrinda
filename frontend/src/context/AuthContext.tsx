import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  wishlist?: any[];
  token?: string;
}

interface AuthContextType {
  userInfo: UserInfo | null;
  login: (data: UserInfo) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(() => {
    const savedUser = localStorage.getItem('userInfo');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (userInfo) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } else {
      localStorage.removeItem('userInfo');
    }
  }, [userInfo]);

  const login = (data: UserInfo) => {
    setUserInfo(data);
  };

  const logout = async () => {
    try {
      await fetch('/api/users/logout', { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
