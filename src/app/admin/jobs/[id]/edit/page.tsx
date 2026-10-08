import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getJobById } from '@/lib/actions/job';
import JobForm from '@/components/admin/JobForm';

export const instant = false;

interface EditJobPageProps {
  params: Promise<{ id: string }>;
}

async function EditJobFormContent({ params }: EditJobPageProps) {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job) {
    notFound();
  }

  return <JobForm initialData={job} isEdit={true} />;
}

export default function EditJobPage({ params }: EditJobPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="bg-white p-8 text-center rounded border">Loading job details...</div>}>
        <EditJobFormContent params={params} />
      </Suspense>
    </div>
  );
}
