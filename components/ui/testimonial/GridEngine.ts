/**
 * GridEngine - Intelligent Layout Calculator for Dynamic Testimonial Grid
 *
 * This engine automatically selects optimal grid strategies based on testimonial count
 * and generates CSS custom properties for responsive layouts without hardcoded positioning.
 */

import { Testimonial } from './types';

export interface GridAreaDefinition {
  name: string;
  gridArea: string;
  cardType: 'tall' | 'wide' | 'compact';
}

export interface GridStrategy {
  type: 'grid-areas' | 'advanced-grid' | 'masonry';
  columns: string;
  rows?: string;
  gap: string;
  areas?: GridAreaDefinition[];
  containerClass: string;
}

class GridEngine {
  private static readonly STRATEGIES = {
    GRID_AREAS_MAX: 10,
    ADVANCED_GRID_MAX: 12,
  };

  /**
   * Calculates optimal grid strategy based on testimonial count
   */
  static calculateStrategy(testimonialCount: number): GridStrategy {
    if (testimonialCount <= this.STRATEGIES.GRID_AREAS_MAX) {
      return this.getGridAreasStrategy(testimonialCount);
    } else if (testimonialCount <= this.STRATEGIES.ADVANCED_GRID_MAX) {
      return this.getAdvancedGridStrategy(testimonialCount);
    } else {
      return this.getMasonryStrategy();
    }
  }

  /**
   * Grid Areas Strategy (1-6 testimonials)
   * Uses named CSS Grid areas for precise control
   */
  private static getGridAreasStrategy(count: number): GridStrategy {
    const patterns: Record<number, GridAreaDefinition[]> = {
      1: [
        { name: 'single', gridArea: '1 / 1 / 2 / 4', cardType: 'wide' }
      ],
      2: [
        { name: 'tall1', gridArea: '1 / 1 / 3 / 2', cardType: 'tall' },
        { name: 'wide1', gridArea: '1 / 2 / 2 / 4', cardType: 'wide' }
      ],
      3: [
        { name: 'tall1', gridArea: '1 / 1 / 3 / 2', cardType: 'tall' },
        { name: 'wide1', gridArea: '1 / 2 / 2 / 4', cardType: 'wide' },
        { name: 'compact1', gridArea: '2 / 2 / 3 / 3', cardType: 'compact' }
      ],
      4: [
        { name: 'tall1', gridArea: '1 / 1 / 3 / 2', cardType: 'tall' },
        { name: 'wide1', gridArea: '1 / 2 / 2 / 4', cardType: 'wide' },
        { name: 'compact1', gridArea: '2 / 2 / 3 / 3', cardType: 'compact' },
        { name: 'compact2', gridArea: '2 / 3 / 3 / 4', cardType: 'compact' }
      ],
      5: [
        { name: 'tall1', gridArea: '1 / 1 / 3 / 2', cardType: 'tall' },
        { name: 'wide1', gridArea: '1 / 2 / 2 / 4', cardType: 'wide' },
        { name: 'compact1', gridArea: '2 / 2 / 3 / 3', cardType: 'compact' },
        { name: 'compact2', gridArea: '2 / 3 / 3 / 4', cardType: 'compact' },
        { name: 'wide2', gridArea: '3 / 1 / 4 / 3', cardType: 'wide' }
      ],
      6: [
        { name: 'tall1', gridArea: '1 / 1 / 3 / 2', cardType: 'tall' },
        { name: 'wide1', gridArea: '1 / 2 / 2 / 4', cardType: 'wide' },
        { name: 'compact1', gridArea: '2 / 2 / 3 / 3', cardType: 'compact' },
        { name: 'compact2', gridArea: '2 / 3 / 3 / 4', cardType: 'compact' },
        { name: 'wide2', gridArea: '3 / 1 / 4 / 3', cardType: 'wide' },
        { name: 'compact3', gridArea: '3 / 3 / 4 / 4', cardType: 'compact' }
      ]
    };

    return {
      type: 'grid-areas',
      columns: 'repeat(3, 1fr)',
      rows: 'repeat(4, minmax(200px, auto))',
      gap: '1.25rem',
      areas: patterns[count] || patterns[6],
      containerClass: 'testimonial-grid-areas'
    };
  }

