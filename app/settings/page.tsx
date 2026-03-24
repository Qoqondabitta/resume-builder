'use client';

import { motion } from 'framer-motion';
import {
  User, Bell, Moon, Globe, ChevronRight,
  Shield, HelpCircle, LogOut, Camera,
} from 'lucide-react';
import { useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';

interface ToggleProps { checked: boolean; onChange: () => void }

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
        checked ? 'bg-primary-600' : 'bg-gray-200'
      }`}
    >
      <motion.span
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md block"
      />
    </button>
  );
}

const LANGUAGES = ['English', 'Turkish', 'Spanish', 'French', 'German', 'Arabic'];

export default function SettingsPage() {
  const [darkMode,       setDarkMode]       = useState(false);
  const [notifications,  setNotifications]  = useState(true);
  const [emailAlerts,    setEmailAlerts]     = useState(false);
  const [language,       setLanguage]        = useState('English');

  return (
    <div className="space-y-5 py-4">
      {/* Page title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage your account &amp; preferences</p>
      </motion.div>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.07 }}
      >
        <Card className="!p-5">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                A
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full shadow-card flex items-center justify-center border border-gray-100">
                <Camera size={11} className="text-primary-600" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-base">Alex Johnson</p>
              <p className="text-sm text-gray-400 truncate">alex.johnson@email.com</p>
              <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold px-2 py-0.5 bg-primary-50 text-primary-600 rounded-full border border-primary-100">
                ✦ Pro Plan
              </span>
            </div>

            <button className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
              <ChevronRight size={16} className="text-gray-500" />
            </button>
          </div>
        </Card>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.12 }}
      >
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Appearance</p>
        <Card>
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
                <Moon size={17} className="text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Dark Mode</p>
                <p className="text-xs text-gray-400">Switch to dark theme</p>
              </div>
            </div>
            <Toggle checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
          </div>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.16 }}
      >
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Notifications</p>
        <Card className="divide-y divide-gray-50">
          <div className="flex items-center justify-between py-3 first:pt-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                <Bell size={17} className="text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Push Notifications</p>
                <p className="text-xs text-gray-400">Resume tips &amp; updates</p>
              </div>
            </div>
            <Toggle checked={notifications} onChange={() => setNotifications(!notifications)} />
          </div>

          <div className="flex items-center justify-between py-3 last:pb-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                <Bell size={17} className="text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Email Alerts</p>
                <p className="text-xs text-gray-400">Weekly resume insights</p>
              </div>
            </div>
            <Toggle checked={emailAlerts} onChange={() => setEmailAlerts(!emailAlerts)} />
          </div>
        </Card>
      </motion.div>

      {/* Language */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.20 }}
      >
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Language</p>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
              <Globe size={17} className="text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">Language</p>
              <p className="text-xs text-gray-400">Select app language</p>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-sm font-medium text-primary-600 bg-primary-50 border border-primary-100 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-300 cursor-pointer"
            >
              {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
        </Card>
      </motion.div>

      {/* More options */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.24 }}
      >
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">More</p>
        <Card className="divide-y divide-gray-50">
          {[
            { icon: User,        color: 'bg-violet-50 text-violet-600', label: 'Account Details',   sub: 'Manage your profile' },
            { icon: Shield,      color: 'bg-amber-50 text-amber-600',   label: 'Privacy & Security', sub: 'Password, 2FA'       },
            { icon: HelpCircle,  color: 'bg-teal-50 text-teal-600',     label: 'Help & Support',     sub: 'FAQs, contact us'    },
          ].map(({ icon: Icon, color, label, sub }, i) => (
            <div key={label} className={`flex items-center gap-3 cursor-pointer hover:bg-gray-50 -mx-4 px-4 transition-colors ${i === 0 ? 'pt-1 pb-3' : i === 2 ? 'pt-3 pb-1' : 'py-3'}`}>
              <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon size={17} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </div>
          ))}
        </Card>
      </motion.div>

      {/* Logout */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.28 }}
        className="pb-2"
      >
        <Button
          variant="danger"
          size="lg"
          fullWidth
          icon={<LogOut size={18} />}
          className="!rounded-2xl"
        >
          Log Out
        </Button>
        <p className="text-center text-xs text-gray-300 mt-3">ResumeAI v1.0.0</p>
      </motion.div>
    </div>
  );
}
