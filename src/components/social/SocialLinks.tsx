import React from 'react';
import { socialLinks } from '@/config/socialLinks';

export default function SocialLinks() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold text-sm tracking-wide">
        Connect With Us
      </h3>
      <div className="flex flex-wrap gap-3">
        {/* WhatsApp Group */}
        <a
          href={socialLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="SarathiEdTech WhatsApp"
          className="inline-flex items-center space-x-2 px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold transition-colors"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.146 4.187 4.249-1.114z" />
          </svg>
          <span>WhatsApp Group</span>
        </a>

        {/* WhatsApp Channel */}
        <a
          href={socialLinks.whatsappChannel}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="SarathiEdTech WhatsApp Channel"
          className="inline-flex items-center space-x-2 px-3.5 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 rounded-lg text-xs font-semibold transition-colors"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.08L2 22l4.98-1.31C8.45 21.53 10.16 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
          </svg>
          <span>WhatsApp Channel</span>
        </a>

        {/* Telegram */}
        <a
          href={socialLinks.telegram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="SarathiEdTech Telegram"
          className="inline-flex items-center space-x-2 px-3.5 py-2 bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 border border-sky-500/30 rounded-lg text-xs font-semibold transition-colors"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-2.02 9.51c-.15.68-.56.84-1.13.53l-3.1-2.29-1.49 1.44c-.16.16-.3.3-.61.3l.22-3.15 5.73-5.18c.25-.22-.05-.34-.38-.12l-7.08 4.46-3.05-.95c-.66-.21-.67-.66.14-.98l11.92-4.6c.55-.2 1.04.13.85.98z" />
          </svg>
          <span>Telegram</span>
        </a>

        {/* LinkedIn */}
        <a
          href={socialLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="SarathiEdTech LinkedIn"
          className="inline-flex items-center space-x-2 px-3.5 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-semibold transition-colors"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
          <span>LinkedIn</span>
        </a>

        {/* Instagram */}
        <a
          href={socialLinks.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="SarathiEdTech Instagram"
          className="inline-flex items-center space-x-2 px-3.5 py-2 bg-pink-600/20 hover:bg-pink-600/30 text-pink-400 border border-pink-500/30 rounded-lg text-xs font-semibold transition-colors"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
          <span>Instagram</span>
        </a>
      </div>
    </div>
  );
}
