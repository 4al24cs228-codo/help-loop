import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Moon,
  Sun,
  Globe,
  Lock,
  Download,
  Trash2,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { AppLayout } from '../components/layout';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuthStore();
  const { theme, toggleTheme } = useAppStore();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || 'Bangalore, Karnataka');
  const [language, setLanguage] = useState<'en' | 'kn' | 'hi'>('en');

  // Preferences
  const [isAnonymousDonations, setIsAnonymousDonations] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, bio, location });
    toast.success('Profile preferences updated!');
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(user, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'helploop_profile_data.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('Your HelpLoop data package was downloaded.');
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-emerald-600" /> Account Settings & Privacy
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your personal profile, privacy visibility, notification alerts, and accessibility.
          </p>
        </div>

        {/* Profile Settings */}
        <form onSubmit={handleSaveProfile} className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" /> Public Profile Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Full Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Personal Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </form>

        {/* Privacy & Visibility */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-teal-600" /> Privacy & Contribution Visibility
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-gray-800">
              <div>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  Anonymous Donation Mode
                </p>
                <p className="text-xs text-gray-400">
                  Hide your name and exact contribution amounts from public campaign supporter lists.
                </p>
              </div>
              <input
                type="checkbox"
                checked={isAnonymousDonations}
                onChange={(e) => setIsAnonymousDonations(e.target.checked)}
                className="w-5 h-5 accent-emerald-500 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-gray-800">
              <div>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  Email Notifications
                </p>
                <p className="text-xs text-gray-400">
                  Receive verified campaign updates and certificate awards.
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-5 h-5 accent-emerald-500 rounded"
              />
            </div>
          </div>
        </div>

        {/* Appearance & Languages */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" /> Appearance & Regional Languages
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Interface Theme</p>
                <p className="text-xs text-gray-400">Current: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-white dark:bg-gray-700 shadow-sm text-gray-700 dark:text-gray-200"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 space-y-1.5">
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Regional Language</p>
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value as any);
                  toast.success(`Language set to ${e.target.value.toUpperCase()}`);
                }}
                className="w-full p-2 bg-white dark:bg-gray-700 rounded-xl text-xs font-semibold text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600"
              >
                <option value="en">English (Default)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data & Security */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-600" /> Data Portability & Account Controls
          </h2>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Export Your Data</p>
              <p className="text-xs text-gray-400">Download a full JSON archive of your badges, contributions, and profile.</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleExportData} leftIcon={<Download className="w-4 h-4" />}>
              Download Archive
            </Button>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <span className="text-xs text-red-500 font-semibold">Sign out of this session</span>
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 border-red-200 hover:bg-red-50"
              onClick={() => {
                logout();
                navigate('/');
                toast.success('Logged out safely.');
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
