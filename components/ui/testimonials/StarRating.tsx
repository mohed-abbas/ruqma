interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  className = '',
}: StarRatingProps) {
  const sizeClasses = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div
      className={`flex text-[var(--testimonials-star-color)] ${sizeClasses} ${className}`}
      aria-label={`${rating} out of ${maxRating} stars`}
    >
      {Array.from({ length: maxRating }, (_, i) => (
        <span key={i} aria-hidden="true">
          {i < rating ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
}
