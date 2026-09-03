import { createContext, useContext, useState, ReactNode } from 'react';
import { authApi } from '../api/auth';
import { LoginResponse } from '../types';

interface AuthContextValue {
  faculty: LoginResponse['faculty'] | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [faculty, setFaculty] = useState<LoginResponse['faculty'] | null>(() => {
    const stored = localStorage.getItem('faculty');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('faculty', JSON.stringify(res.faculty));
    setFaculty(res.faculty);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('faculty');
    setFaculty(null);
  };

  return (
    <AuthContext.Provider value={{ faculty, login, logout, isAuthenticated: !!faculty }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
