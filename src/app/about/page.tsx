import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | SarathiEdTech Job Opportunity Platform',
  description:
    'Learn about SarathiEdTech mission to simplify job discovery for students and working professionals through transparent, direct-link job aggregation.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header Title */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-md">
            Our Mission & Principles
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            About <span className="text-blue-600">SarathiEdTech</span>
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Connecting job seekers, students, and professionals with legitimate, verified career openings from top technology and corporate employers.
          </p>
        </div>

        {/* Section 1: What We Do */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>🎯</span> What SarathiEdTech Does
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            SarathiEdTech is a streamlined job-discovery portal built to simplify the career search process. We curate legitimate employment opportunities, outline essential qualifications, and provide direct links to the official company or recruitment portal where applications take place.
          </p>
        </div>

        {/* Section 2: How Applications Work */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>🔗</span> External Direct Application Workflow
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            When you click <strong>&quot;Apply Now&quot;</strong> on any job listing on SarathiEdTech, you are seamlessly redirected to the hiring company&apos;s official application page or designated career portal. We do not store resumes or act as a middleman in the hiring process.
          </p>
        </div>

        {/* Section 3: Disclaimers & Transparency */}
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-amber-900 flex items-center gap-2">
            <span>⚠️</span> Important Disclaimer & Transparency Commitment
          </h2>
          <ul className="list-disc list-inside text-sm text-amber-900 space-y-2 leading-relaxed">
            <li>
              <strong>No Fee Requirement:</strong> SarathiEdTech will <em>never</em> ask candidates for payments, registration fees, or training charges.
            </li>
            <li>
              <strong>No Guarantee of Hiring:</strong> SarathiEdTech does not guarantee job selection, interview calls, or employment outcomes. All hiring decisions rest entirely with the respective employer.
            </li>
            <li>
              <strong>Legitimate Portals Only:</strong> We strive to publish verified opportunities, but job seekers are encouraged to verify application details on official corporate sites.
            </li>
          </ul>
        </div>

        {/* Section 4: Contact Placeholder */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4 text-center">
          <h2 className="text-xl font-bold text-gray-900">Have Questions or Suggestions?</h2>
          <p className="text-sm text-gray-600 max-w-lg mx-auto">
            We are dedicated to improving job discovery for everyone. If you spot a broken link or want to share feedback, reach out to our team.
          </p>
          <div className="pt-2">
            <a
              href="mailto:contact@sarathiedtech.com"
              className="inline-flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow transition-colors"
            >
              ✉️ Contact Us: contact@sarathiedtech.com
            </a>
          </div>
        </div>

        {/* Navigation Call to Action */}
        <div className="text-center pt-4">
          <Link
            href="/"
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 underline"
          >
            ← Back to Explore Job Opportunities
          </Link>
        </div>
      </div>
    </div>
  );
}
