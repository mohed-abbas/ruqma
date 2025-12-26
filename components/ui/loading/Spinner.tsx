'use client';

import { cn } from '@/lib/utils';

interface SpinnerProps {
  /** Size in pixels */
  size?: number;
  /** Stroke width */
  strokeWidth?: number;
  /** Color (defaults to primary gold) */
  color?: string;
  /** Additional classes */
  className?: string;
  /** Accessible label */
  label?: string;
}

/**
 * Premium minimal spinner - single thin rotating ring
 *
 * Features:
 * - Ultra-minimal design matching luxury aesthetic
 * - Single thin ring (not dots or multi-ring spinners)
 * - Smooth rotation animation
 * - Respects reduced-motion preferences
 */
export function Spinner({
  size = 40,
  strokeWidth = 2,
  color = 'var(--color-primary, #d4af37)',
  className,
  label = 'Loading...',
}: SpinnerProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Show 25% of the ring
  const dashOffset = circumference * 0.75;

  return (
    <div
      className={cn('inline-flex items-center justify-center', className)}
      role="status"
      aria-label={label}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        className="animate-spin motion-reduce:animate-none"
        style={{ animationDuration: '1s' }}
      >
        {/* Background ring (very subtle) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="opacity-10"
        />

        {/* Animated ring segment */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="origin-center"
          style={{
            transformOrigin: 'center',
          }}
        />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
}

/**
 * Full-page centered spinner overlay
 */
export function PageSpinner({
  className,
  ...props
}: SpinnerProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50',
        'flex items-center justify-center',
        'bg-black/20 backdrop-blur-[2px]',
        className
      )}
    >
      <div className="bg-white/90 dark:bg-black/90 p-6 rounded-2xl shadow-lg">
        <Spinner size={48} {...props} />
      </div>
    </div>
  );
}

/**
 * Inline loading indicator for buttons and text
 */
export function InlineSpinner({
  size = 16,
  className,
  ...props
}: SpinnerProps) {
  return (
    <Spinner
      size={size}
      strokeWidth={1.5}
      className={cn('inline-block', className)}
      {...props}
    />
  );
}

export default Spinner;
