import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, UserRole } from '../types';

export interface LoginResult {
  success: boolean;
  role?: UserRole;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => LoginResult;
  register: (email: string, password: string, name: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Pre-defined users; admin accounts are admin-only (no registration). Clients can register.
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'admin@gmail.com': { password: 'admin123', user: { id: '1', email: 'admin@gmail.com', name: 'Admin', role: 'admin' } },
  'client@example.com': { password: 'client123', user: { id: '2', email: 'client@example.com', name: 'Client User', role: 'client' } },
};

const STORAGE_KEY = 'threat_monitoring_user';
const REGISTERED_KEY = 'threat_monitoring_registered';

type RegisteredRecord = Record<string, { password: string; name: string }>;

function getRegistered(): RegisteredRecord {
  try {
    const stored = localStorage.getItem(REGISTERED_KEY);
    return stored ? (JSON.parse(stored) as RegisteredRecord) : {};
  } catch {
    return {};
  }
}

function setRegistered(record: RegisteredRecord) {
  localStorage.setItem(REGISTERED_KEY, JSON.stringify(record));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as User;
      } catch {
        return null;
      }
    }
    return null;
  });

  const login = useCallback((email: string, password: string): LoginResult => {
    const key = email.trim().toLowerCase();

    // Pre-defined admin or client
    const demo = DEMO_USERS[key];
    if (demo && demo.password === password) {
      setUser(demo.user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demo.user));
      return { success: true, role: demo.user.role };
    }

    // Registered clients only (no admin registration)
    const registered = getRegistered();
    const reg = registered[key];
    if (reg && reg.password === password) {
      const newUser: User = { id: crypto.randomUUID(), email: key, name: reg.name, role: 'client' };
      setUser(newUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      return { success: true, role: 'client' };
    }

    return { success: false, error: 'Invalid email or password.' };
  }, []);

  const register = useCallback((email: string, password: string, name: string): boolean => {
    const key = email.trim().toLowerCase();
    if (DEMO_USERS[key]) return false;
    const registered = getRegistered();
    if (registered[key]) return false;
    registered[key] = { password, name };
    setRegistered(registered);
    const newUser: User = { id: crypto.randomUUID(), email: key, name, role: 'client' };
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
