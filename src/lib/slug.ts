import { prisma } from '@/lib/prisma';

/**
 * Converts text into a clean URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

/**
 * Ensures a slug is unique in the database
 */
export async function ensureUniqueSlug(baseSlug: string, currentJobId?: string): Promise<string> {
  let slug = baseSlug || 'job-opportunity';
  let count = 0;

  while (true) {
    const existing = await prisma.job.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing || (currentJobId && existing.id === currentJobId)) {
      return slug;
    }

    count += 1;
    slug = `${baseSlug}-${count}`;
  }
}
