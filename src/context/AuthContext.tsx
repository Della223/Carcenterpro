import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type UserRole = 'admin' | 'financeiro' | 'operador';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
}

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USERS: Record<string, AppUser> = {
  'nicole@carcenter.pro': {
    id: 'cce66177-0122-4f1a-84a2-6a501f4a1978',
    name: 'Nicole',
    email: 'nicole@carcenter.pro',
    role: 'admin',
    avatarInitials: 'NI',
  },
  'carlinhos@carcenter.pro': {
    id: '7777f677-b4c2-474e-bef9-3375fbb8235d',
    name: 'Carlinhos',
    email: 'carlinhos@carcenter.pro',
    role: 'financeiro',
    avatarInitials: 'CA',
  },
  'daniel@carcenter.pro': {
    id: '793c85c3-e8cf-4514-acd8-069094b3fc55',
    name: 'Daniel',
    email: 'daniel@carcenter.pro',
    role: 'operador',
    avatarInitials: 'DA',
  },
};

export const USER_LIST = Object.values(USERS);

const STORAGE_KEY = 'carcenter-pro-auth-v2';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = (email: string) => {
    const foundUser = USERS[email.toLowerCase()];
    if (!foundUser) return;
    setUser(foundUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(foundUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
