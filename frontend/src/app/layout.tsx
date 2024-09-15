import React from 'react';
import { Roboto } from 'next/font/google';
import '@/styles/globals.scss';

const roboto = Roboto({
  weight: ['300', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} font-sans bg-blue-900 min-h-screen`}>
        <header className="flex justify-between items-center py-4 px-4 2xl:px-24 bg-transparent">
          <h1 className="text-2xl font-bold text-white">Conan Researcher</h1>
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:underline text-white">
              Sign in
            </a>
            <button className="bg-white text-blue-900 px-4 py-2 rounded-full hover:bg-opacity-90 transition-colors font-semibold">
              Get started
            </button>
          </div>
        </header>
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="w-full max-w-5xl">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
