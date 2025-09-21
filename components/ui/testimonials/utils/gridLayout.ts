/**
 * Grid Layout Calculation Utilities - Phase 4: Advanced Layout Management
 *
 * Comprehensive grid layout utilities for CSS Grid generation, responsive
 * adaptation, and performance optimization of testimonial bento grids.
 */

import type { GridLayout, GridCell, ResponsiveConfig, TestimonialCardType } from '../types';

/**
 * Generate CSS Grid template areas string from grid layout
 */
export function generateGridTemplate(layout: GridLayout): string {
  if (layout.cells.length === 0) {
    return 'none';
  }

  // Create a 2D array to represent the grid
  const gridArray: string[][] = Array(layout.rows)
    .fill(null)
    .map(() => Array(layout.columns).fill('.'));

  // Fill the grid with cell identifiers
  layout.cells.forEach(cell => {
    const cellId = `cell-${cell.testimonialId}`;

    for (let row = cell.rowStart; row < cell.rowEnd; row++) {
      for (let col = cell.colStart; col < cell.colEnd; col++) {
        if (row < layout.rows && col < layout.columns) {
          gridArray[row][col] = cellId;
        }
      }
    }
  });

  // Convert to CSS grid-template-areas format
  return gridArray
    .map(row => `"${row.join(' ')}"`)
    .join('\n    ');
}

/**
 * Generate CSS Grid styles object for the grid container
 */
