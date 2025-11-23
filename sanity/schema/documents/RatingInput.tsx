'use client'

import { NumberInputProps, set, unset } from 'sanity'

export const RatingInput = (props: NumberInputProps) => {
  const { value = 5, onChange } = props

  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star === value ? unset() : set(star))}
          style={{
            fontSize: '24px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            opacity: star <= value ? 1 : 0.3,
          }}
        >
          ⭐
        </button>
      ))}
    </div>
  )
}
