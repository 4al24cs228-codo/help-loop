/**
 * HelpLoop Authentication Store (Zustand)
 * Manages user authentication state, demo logins, profile updates, and persistence
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { DEMO_USERS, DEMO_BADGES } from '../data/demoData';

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<User>) => void;
  setCurrentUser: (user: User | null) => void;
  clearError: () => void;
}

// Default initial user is the demo user for immediate seamless hackathon presentation
const DEFAULT_DEMO_USER: User = DEMO_USERS[0]; // Abhishek Sharma (demo@helploop.in)

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: DEFAULT_DEMO_USER,
      isAuthenticated: true,
      isLoading: false,
      error: null,

      login: async (email: string, password?: string) => {
        set({ isLoading: true, error: null });

        // Simulate network latency for realistic UX
        await new Promise((resolve) => setTimeout(resolve, 400));

        const cleanEmail = email.trim().toLowerCase();

        // 1. Check if email matches our primary demo account
        if (cleanEmail === 'demo@helploop.in') {
          // If demo123 or any password provided
          set({
            currentUser: DEMO_USERS[0],
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return { success: true };
        }

        // 2. Check if email matches any other demo user
        const matchedDemoUser = DEMO_USERS.find(
          (u) => (u.email && u.email.toLowerCase() === cleanEmail) || (u.username && u.username.toLowerCase() === cleanEmail)
        );

        if (matchedDemoUser) {
          set({
            currentUser: matchedDemoUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return { success: true };
        }

        // 3. Fallback demo login: Allow any valid-looking email to sign in as a guest patron
        if (cleanEmail.includes('@')) {
          const derivedName = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
          const formattedName = derivedName
            .split(' ')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');

          const customUser: User = {
            id: `user-${Date.now()}`,
            email: cleanEmail,
            name: formattedName || 'Impact Supporter',
            username: cleanEmail.split('@')[0],
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formattedName)}`,
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formattedName)}`,
            bio: 'Passionate citizen striving to make a transparent difference in the community.',
            location: 'Bangalore, Karnataka',
            role: 'patron',
            isVerified: true,
            is_verified: true,
            isImpactPatron: true,
            is_impact_patron: true,
            goodnessPoints: 100,
            goodness_points: 100,
            badges: [DEMO_BADGES[0]], // Kindness Starter
            followersCount: 1,
            followingCount: 3,
            impactSummary: {
              totalDonated: 0,
              hoursVolunteered: 0,
              requestsHelped: 0,
              campaignsSupported: 0,
              eventsAttended: 0,
            },
            created_at: new Date().toISOString(),
          };

          set({
            currentUser: customUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return { success: true };
        }

        // Invalid credentials
        const errorMsg = 'Please enter a valid email address or use demo@helploop.in / demo123';
        set({
          isLoading: false,
          error: errorMsg,
        });
        return { success: false, error: errorMsg };
      },

      logout: () => {
        set({
          currentUser: null,
          isAuthenticated: false,
          error: null,
        });
      },

      signup: async (email: string, _password: string, name: string) => {
        set({ isLoading: true, error: null });

        await new Promise((resolve) => setTimeout(resolve, 400));

        const cleanEmail = email.trim().toLowerCase();
        const cleanName = name.trim();

        if (!cleanEmail || !cleanName) {
          const errorMsg = 'Please provide both your name and email.';
          set({ isLoading: false, error: errorMsg });
          return { success: false, error: errorMsg };
        }

        const newUser: User = {
          id: `user-${Date.now()}`,
          email: cleanEmail,
          name: cleanName,
          username: cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_'),
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`,
          bio: 'Community member on HelpLoop.',
          location: 'Bangalore, Karnataka',
          role: 'user',
          isVerified: false,
          is_verified: false,
          isImpactPatron: false,
          is_impact_patron: false,
          goodnessPoints: 100, // Starter bonus
          goodness_points: 100,
          badges: [DEMO_BADGES[0]], // Kindness Starter
          followersCount: 0,
          followingCount: 0,
          impactSummary: {
            totalDonated: 0,
            hoursVolunteered: 0,
            requestsHelped: 0,
            campaignsSupported: 0,
            eventsAttended: 0,
          },
          created_at: new Date().toISOString(),
        };

        set({
          currentUser: newUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        return { success: true };
      },

      updateProfile: (data: Partial<User>) => {
        const { currentUser } = get();
        if (!currentUser) return;

        const updated: User = {
          ...currentUser,
          ...data,
          updated_at: new Date().toISOString(),
        };

        set({ currentUser: updated });
      },

      setCurrentUser: (user: User | null) => {
        set({
          currentUser: user,
          isAuthenticated: !!user,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'helploop-auth-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
