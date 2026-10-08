import React from 'react';
import { socialLinks } from '@/config/socialLinks';

export default function RegistrationCTA() {
  return (
    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-blue-800/40 space-y-4">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-300 bg-blue-800/50 px-3 py-1 rounded-full border border-blue-400/20">
          Candidate Registration
        </span>
        <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
          One-Time Registration
        </h3>
        <p className="text-sm text-blue-100 max-w-xl leading-relaxed">
          Register once to receive relevant job opportunities and career updates. You don&apos;t need to register again for every job.
        </p>
        <p className="text-xs text-blue-300/80 italic">
          * Job applications are completed through the respective employer or job portal.
        </p>
      </div>

      <div className="pt-2">
        <a
          href={socialLinks.registrationForm}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Register with SarathiEdTech"
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
        >
          <span>Register Now</span>
          <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}
