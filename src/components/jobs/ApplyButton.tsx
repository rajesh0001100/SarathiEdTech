'use client';

import React, { useState } from 'react';

interface ApplyButtonProps {
  applicationUrl: string;
  referralUrl?: string | null;
  companyName: string;
  title: string;
}

export default function ApplyButton({
  applicationUrl,
  referralUrl,
  companyName,
  title,
}: ApplyButtonProps) {
  const [showNotice, setShowNotice] = useState(false);

  const targetUrl = referralUrl && referralUrl.trim() !== '' ? referralUrl : applicationUrl;

  const handleApplyClick = () => {
    setShowNotice(true);
  };

  const handleConfirmRedirect = () => {
    setShowNotice(false);
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <button
        onClick={handleApplyClick}
        className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
      >
        <span>APPLY NOW</span>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </button>

      {/* External Redirect Confirmation Modal */}
      {showNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-gray-100">
            <div className="flex items-center space-x-3 text-blue-600">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-xl font-bold">
                ↗️
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                External Portal Redirect
              </h3>
            </div>

            <div className="text-sm text-gray-600 space-y-3 leading-relaxed">
              <p>
                You are leaving <strong className="text-gray-900">SarathiEdTech</strong> to apply for <strong className="text-gray-900">{title}</strong> at <strong className="text-gray-900">{companyName}</strong>.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded text-xs text-blue-900">
                <strong>Notice:</strong> Your application will be submitted directly on the official employer or recruitment portal:
                <div className="font-mono text-gray-700 text-xs mt-1 truncate">
                  {targetUrl}
                </div>
              </div>
              <p className="text-xs text-gray-500 italic">
                * SarathiEdTech never charges application fees and does not guarantee job offers or interviews.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setShowNotice(false)}
                className="w-full sm:w-1/2 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRedirect}
                className="w-full sm:w-1/2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Proceed to Apply</span>
                <span>↗</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
