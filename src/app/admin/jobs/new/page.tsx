import React from 'react';
import JobForm from '@/components/admin/JobForm';

export default function NewJobPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <JobForm isEdit={false} />
    </div>
  );
}
