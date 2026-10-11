import { cn } from "@/lib/utils";

/*
 * The Arise mark: a half sun rising behind three cantilevered slabs, the same stacked
 * floors as the 3D house. The sun takes the dusk accent; the slabs take the text colour.
 */
export function LogoMark({ className, sun = "var(--color-dusk)" }: { className?: string; sun?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-7", className)}>
      <path d="M9 15.5a7 7 0 0 1 14 0Z" fill={sun} />
      <rect x="3" y="17.5" width="22" height="3.4" rx="1.7" fill="currentColor" />
      <rect x="9" y="22.6" width="20" height="3.4" rx="1.7" fill="currentColor" />
      <rect x="5" y="27.7" width="19" height="3.4" rx="1.7" fill="currentColor" opacity="0.55" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      <span className="text-[1.375rem] font-bold tracking-[-0.05em]">arise</span>
    </span>
  );
}
