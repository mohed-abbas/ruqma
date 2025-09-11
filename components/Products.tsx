import React from 'react'

export default function Products() {
  return (
    <section 
      id="products" 
      className="min-h-screen bg-white flex items-center justify-center py-20"
      style={{ scrollMarginTop: '80px' }}
    >
      <div className="text-center max-w-4xl px-4">
        <h2 
          className="text-6xl font-bold mb-6"
          style={{ 
            fontFamily: 'var(--font-ibm)',
            color: '#d4af37'
          }}
        >
          Products
        </h2>
        <p 
          className="text-2xl text-gray-900"
          style={{ 
            fontFamily: 'var(--font-nunito)',
          }}
        >
          Discover our luxury collection
        </p>
      </div>
    </section>
  )
}
