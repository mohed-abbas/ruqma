/**
 * Utility functions for testimonial card layout and styling
 * Cards now use manual cardType control from CMS data
 */

/**
 * Get card dimensions based on type - Figma-exact dimensions
 */
export const getCardDimensions = (cardType: 'tall' | 'wide' | 'compact') => {
  // Dimensions are handled by absolute positioning in CSS
  // This function maintains compatibility but actual sizing is in CSS
  const dimensions = {
    tall: 'h-full w-full',
    wide: 'h-full w-full',
    compact: 'h-full w-full'
  };

  return dimensions[cardType];
};

/**
 * Get positioning classes for absolute layout
 */
export const getGridClasses = (cardType: 'tall' | 'wide' | 'compact') => {
  // Classes are handled by data-testimonial-id targeting in CSS
  // This function maintains compatibility but actual positioning is in CSS
  const gridClasses = {
    tall: '',
    wide: '',
    compact: ''
  };

  return gridClasses[cardType];
};