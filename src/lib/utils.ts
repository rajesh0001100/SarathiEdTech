/**
 * Class name concatenation utility for Tailwind CSS
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
