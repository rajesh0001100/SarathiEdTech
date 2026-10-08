'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { socialLinks } from '@/config/socialLinks';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow">
              S
            </div>
            <div>
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">
                Sarathi<span className="text-blue-600">EdTech</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                Job Discovery
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              Explore Jobs
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              About Us
            </Link>
            <a
              href={socialLinks.registrationForm}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Register with SarathiEdTech"
              className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <span>Register Now</span>
              <span className="text-xs">↗</span>
            </a>
            <Link
              href="/admin"
              className="text-sm font-medium text-gray-500 hover:text-blue-600 px-2 py-1 rounded transition-colors"
            >
              Admin
            </Link>
          </nav>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center space-x-2">
            <a
              href={socialLinks.registrationForm}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Register with SarathiEdTech"
              className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg shadow-sm"
            >
              Register Now
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-4 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          >
            Explore Jobs
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          >
            About Us
          </Link>
          <a
            href={socialLinks.registrationForm}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Register with SarathiEdTech"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-bold text-blue-600 bg-blue-50"
          >
            Register Now ↗
          </a>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:bg-gray-50"
          >
            Admin Portal
          </Link>
        </div>
      )}
    </header>
  );
}
