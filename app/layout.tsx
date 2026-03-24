import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'ResumeAI — Smart Resume Builder',
  description: 'Build a professional resume in minutes',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        {/* Fixed top header */}
        <Header />

        {/* Main scrollable content — padded for header (64px) + navbar (72px) */}
        <main className="pt-16 pb-20 min-h-screen max-w-lg mx-auto px-4">
          {children}
        </main>

        {/* Fixed bottom nav */}
        <Navbar />
      </body>
    </html>
  );
}
