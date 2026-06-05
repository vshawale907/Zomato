import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, size = 'sm', showCount = false, count = 0 }) => {
  const sizes = { sm: 'h-3.5 w-3.5', md: 'h-4.5 w-4.5', lg: 'h-5 w-5' };
  const iconClass = sizes[size] || sizes.sm;

  const getRatingColor = (r) => {
    if (r >= 4.5) return 'text-green-600';
    if (r >= 4.0) return 'text-green-500';
    if (r >= 3.5) return 'text-yellow-500';
    if (r >= 3.0) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="flex items-center gap-1">
      <span className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 font-semibold text-white text-xs ${getRatingBg(rating)}`}>
        <Star className={`${iconClass} fill-current`} />
        {rating > 0 ? rating.toFixed(1) : '—'}
      </span>
      {showCount && count > 0 && (
        <span className="text-xs text-mutedGray">({count})</span>
      )}
    </div>
  );
};

const getRatingBg = (r) => {
  if (r >= 4.5) return 'bg-green-600';
  if (r >= 4.0) return 'bg-green-500';
  if (r >= 3.5) return 'bg-yellow-500';
  if (r >= 3.0) return 'bg-orange-500';
  if (r > 0) return 'bg-red-500';
  return 'bg-gray-400';
};

export const StarInput = ({ value = 0, onChange, disabled = false }) => {
  const [hovered, setHovered] = React.useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange && onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none disabled:cursor-default"
        >
          <Star
            className={`h-7 w-7 transition-colors ${
              star <= (hovered || value)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
