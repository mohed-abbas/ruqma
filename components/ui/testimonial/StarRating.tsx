import { StarRatingProps } from './types';

export default function StarRating({
  rating,
  maxRating = 5,
  className = ''
}: StarRatingProps) {
  return (
    <div
      className={`flex gap-[2px] ${className}`}
      role="img"
      aria-label={`${rating} out of ${maxRating} stars`}
    >
      {Array.from({ length: maxRating }, (_, index) => (
        <svg
          key={index}
          className="w-[12.48px] h-[12.48px]"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.5L6 8.885L2.91 10.5L3.5 7.07L1 4.635L4.455 4.13L6 1Z"
            fill={index < rating ? "#d4af37" : "#E5E7EB"}
            stroke={index < rating ? "#d4af37" : "#E5E7EB"}
            strokeWidth="0.5"
          />
        </svg>
      ))}
    </div>
  );
}