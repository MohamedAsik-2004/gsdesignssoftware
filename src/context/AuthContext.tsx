import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/initialData';
import { loginDeskApi } from '../services/api';

interface AuthContextType {
  currentUser: User;
  users: User[];
  loginAs: (userId: string) => void;
  switchRole: (role: UserRole) => void;
  deskLogin: (role: UserRole, pin?: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('gs_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USERS[0]; // Admin default
  });

  useEffect(() => {
    localStorage.setItem('gs_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const deskLogin = async (role: UserRole, pin?: string): Promise<boolean> => {
    try {
      const res = await loginDeskApi(role, pin);
      if (res.user) {
        setCurrentUser(res.user);
        return true;
      }
    } catch (e) {
      console.warn('API authentication failed, performing local desk switch', e);
    }

    const localUser = users.find(u => u.role === role);
    if (localUser) {
      setCurrentUser(localUser);
      return true;
    }
    return false;
  };

  const loginAs = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      deskLogin(target.role);
    }
  };

  const switchRole = (role: UserRole) => {
    const target = users.find(u => u.role === role);
    if (target) {
      setCurrentUser(target);
      deskLogin(role);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, users, loginAs, switchRole, deskLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
