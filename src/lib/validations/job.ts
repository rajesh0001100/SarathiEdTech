import { z } from 'zod';
import { JobStatus } from '@prisma/client';

const urlSchema = z
  .string()
  .trim()
  .min(1, { message: 'URL is required' })
  .refine(
    (val) => {
      try {
        const parsed = new URL(val);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
      } catch {
        return false;
      }
    },
    { message: 'Must be a valid URL starting with http:// or https://' }
  );

const optionalUrlSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (val) => {
      if (!val || val.trim() === '') return true;
      try {
        const parsed = new URL(val);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
      } catch {
        return false;
      }
    },
    { message: 'Must be a valid URL starting with http:// or https://' }
  );

export const jobSchema = z.object({
  title: z.string().trim().min(1, { message: 'Job title is required' }),
  companyName: z.string().trim().min(1, { message: 'Company name is required' }),
  location: z.string().trim().min(1, { message: 'Location is required' }),
  employmentType: z.string().trim().min(1, { message: 'Employment type is required' }),
  experience: z.string().trim().min(1, { message: 'Experience requirement is required' }),
  salary: z.string().trim().optional(),
  description: z.string().trim().min(1, { message: 'Job description is required' }),
  skills: z.union([z.string(), z.array(z.string())]).transform((val) => {
    if (Array.isArray(val)) return val;
    return val
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }),
  applicationUrl: urlSchema,
  referralUrl: optionalUrlSchema,
  expiresAt: z.union([z.string(), z.date(), z.null()]).optional().transform((val) => {
    if (!val || val === '') return null;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }),
  status: z.nativeEnum(JobStatus).optional().default(JobStatus.DRAFT),
});

export type JobInput = z.infer<typeof jobSchema>;