export function generateGridStyles(
  layout: GridLayout,
  responsive: ResponsiveConfig,
  breakpoint: 'mobile' | 'tablet' | 'desktop' = 'desktop'
): React.CSSProperties {
  const config = responsive[breakpoint];

  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${layout.columns}, 1fr)`,
    gridTemplateAreas: generateGridTemplate(layout),
    gap: config.cardSpacing,
    maxWidth: config.maxWidth,
    margin: '0 auto',
    width: '100%',
  };
}

/**
 * Generate CSS styles for individual grid cells
 */
export function generateCellStyles(cell: GridCell): React.CSSProperties {
  return {
    gridArea: `cell-${cell.testimonialId}`,
    // Ensure proper positioning even if grid-template-areas fails
    gridRowStart: cell.rowStart + 1,
    gridRowEnd: cell.rowEnd + 1,
    gridColumnStart: cell.colStart + 1,
    gridColumnEnd: cell.colEnd + 1,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'stretch',
  };
}

/**
 * Calculate responsive grid dimensions based on viewport
 */
export function calculateResponsiveColumns(
  viewportWidth: number,
  baseConfig: ResponsiveConfig
): { columns: number; breakpoint: 'mobile' | 'tablet' | 'desktop' } {
  if (viewportWidth < 768) {
    return { columns: baseConfig.mobile.columns, breakpoint: 'mobile' };
  } else if (viewportWidth < 1024) {
    return { columns: baseConfig.tablet.columns, breakpoint: 'tablet' };
  } else {
    return { columns: baseConfig.desktop.columns, breakpoint: 'desktop' };
  }
}

/**
 * Optimize grid layout for better visual harmony
 */
export function optimizeGridLayout(layout: GridLayout): GridLayout {
  if (layout.cells.length === 0) {
    return layout;
  }

  // Sort cells by reading order (top-to-bottom, left-to-right)
  const sortedCells = [...layout.cells].sort((a, b) => {
    if (a.rowStart !== b.rowStart) {
      return a.rowStart - b.rowStart;
    }
    return a.colStart - b.colStart;
  });

  // Calculate improved balance score
  const totalVisualWeight = sortedCells.reduce((sum, cell) => sum + cell.visualWeight, 0);
  const averageWeight = totalVisualWeight / layout.rows;

  // Calculate row weight distribution
  const rowWeights = Array(layout.rows).fill(0);
  sortedCells.forEach(cell => {
    for (let row = cell.rowStart; row < cell.rowEnd; row++) {
      rowWeights[row] += cell.visualWeight / (cell.rowEnd - cell.rowStart);
    }
  });

  // Calculate balance score based on weight distribution
  const weightVariance = rowWeights.reduce((sum, weight) => {
    return sum + Math.pow(weight - averageWeight, 2);
  }, 0) / layout.rows;

  const balanceScore = Math.max(0, 1 - Math.sqrt(weightVariance) / averageWeight);

  return {
    ...layout,
    cells: sortedCells,
    balanceScore: Math.round(balanceScore * 100) / 100,
  };
}

/**
 * Validate grid layout for common issues
 */
export function validateGridLayout(layout: GridLayout): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  performance: {
    cellDensity: number;
    averageSpan: number;
    gridEfficiency: number;
  };
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic validation
  if (layout.rows <= 0 || layout.columns <= 0) {
    errors.push('Invalid grid dimensions');
  }

  if (layout.cells.length === 0) {
    warnings.push('No cells in layout');
  }

  // Cell validation
  const occupiedCells = new Set<string>();
  layout.cells.forEach((cell, index) => {
    // Validate cell bounds
    if (cell.rowStart < 0 || cell.rowEnd > layout.rows) {
      errors.push(`Cell ${index} row bounds invalid`);
    }

    if (cell.colStart < 0 || cell.colEnd > layout.columns) {
      errors.push(`Cell ${index} column bounds invalid`);
    }

    if (cell.rowStart >= cell.rowEnd || cell.colStart >= cell.colEnd) {
      errors.push(`Cell ${index} has invalid span`);
    }

    // Check for overlaps
    for (let row = cell.rowStart; row < cell.rowEnd; row++) {
      for (let col = cell.colStart; col < cell.colEnd; col++) {
        const cellKey = `${row}-${col}`;
        if (occupiedCells.has(cellKey)) {
          errors.push(`Cell overlap detected at ${cellKey}`);
        }
        occupiedCells.add(cellKey);
      }
    }
  });

  // Performance calculations
  const totalGridCells = layout.rows * layout.columns;
  const occupiedGridCells = occupiedCells.size;
  const cellDensity = occupiedGridCells / totalGridCells;

  const totalSpan = layout.cells.reduce((sum, cell) => {
    return sum + (cell.rowEnd - cell.rowStart) * (cell.colEnd - cell.colStart);
  }, 0);
  const averageSpan = layout.cells.length > 0 ? totalSpan / layout.cells.length : 0;

  const gridEfficiency = layout.cells.length > 0 ? cellDensity : 0;

  // Performance warnings
  if (cellDensity < 0.4) {
    warnings.push('Low grid density - consider reducing grid size');
  }

  if (cellDensity > 0.9) {
    warnings.push('Very high grid density - may cause layout issues');
  }

  if (averageSpan > 4) {
    warnings.push('Large average cell span - may impact mobile layout');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    performance: {
      cellDensity: Math.round(cellDensity * 100) / 100,
      averageSpan: Math.round(averageSpan * 100) / 100,
      gridEfficiency: Math.round(gridEfficiency * 100) / 100,
    },
  };
}

/**
 * Convert grid layout to CSS custom properties
 */
export function generateCSSCustomProperties(layout: GridLayout): Record<string, string> {
  const properties: Record<string, string> = {
    '--grid-rows': layout.rows.toString(),
    '--grid-columns': layout.columns.toString(),
    '--grid-template-areas': generateGridTemplate(layout),
    '--total-visual-weight': layout.totalVisualWeight.toString(),
    '--balance-score': layout.balanceScore.toString(),
  };

  // Add cell-specific properties
  layout.cells.forEach(cell => {
    const prefix = `--cell-${cell.testimonialId}`;
    properties[`${prefix}-row-start`] = (cell.rowStart + 1).toString();
    properties[`${prefix}-row-end`] = (cell.rowEnd + 1).toString();
    properties[`${prefix}-col-start`] = (cell.colStart + 1).toString();
    properties[`${prefix}-col-end`] = (cell.colEnd + 1).toString();
    properties[`${prefix}-visual-weight`] = cell.visualWeight.toString();
  });

  return properties;
}

/**
 * Create responsive breakpoint styles
 */
export function generateResponsiveStyles(
  layouts: {
    mobile: GridLayout;
    tablet: GridLayout;
    desktop: GridLayout;
  },
  responsive: ResponsiveConfig
): string {
  const mobileStyles = generateGridStyles(layouts.mobile, responsive, 'mobile');
  const tabletStyles = generateGridStyles(layouts.tablet, responsive, 'tablet');
  const desktopStyles = generateGridStyles(layouts.desktop, responsive, 'desktop');

  return `
    /* Mobile styles */
    @media (max-width: 767px) {
      .testimonials-grid {
        display: grid;
        grid-template-columns: repeat(${layouts.mobile.columns}, 1fr);
        grid-template-areas: ${generateGridTemplate(layouts.mobile)};
        gap: ${responsive.mobile.cardSpacing};
        max-width: ${responsive.mobile.maxWidth};
      }
    }

    /* Tablet styles */
    @media (min-width: 768px) and (max-width: 1023px) {
      .testimonials-grid {
        display: grid;
        grid-template-columns: repeat(${layouts.tablet.columns}, 1fr);
        grid-template-areas: ${generateGridTemplate(layouts.tablet)};
        gap: ${responsive.tablet.cardSpacing};
        max-width: ${responsive.tablet.maxWidth};
      }
    }

    /* Desktop styles */
    @media (min-width: 1024px) {
      .testimonials-grid {
        display: grid;
        grid-template-columns: repeat(${layouts.desktop.columns}, 1fr);
        grid-template-areas: ${generateGridTemplate(layouts.desktop)};
        gap: ${responsive.desktop.cardSpacing};
        max-width: ${responsive.desktop.maxWidth};
      }
    }
  `;
}

/**
 * Calculate layout performance metrics
 */
export function calculateLayoutPerformance(layout: GridLayout): {
  renderComplexity: number;
  layoutShiftRisk: number;
  accessibilityScore: number;
  mobileOptimization: number;
} {
  // Render complexity based on grid size and cell spans
  const totalCells = layout.rows * layout.columns;
  const complexSpans = layout.cells.filter(cell =>
    (cell.rowEnd - cell.rowStart) > 1 || (cell.colEnd - cell.colStart) > 1
  ).length;
  const renderComplexity = Math.min(1, (totalCells + complexSpans * 2) / 20);

  // Layout shift risk based on variable cell sizes
  const spanVariance = layout.cells.reduce((sum, cell) => {
    const cellArea = (cell.rowEnd - cell.rowStart) * (cell.colEnd - cell.colStart);
    return sum + Math.pow(cellArea - 1, 2);
  }, 0) / layout.cells.length;
  const layoutShiftRisk = Math.min(1, spanVariance / 4);

  // Accessibility score based on reading order
  let readingOrderScore = 1;
  for (let i = 1; i < layout.cells.length; i++) {
    const current = layout.cells[i];
    const previous = layout.cells[i - 1];

    // Penalize non-sequential reading order
    if (current.rowStart < previous.rowStart ||
        (current.rowStart === previous.rowStart && current.colStart < previous.colStart)) {
      readingOrderScore -= 0.1;
    }
  }
  const accessibilityScore = Math.max(0, readingOrderScore);

  // Mobile optimization based on cell complexity
  const mobileUnfriendlyCells = layout.cells.filter(cell =>
    (cell.colEnd - cell.colStart) > 2 || (cell.rowEnd - cell.rowStart) > 2
  ).length;
  const mobileOptimization = Math.max(0, 1 - mobileUnfriendlyCells / layout.cells.length);

  return {
    renderComplexity: Math.round(renderComplexity * 100) / 100,
    layoutShiftRisk: Math.round(layoutShiftRisk * 100) / 100,
    accessibilityScore: Math.round(accessibilityScore * 100) / 100,
    mobileOptimization: Math.round(mobileOptimization * 100) / 100,
  };
}