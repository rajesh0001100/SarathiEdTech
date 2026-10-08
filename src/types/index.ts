import { JobStatus } from '@prisma/client';

export type { JobStatus };

export interface Job {
  id: string;
  title: string;
  slug: string;
  companyName: string;
  location: string;
  employmentType: string;
  experience: string;
  salary: string | null;
  description: string;
  skills: string[];
  applicationUrl: string;
  referralUrl: string | null;
  status: JobStatus;
  publishedAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobFormData {
  title: string;
  companyName: string;
  location: string;
  employmentType: string;
  experience: string;
  salary?: string;
  description: string;
  skills: string; // Comma-separated in form
  applicationUrl: string;
  referralUrl?: string;
  status?: JobStatus;
}

export interface ActionResult<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface Todo {
  id: string | number;
  name?: string | null;
  title?: string | null;
  is_complete?: boolean | null;
  created_at?: string | null;
}
