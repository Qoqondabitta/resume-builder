'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookmarkCheck, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const tabs = [
  { label: 'Dashboard', href: '/',         icon: LayoutDashboard },
  { label: 'Saved',     href: '/saved',    icon: BookmarkCheck   },
  { label: 'Settings',  href: '/settings', icon: Settings        },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <div className="max-w-lg mx-auto flex h-[72px]">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex-1 flex flex-col items-center justify-center gap-1 group relative"
            >
              {active && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute top-0 inset-x-0 mx-auto w-10 h-1 bg-primary-500 rounded-b-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.85 }}
                className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-colors ${
                  active ? 'bg-primary-50' : 'bg-transparent group-hover:bg-gray-100'
                }`}
              >
                <Icon
                  size={20}
                  className={active ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}
                />
              </motion.div>
              <span
                className={`text-[10px] font-semibold tracking-wide ${
                  active ? 'text-primary-600' : 'text-gray-400'
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
