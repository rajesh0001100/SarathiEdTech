'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createJob, updateJob } from '@/lib/actions/job';
import { JobStatus, Job } from '@prisma/client';

interface JobFormProps {
  initialData?: Job | null;
  isEdit?: boolean;
}

export default function JobForm({ initialData, isEdit = false }: JobFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const formattedInitialExpiry = initialData?.expiresAt
    ? new Date(initialData.expiresAt).toISOString().split('T')[0]
    : '';

  const [formData, setFormData] = useState({
    title: initialData?.title ?? '',
    companyName: initialData?.companyName ?? '',
    location: initialData?.location ?? 'Remote / On-site',
    employmentType: initialData?.employmentType ?? 'Full-time',
    experience: initialData?.experience ?? 'Freshers / 0-2 yrs',
    salary: initialData?.salary ?? '',
    description: initialData?.description ?? '',
    skills: initialData?.skills ? initialData.skills.join(', ') : '',
    applicationUrl: initialData?.applicationUrl ?? '',
    referralUrl: initialData?.referralUrl ?? '',
    expiresAt: formattedInitialExpiry,
    status: initialData?.status ?? JobStatus.DRAFT,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setFieldErrors({});

    try {
      const result = isEdit && initialData
        ? await updateJob(initialData.id, formData)
        : await createJob(formData);

      if (result.success) {
        router.push('/admin/jobs');
        router.refresh();
      } else {
        setErrorMsg(result.message || 'Operation failed');
        if (result.errors) {
          setFieldErrors(result.errors);
        }
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200 space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-4">
        {isEdit ? 'Edit Job Opportunity' : 'Post New Job Opportunity'}
      </h2>

      {errorMsg && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm rounded">
          <p className="font-medium">{errorMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Senior Frontend Engineer"
            className={`w-full px-3.5 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              fieldErrors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {fieldErrors.title && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.title[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="e.g. Acme Tech Solutions"
            className={`w-full px-3.5 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              fieldErrors.companyName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {fieldErrors.companyName && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.companyName[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Remote, Bangalore, Mumbai"
            className={`w-full px-3.5 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              fieldErrors.location ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {fieldErrors.location && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.location[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Employment Type <span className="text-red-500">*</span>
          </label>
          <select
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Remote">Remote</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Experience Level <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="e.g. 0-2 yrs, 3-5 yrs"
            className={`w-full px-3.5 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              fieldErrors.experience ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {fieldErrors.experience && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.experience[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Salary Range (Optional)
          </label>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="e.g. ₹6-8 LPA or $80,000"
            className="w-full px-3.5 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Skills (comma separated)
        </label>
        <input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="e.g. React, Node.js, TypeScript, PostgreSQL"
          className="w-full px-3.5 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Official Application URL <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="applicationUrl"
            value={formData.applicationUrl}
            onChange={handleChange}
            placeholder="https://company.com/careers/job-123"
            className={`w-full px-3.5 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              fieldErrors.applicationUrl ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {fieldErrors.applicationUrl && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.applicationUrl[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Referral URL (Optional)
          </label>
          <input
            type="text"
            name="referralUrl"
            value={formData.referralUrl}
            onChange={handleChange}
            placeholder="https://referral-link.com"
            className={`w-full px-3.5 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              fieldErrors.referralUrl ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {fieldErrors.referralUrl && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.referralUrl[0]}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date (Optional)
          </label>
          <input
            type="date"
            name="expiresAt"
            value={formData.expiresAt}
            onChange={handleChange}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Publish Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value={JobStatus.DRAFT}>Draft</option>
            <option value={JobStatus.PUBLISHED}>Published</option>
            <option value={JobStatus.UNPUBLISHED}>Unpublished</option>
            <option value={JobStatus.EXPIRED}>Expired</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Job Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          rows={8}
          value={formData.description}
          onChange={handleChange}
          placeholder="Provide detailed description of job role, responsibilities, and requirements..."
          className={`w-full px-3.5 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            fieldErrors.description ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {fieldErrors.description && (
          <p className="text-red-500 text-xs mt-1">{fieldErrors.description[0]}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 border-t pt-4">
        <button
          type="button"
          onClick={() => router.push('/admin/jobs')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm disabled:opacity-50"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Job' : 'Create Job'}
        </button>
      </div>
    </form>
  );
}
