'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { jobSchema } from '@/lib/validations/job';
import { slugify, ensureUniqueSlug } from '@/lib/slug';
import { JobStatus, Job } from '@prisma/client';
import { ActionResult } from '@/types';
import { isAdminAuthenticated } from '@/lib/auth';

function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path);
  } catch {
    // Ignore when executed outside Next.js server request scope
  }
}

interface ActionOptions {
  skipAuth?: boolean;
}

export async function createJob(input: unknown, options?: ActionOptions): Promise<ActionResult<Job>> {
  try {
    if (!options?.skipAuth && !(await isAdminAuthenticated())) {
      return { success: false, message: 'Unauthorized: Admin authentication required' };
    }

    const validationResult = jobSchema.safeParse(input);

    if (!validationResult.success) {
      const fieldErrors: Record<string, string[]> = {};
      const issues = validationResult.error.issues || [];
      issues.forEach((err) => {
        const path = err.path.join('.') || 'root';
        if (!fieldErrors[path]) fieldErrors[path] = [];
        fieldErrors[path].push(err.message);
      });
      return {
        success: false,
        message: 'Validation failed',
        errors: fieldErrors,
      };
    }

    const data = validationResult.data;
    const baseSlug = slugify(data.title);
    const uniqueSlug = await ensureUniqueSlug(baseSlug);

    const publishedAt = data.status === JobStatus.PUBLISHED ? new Date() : null;

    const job = await prisma.job.create({
      data: {
        title: data.title,
        slug: uniqueSlug,
        companyName: data.companyName,
        location: data.location,
        employmentType: data.employmentType,
        experience: data.experience,
        salary: data.salary || null,
        description: data.description,
        skills: data.skills,
        applicationUrl: data.applicationUrl,
        referralUrl: data.referralUrl || null,
        status: data.status,
        publishedAt,
        expiresAt: data.expiresAt || null,
      },
    });

    safeRevalidatePath('/');
    safeRevalidatePath('/admin');
    safeRevalidatePath('/jobs');

    return {
      success: true,
      message: 'Job created successfully',
      data: job,
    };
  } catch (error) {
    console.error('Error creating job:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create job',
    };
  }
}

export async function updateJob(id: string, input: unknown, options?: ActionOptions): Promise<ActionResult<Job>> {
  try {
    if (!options?.skipAuth && !(await isAdminAuthenticated())) {
      return { success: false, message: 'Unauthorized: Admin authentication required' };
    }

    const existingJob = await prisma.job.findUnique({
      where: { id },
    });

    if (!existingJob) {
      return {
        success: false,
        message: 'Job not found',
      };
    }

    const validationResult = jobSchema.safeParse(input);

    if (!validationResult.success) {
      const fieldErrors: Record<string, string[]> = {};
      const issues = validationResult.error.issues || [];
      issues.forEach((err) => {
        const path = err.path.join('.') || 'root';
        if (!fieldErrors[path]) fieldErrors[path] = [];
        fieldErrors[path].push(err.message);
      });
      return {
        success: false,
        message: 'Validation failed',
        errors: fieldErrors,
      };
    }

    const data = validationResult.data;

    let slug = existingJob.slug;
    if (data.title !== existingJob.title) {
      const baseSlug = slugify(data.title);
      slug = await ensureUniqueSlug(baseSlug, id);
    }

    let publishedAt = existingJob.publishedAt;
    if (data.status === JobStatus.PUBLISHED && !publishedAt) {
      publishedAt = new Date();
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        title: data.title,
        slug,
        companyName: data.companyName,
        location: data.location,
        employmentType: data.employmentType,
        experience: data.experience,
        salary: data.salary || null,
        description: data.description,
        skills: data.skills,
        applicationUrl: data.applicationUrl,
        referralUrl: data.referralUrl || null,
        status: data.status,
        publishedAt,
        expiresAt: data.expiresAt || null,
      },
    });

    safeRevalidatePath('/');
    safeRevalidatePath('/admin');
    safeRevalidatePath(`/jobs/${slug}`);

    return {
      success: true,
      message: 'Job updated successfully',
      data: updatedJob,
    };
  } catch (error) {
    console.error('Error updating job:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update job',
    };
  }
}

export async function deleteJob(id: string, options?: ActionOptions): Promise<ActionResult> {
  try {
    if (!options?.skipAuth && !(await isAdminAuthenticated())) {
      return { success: false, message: 'Unauthorized: Admin authentication required' };
    }

    const existingJob = await prisma.job.findUnique({
      where: { id },
    });

    if (!existingJob) {
      return { success: false, message: 'Job not found' };
    }

    await prisma.job.delete({
      where: { id },
    });

    safeRevalidatePath('/');
    safeRevalidatePath('/admin');

    return {
      success: true,
      message: 'Job deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting job:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete job',
    };
  }
}

export async function publishJob(id: string, options?: ActionOptions): Promise<ActionResult<Job>> {
  try {
    if (!options?.skipAuth && !(await isAdminAuthenticated())) {
      return { success: false, message: 'Unauthorized: Admin authentication required' };
    }

    const existingJob = await prisma.job.findUnique({ where: { id } });
    if (!existingJob) {
      return { success: false, message: 'Job not found' };
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        status: JobStatus.PUBLISHED,
        publishedAt: existingJob.publishedAt ?? new Date(),
      },
    });

    safeRevalidatePath('/');
    safeRevalidatePath('/admin');
    safeRevalidatePath(`/jobs/${updatedJob.slug}`);

    return {
      success: true,
      message: 'Job published successfully',
      data: updatedJob,
    };
  } catch (error) {
    console.error('Error publishing job:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to publish job',
    };
  }
}

export async function unpublishJob(id: string, options?: ActionOptions): Promise<ActionResult<Job>> {
  try {
    if (!options?.skipAuth && !(await isAdminAuthenticated())) {
      return { success: false, message: 'Unauthorized: Admin authentication required' };
    }

    const existingJob = await prisma.job.findUnique({ where: { id } });
    if (!existingJob) {
      return { success: false, message: 'Job not found' };
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        status: JobStatus.UNPUBLISHED,
      },
    });

    safeRevalidatePath('/');
    safeRevalidatePath('/admin');
    safeRevalidatePath(`/jobs/${updatedJob.slug}`);

    return {
      success: true,
      message: 'Job unpublished successfully',
      data: updatedJob,
    };
  } catch (error) {
    console.error('Error unpublishing job:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to unpublish job',
    };
  }
}

export async function getJobs(options?: {
  status?: JobStatus;
  search?: string;
  limit?: number;
}): Promise<Job[]> {
  try {
    const whereClause: Record<string, unknown> = {};

    if (options?.status) {
      whereClause.status = options.status;
    }

    if (options?.search) {
      whereClause.OR = [
        { title: { contains: options.search, mode: 'insensitive' } },
        { companyName: { contains: options.search, mode: 'insensitive' } },
        { description: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    const jobs = await prisma.job.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: options?.limit,
    });

    return jobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

export async function getJobById(id: string): Promise<Job | null> {
  try {
    return await prisma.job.findUnique({ where: { id } });
  } catch (error) {
    console.error('Error fetching job by ID:', error);
    return null;
  }
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  try {
    return await prisma.job.findUnique({ where: { slug } });
  } catch (error) {
    console.error('Error fetching job by slug:', error);
    return null;
  }
}
