interface ArrowIconProps {
  className?: string;
}

export default function ArrowIcon({ className = "w-8 h-8" }: ArrowIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M10 30L30 10M30 10H14M30 10V26"
        stroke="#d4af37"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}