  /**
   * Advanced Grid Strategy (7-12 testimonials)
   * Uses responsive auto-fit columns with intelligent spanning
   */
  private static getAdvancedGridStrategy(count: number): GridStrategy {
    const columns = count <= 8 ? 'repeat(auto-fit, minmax(280px, 1fr))' : 'repeat(4, 1fr)';

    return {
      type: 'advanced-grid',
      columns,
      gap: '1.5rem',
      containerClass: 'testimonial-advanced-grid'
    };
  }

  /**
   * Masonry Strategy (13+ testimonials)
   * Uses CSS masonry layout with flexbox fallback
   */
  private static getMasonryStrategy(): GridStrategy {
    return {
      type: 'masonry',
      columns: 'masonry',
      gap: '1.5rem',
      containerClass: 'testimonial-masonry-grid'
    };
  }

  /**
   * Assigns card types intelligently based on content and position
   */
  static assignCardTypes(testimonials: Testimonial[], strategy: GridStrategy): Testimonial[] {
    if (strategy.type === 'grid-areas' && strategy.areas) {
      // For grid areas, use predefined patterns
      return testimonials.map((testimonial, index) => {
        const area = strategy.areas![index];
        return {
          ...testimonial,
          cardType: area?.cardType || 'compact'
        };
      });
    }

    // For other strategies, use content-based assignment
    return testimonials.map((testimonial, index) => {
      const textLength = testimonial.text.length;
      const position = index % 6; // Cycle every 6 items

      let cardType: 'tall' | 'wide' | 'compact' = 'compact';

      if (position === 0 && textLength > 120) {
        cardType = 'tall';
      } else if ((position === 1 || position === 4) && textLength > 80) {
        cardType = 'wide';
      } else if (textLength > 150) {
        cardType = 'tall';
      } else if (textLength > 100) {
        cardType = 'wide';
      }

      return {
        ...testimonial,
        cardType
      };
    });
  }

  /**
   * Generates CSS custom properties for the grid strategy
   */
  static generateCSSProperties(strategy: GridStrategy): Record<string, string> {
    const baseProperties = {
      '--grid-columns': strategy.columns,
      '--grid-gap': strategy.gap,
      '--grid-rows': strategy.rows || 'auto'
    };

    if (strategy.areas) {
      // Generate grid-template-areas property
      const areaRows = this.generateGridTemplateAreas(strategy.areas);
      return {
        ...baseProperties,
        '--grid-template-areas': areaRows.map(row => `"${row}"`).join(' ')
      };
    }

    return baseProperties;
  }

  /**
   * Generates grid-template-areas string from area definitions
   */
  private static generateGridTemplateAreas(areas: GridAreaDefinition[]): string[] {
    const grid: string[][] = Array(4).fill(null).map(() => Array(3).fill('.'));

    areas.forEach(area => {
      const [rowStart, colStart, rowEnd, colEnd] = area.gridArea
        .split(' / ')
        .map(val => parseInt(val) - 1);

      for (let row = rowStart; row < rowEnd; row++) {
        for (let col = colStart; col < colEnd; col++) {
          if (grid[row] && grid[row][col] !== undefined) {
            grid[row][col] = area.name;
          }
        }
      }
    });

    return grid.map(row => row.join(' '));
  }

  /**
   * Generates staggered animation delays for testimonials
   */
  static generateAnimationDelays(count: number): string[] {
    return Array(count).fill(0).map((_, index) => `${index * 100}ms`);
  }
}

export default GridEngine;
export { GridEngine };