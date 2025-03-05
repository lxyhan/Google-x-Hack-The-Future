'use client'

import { useState, useEffect } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from '../components/cursor';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata must be in a separate file in 'use client' components
// or you can use a separate metadata.js file

export default function RootLayout({ children }) {
  const [isMounted, setIsMounted] = useState(false);

  // Only render the custom cursor on the client side to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {/* Only render custom cursor after component is mounted on client */}
        {isMounted && <CustomCursor />}
      </body>
    </html>
  );
}