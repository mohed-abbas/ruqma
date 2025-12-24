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
        d="M11.6667 28.3333L28.3333 11.6667M28.3333 11.6667H11.6667M28.3333 11.6667V28.3333"
        stroke="#d4af37"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}