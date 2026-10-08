import React from 'react';
import Link from 'next/link';
import RegistrationCTA from '@/components/social/RegistrationCTA';
import SocialLinks from '@/components/social/SocialLinks';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 text-sm border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Registration CTA Section */}
        <div>
          <RegistrationCTA />
        </div>

        {/* Footer Navigation & Social Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Section 1: SarathiEdTech Brand Overview */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-base">
                S
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Sarathi<span className="text-blue-500">EdTech</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm max-w-md leading-relaxed">
              Discover relevant job opportunities and career opportunities. SarathiEdTech curates verified career openings and connects candidates directly to official employer portals.
            </p>

            <ul className="flex space-x-6 text-xs text-gray-400 pt-2">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Explore Jobs
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About SarathiEdTech
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 3: Social & Community Links */}
          <div className="md:col-span-2">
            <SocialLinks />
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p className="text-center sm:text-left">
            © 2026 SarathiEdTech. All rights reserved. SarathiEdTech never charges registration or application fees.
          </p>
          <p className="text-center sm:text-right">
            Connecting Talent with Opportunities.
          </p>
        </div>
      </div>
    </footer>
  );
}
