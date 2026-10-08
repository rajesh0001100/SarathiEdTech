'use client';

import { useEffect, useRef } from 'react';
import { trackJobView } from '@/lib/actions/tracking';

interface ViewTrackerProps {
  jobId: string;
}

export default function ViewTracker({ jobId }: ViewTrackerProps) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (!jobId || trackedRef.current) return;

    const storageKey = `viewed_job_${jobId}`;
    const lastViewed = sessionStorage.getItem(storageKey);
    const now = Date.now();

    // Deduplicate view if already viewed in current browser session within last 1 hour
    if (lastViewed && now - parseInt(lastViewed, 10) < 60 * 60 * 1000) {
      return;
    }

    trackedRef.current = true;
    sessionStorage.setItem(storageKey, now.toString());

    trackJobView(jobId).catch((err) => {
      console.error('Failed to record job view:', err);
    });
  }, [jobId]);

  return null;
}
