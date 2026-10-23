import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  login: (email: string, password?: string) => Promise<void>;
  signup: (data: { name: string; username: string; email: string; password?: string }) => Promise<void>;
  logout: () => void;
}

const mockDefaultUser: User = {
  id: 'usr-1',
  name: 'Elena Rostova',
  username: 'elenarostova',
  email: 'admin@helploop.in',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80',
  bio: 'Community organizer & food relief advocate. HelpLoop Platform Administrator.',
  role: 'admin',
  isVerified: true,
  impactPoints: 1420,
  goodnessPoints: 1850,
  isOnline: true,
  location: 'San Francisco, CA',
  joinedDate: 'March 2024',
};

export const useAuthStore = create<AuthState>((set) => ({
  user: mockDefaultUser,
  isAuthenticated: true,
  isLoading: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),

  login: async (email: string, _password?: string) => {
    set({ isLoading: true });
    // Simulate auth latency
    await new Promise((resolve) => setTimeout(resolve, 400));
    const cleanEmail = email || 'admin@helploop.in';
    const isAdmin = cleanEmail.includes('admin') || cleanEmail === 'demo@helploop.in';
    const userToSet: User = {
      ...mockDefaultUser,
      email: cleanEmail,
      name: isAdmin ? 'Elena Rostova (Admin)' : (cleanEmail.split('@')[0] || 'Community Member'),
      role: isAdmin ? 'admin' : 'user',
    };
    set({
      user: userToSet,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  signup: async (data: { name: string; username: string; email: string; password?: string }) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: data.name,
      username: data.username,
      email: data.email,
      role: 'user',
      isVerified: false,
      impactPoints: 50,
      isOnline: true,
      joinedDate: 'Just now',
    };
    set({
      user: newUser,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));
