import { cn } from "@/lib/utils";

interface SpacetimeGridProps {
  className?: string;
}

export function SpacetimeGrid({ className }: SpacetimeGridProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <svg
        className="h-full w-full opacity-[0.05]"
        viewBox="0 0 1200 700"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="st-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M40 0H0V40"
              fill="none"
              stroke="var(--color-text)"
              strokeWidth="0.7"
            />
          </pattern>
        </defs>
        <rect width="1200" height="700" fill="url(#st-grid)" />
        <path
          d="M-120 530C130 360 270 350 470 430C640 500 780 520 1010 360C1080 310 1150 250 1300 230"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2"
        />
        <path
          d="M-140 250C120 210 270 220 450 305C620 385 790 390 1020 255C1080 220 1160 170 1320 160"
          fill="none"
          stroke="var(--color-text)"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
