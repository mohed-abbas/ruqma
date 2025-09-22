/**
 * Intelligent Placement Algorithm - Phase 4: Core Grid Optimization
 *
 * Advanced bento grid placement algorithm that optimizes testimonial arrangement
 * based on visual weight, business priority, reading flow, and aesthetic balance.
 *
 * Features:
 * - Multi-criteria optimization (visual balance, reading flow, priority placement)
 * - Clustering prevention for visual variety
 * - Responsive grid adaptation
 * - Performance-optimized calculations
 */

import type {
  Testimonial,
  GridLayout,
  GridCell,
  PlacementAlgorithm,
  LayoutCalculation,
  TestimonialCardType,
} from '../types';
import { calculateTestimonialWeight, calculatePlacementScore, sortTestimonialsByPriority } from './calculateWeight';
import { VISUAL_WEIGHTS, GRID_CONFIGURATIONS } from '../index';

/**
 * Grid position utilities
 */
interface GridPosition {
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
}

/**
 * Calculate optimal grid position for a card type
 */
function getCardGridSpan(cardType: TestimonialCardType, totalColumns: number): GridPosition {
  switch (cardType) {
    case 'tall':
      return {
        row: 0,
        col: 0,
        rowSpan: 2,
        colSpan: 1,
      };
    case 'wide':
      return {
        row: 0,
        col: 0,
        rowSpan: 1,
        colSpan: Math.min(2, totalColumns),
      };
    case 'compact':
      return {
        row: 0,
        col: 0,
        rowSpan: 1,
        colSpan: 1,
      };
    default:
      return {
        row: 0,
        col: 0,
        rowSpan: 1,
        colSpan: 1,
      };
  }
}

/**
 * Check if a position is available in the grid
 */
function isPositionAvailable(
  grid: boolean[][],
  row: number,
  col: number,
  rowSpan: number,
  colSpan: number
): boolean {
  // Check bounds
  if (row + rowSpan > grid.length || col + colSpan > grid[0].length) {
    return false;
  }

  // Check if all cells in the span are available
  for (let r = row; r < row + rowSpan; r++) {
    for (let c = col; c < col + colSpan; c++) {
      if (grid[r][c]) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Mark position as occupied in the grid
 */
function occupyPosition(
  grid: boolean[][],
  row: number,
  col: number,
  rowSpan: number,
  colSpan: number
): void {
  for (let r = row; r < row + rowSpan; r++) {
    for (let c = col; c < col + colSpan; c++) {
      grid[r][c] = true;
    }
  }
}

/**
 * Calculate reading flow score for a grid position
 * Higher scores for positions that follow natural reading flow (left-to-right, top-to-bottom)
 */
function calculateReadingFlowScore(row: number, col: number, totalRows: number, totalCols: number): number {
  // Normalize position to 0-1 range
  const normalizedRow = row / Math.max(1, totalRows - 1);
  const normalizedCol = col / Math.max(1, totalCols - 1);

  // Reading flow preference (top-left gets highest score)
  const rowScore = 1 - normalizedRow;
  const colScore = 1 - normalizedCol;

  // Weighted combination (slight preference for top placement)
  return rowScore * 0.6 + colScore * 0.4;
}

/**
 * Calculate visual balance score for the entire grid
 */
function calculateVisualBalance(cells: GridCell[], totalRows: number, totalCols: number): number {
  if (cells.length === 0) return 1;

  // Calculate weight distribution across quadrants
  const quadrants = [
    { top: true, left: true, weight: 0 },
    { top: true, left: false, weight: 0 },
    { top: false, left: true, weight: 0 },
    { top: false, left: false, weight: 0 },
  ];

  const midRow = totalRows / 2;
  const midCol = totalCols / 2;

  cells.forEach(cell => {
    const centerRow = (cell.rowStart + cell.rowEnd) / 2;
    const centerCol = (cell.colStart + cell.colEnd) / 2;

    const isTop = centerRow < midRow;
    const isLeft = centerCol < midCol;

    const quadrantIndex = (isTop ? 0 : 2) + (isLeft ? 0 : 1);
    quadrants[quadrantIndex].weight += cell.visualWeight;
  });

  // Calculate balance score (lower deviation = better balance)
  const totalWeight = quadrants.reduce((sum, q) => sum + q.weight, 0);
  const avgWeight = totalWeight / 4;
  const variance = quadrants.reduce((sum, q) => sum + Math.pow(q.weight - avgWeight, 2), 0) / 4;
  const stdDev = Math.sqrt(variance);

  // Convert to 0-1 score (lower standard deviation = higher score)
  return Math.max(0, 1 - stdDev / avgWeight);
}

/**
 * Calculate clustering score (prevents similar card types from clustering)
 */
function calculateClusteringScore(cells: GridCell[]): number {
  if (cells.length <= 1) return 1;

  let clusteringPenalty = 0;
  const totalComparisons = cells.length * (cells.length - 1) / 2;

  for (let i = 0; i < cells.length; i++) {
    for (let j = i + 1; j < cells.length; j++) {
      const cellA = cells[i];
      const cellB = cells[j];

      // Calculate distance between cell centers
      const centerARow = (cellA.rowStart + cellA.rowEnd) / 2;
      const centerACol = (cellA.colStart + cellA.colEnd) / 2;
      const centerBRow = (cellB.rowStart + cellB.rowEnd) / 2;
      const centerBCol = (cellB.colStart + cellB.colEnd) / 2;

      const distance = Math.sqrt(
        Math.pow(centerARow - centerBRow, 2) + Math.pow(centerACol - centerBCol, 2)
      );

      // Penalize same card types that are close together
      if (cellA.cardType === cellB.cardType && distance < 2) {
        clusteringPenalty += (2 - distance) / 2;
      }
    }
  }

  // Convert to 0-1 score
  return Math.max(0, 1 - clusteringPenalty / totalComparisons);
}

/**
 * Find the best available position for a testimonial
 */
function findBestPosition(
  grid: boolean[][],
  testimonial: Testimonial,
  placementConfig: PlacementAlgorithm,
  existingCells: GridCell[]
): { row: number; col: number; score: number } | null {
  const { rowSpan, colSpan } = getCardGridSpan(testimonial.cardType, grid[0].length);
  const placementScore = calculatePlacementScore(testimonial);

  let bestPosition: { row: number; col: number; score: number } | null = null;

  // Try all possible positions
  for (let row = 0; row <= grid.length - rowSpan; row++) {
    for (let col = 0; col <= grid[0].length - colSpan; col++) {
      if (!isPositionAvailable(grid, row, col, rowSpan, colSpan)) {
        continue;
      }

      // Calculate position score based on placement algorithm
      let positionScore = 0;

      if (placementConfig.maintainReadingFlow) {
        positionScore += calculateReadingFlowScore(row, col, grid.length, grid[0].length) * 0.4;
      }

      if (placementConfig.prioritizeHighValue) {
        // High-priority testimonials prefer prominent positions (top-left)
        const prominenceScore = calculateReadingFlowScore(row, col, grid.length, grid[0].length);
        positionScore += prominenceScore * placementScore * 0.3;
      }

      if (placementConfig.preventClustering && existingCells.length > 0) {
        // Test clustering impact
        const testCell: GridCell = {
          id: testimonial.id,
          testimonialId: testimonial.id,
          rowStart: row,
          rowEnd: row + rowSpan,
          colStart: col,
          colEnd: col + colSpan,
          cardType: testimonial.cardType,
          visualWeight: VISUAL_WEIGHTS[testimonial.cardType as keyof typeof VISUAL_WEIGHTS] || 1,
          position: { x: col, y: row },
        };

        const clusteringScore = calculateClusteringScore([...existingCells, testCell]);
        positionScore += clusteringScore * 0.2;
      }

      // Grid balance consideration
      if (placementConfig.balanceRows) {
        // Prefer positions that improve overall balance
        const balanceContribution = 1 - Math.abs(row - grid.length / 2) / (grid.length / 2);
        positionScore += balanceContribution * 0.1;
      }

      if (!bestPosition || positionScore > bestPosition.score) {
        bestPosition = { row, col, score: positionScore };
      }
    }
  }

  return bestPosition;
}

/**
 * Main intelligent placement algorithm
 */
export function calculateIntelligentPlacement(
  testimonials: Testimonial[],
  algorithm: PlacementAlgorithm = {
    balanceRows: true,
    preventClustering: true,
    maintainReadingFlow: true,
    prioritizeHighValue: true,
  },
  targetColumns: number = 4,
  maxRows: number = 10
): LayoutCalculation {
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // Validate input
  if (testimonials.length === 0) {
    return {
      success: false,
      layout: { rows: 0, columns: 0, cells: [], totalVisualWeight: 0, balanceScore: 0 },
      metrics: { balanceScore: 0, readabilityScore: 0, visualHarmony: 0, performanceScore: 0 },
      warnings: ['No testimonials provided'],
      recommendations: ['Add testimonials to display'],
    };
  }

  // Sort testimonials by placement priority
  const sortedTestimonials = sortTestimonialsByPriority(testimonials);

  // Enhanced grid sizing for mobile/narrow layouts
  const isMobileLayout = targetColumns <= 1;
  const baseRows = isMobileLayout ? Math.ceil(testimonials.length * 1.5) : Math.ceil(testimonials.length * 2);
  const maxPossibleRows = Math.min(maxRows, Math.max(baseRows, testimonials.length + 2));
  
  const grid: boolean[][] = Array(maxPossibleRows)
    .fill(null)
    .map(() => Array(targetColumns).fill(false));

  const cells: GridCell[] = [];
  const unplacedTestimonials: Testimonial[] = [];
  const placementAttempts: { testimonial: Testimonial; attempts: number }[] = [];

  // Place testimonials using intelligent algorithm with fallback strategies
  for (const testimonial of sortedTestimonials) {
    let position = findBestPosition(grid, testimonial, algorithm, cells);
    let attempts = 1;

    // Fallback Strategy 1: Try with simplified algorithm if mobile layout
    if (!position && isMobileLayout) {
      const simplifiedAlgorithm = {
        balanceRows: false,
        preventClustering: false,
        maintainReadingFlow: true,
        prioritizeHighValue: false,
      };
      position = findBestPosition(grid, testimonial, simplifiedAlgorithm, cells);
      attempts++;
    }

    // Fallback Strategy 2: Force placement by expanding grid if needed
    if (!position && cells.length < testimonials.length) {
      const expandedGrid: boolean[][] = Array(maxPossibleRows + 5)
        .fill(null)
        .map(() => Array(targetColumns).fill(false));
      
      // Copy existing occupancy
      cells.forEach(cell => {
        occupyPosition(expandedGrid, cell.rowStart, cell.colStart, 
          cell.rowEnd - cell.rowStart, cell.colEnd - cell.colStart);
      });

      position = findBestPosition(expandedGrid, testimonial, algorithm, cells);
      if (position) {
        // Update the main grid reference
        grid.length = expandedGrid.length;
        for (let i = 0; i < expandedGrid.length; i++) {
          grid[i] = expandedGrid[i];
        }
      }
      attempts++;
    }

    // Fallback Strategy 3: Simple sequential placement for mobile
    if (!position && isMobileLayout) {
      const nextRow = cells.length > 0 ? Math.max(...cells.map(c => c.rowEnd)) : 0;
      if (nextRow < grid.length) {
        position = { row: nextRow, col: 0, score: 0.5 };
      }
      attempts++;
    }

    placementAttempts.push({ testimonial, attempts });

    if (position) {
      const { rowSpan, colSpan } = getCardGridSpan(testimonial.cardType, targetColumns);

      // Create grid cell
      const cell: GridCell = {
        id: `cell-${testimonial.id}`,
        testimonialId: testimonial.id,
        rowStart: position.row,
        rowEnd: position.row + rowSpan,
        colStart: position.col,
        colEnd: position.col + colSpan,
        cardType: testimonial.cardType,
        visualWeight: VISUAL_WEIGHTS[testimonial.cardType as keyof typeof VISUAL_WEIGHTS] || 1,
        position: { x: position.col, y: position.row },
      };

      cells.push(cell);
      occupyPosition(grid, position.row, position.col, rowSpan, colSpan);

      // Add debug info for mobile troubleshooting
      if (isMobileLayout && attempts > 1) {
        warnings.push(`${testimonial.id} placed after ${attempts} attempts`);
      }
    } else {
      unplacedTestimonials.push(testimonial);
      warnings.push(`Could not place testimonial: ${testimonial.id}`);
    }
  }

  // Calculate final grid dimensions
  const actualRows = Math.max(1, ...cells.map(cell => cell.rowEnd));
  const totalVisualWeight = cells.reduce((sum, cell) => sum + cell.visualWeight, 0);

  // Calculate metrics
  const balanceScore = calculateVisualBalance(cells, actualRows, targetColumns);
  const clusteringScore = calculateClusteringScore(cells);
  const averageReadabilityScore = testimonials.reduce((sum, t) => {
    const weight = calculateTestimonialWeight(t);
    return sum + weight.readabilityScore;
  }, 0) / testimonials.length;

  // Performance score (based on grid efficiency)
  const gridEfficiency = cells.length / (actualRows * targetColumns);
  const performanceScore = Math.min(1, gridEfficiency * 1.2); // Boost for good space utilization

  // Visual harmony (combination of balance and clustering)
  const visualHarmony = (balanceScore * 0.6 + clusteringScore * 0.4);

  // Generate recommendations
  if (unplacedTestimonials.length > 0) {
    recommendations.push(`Consider increasing grid size or reducing testimonial count (${unplacedTestimonials.length} unplaced)`);
  }

  if (balanceScore < 0.7) {
    recommendations.push('Consider adjusting testimonial priorities to improve visual balance');
  }

  if (clusteringScore < 0.8) {
    recommendations.push('Consider varying card types to reduce clustering');
  }

  // Create final layout
  const layout: GridLayout = {
    rows: actualRows,
    columns: targetColumns,
    cells,
    totalVisualWeight,
    balanceScore,
  };

  return {
    success: unplacedTestimonials.length === 0,
    layout,
    metrics: {
      balanceScore: Math.round(balanceScore * 100) / 100,
      readabilityScore: Math.round(averageReadabilityScore * 100) / 100,
      visualHarmony: Math.round(visualHarmony * 100) / 100,
      performanceScore: Math.round(performanceScore * 100) / 100,
    },
    warnings,
    recommendations,
  };
}

/**
 * Optimize placement for different screen sizes
 */
export function calculateResponsivePlacement(
  testimonials: Testimonial[],
  algorithm: PlacementAlgorithm = {
    balanceRows: true,
    preventClustering: true,
    maintainReadingFlow: true,
    prioritizeHighValue: true,
  }
) {
  // Mobile-optimized algorithm for single column layout
  const mobileAlgorithm: PlacementAlgorithm = {
    balanceRows: false,        // Not applicable for single column
    preventClustering: false,  // Less important on mobile
    maintainReadingFlow: true, // Still important for UX
    prioritizeHighValue: true, // Keep high-value testimonials prominent
  };

  // Calculate dynamic row limits based on testimonial count
  const mobileRows = Math.max(10, testimonials.length + 3);
  const tabletRows = Math.max(8, Math.ceil(testimonials.length / 2) + 2);
  const desktopRows = Math.max(6, Math.ceil(testimonials.length / 4) + 1);

  const layouts = {
    mobile: calculateIntelligentPlacement(testimonials, mobileAlgorithm, GRID_CONFIGURATIONS.mobile.columns, mobileRows),
    tablet: calculateIntelligentPlacement(testimonials, algorithm, GRID_CONFIGURATIONS.tablet.columns, tabletRows),
    desktop: calculateIntelligentPlacement(testimonials, algorithm, GRID_CONFIGURATIONS.desktop.columns, desktopRows),
  };

  // Add enhanced error handling and recovery
  if (!layouts.mobile.success && testimonials.length > 0) {
    console.warn('Mobile layout failed, attempting recovery...');
    // Force simple sequential layout for mobile as ultimate fallback
    const fallbackCells: GridCell[] = testimonials.map((testimonial, index) => ({
      id: `cell-${testimonial.id}`,
      testimonialId: testimonial.id,
      rowStart: index,
      rowEnd: index + 1,
      colStart: 0,
      colEnd: 1,
      cardType: testimonial.cardType,
      visualWeight: VISUAL_WEIGHTS[testimonial.cardType as keyof typeof VISUAL_WEIGHTS] || 1,
      position: { x: 0, y: index },
    }));

    layouts.mobile = {
      success: true,
      layout: {
        rows: testimonials.length,
        columns: 1,
        cells: fallbackCells,
        totalVisualWeight: fallbackCells.reduce((sum, cell) => sum + cell.visualWeight, 0),
        balanceScore: 1, // Perfect balance for single column
      },
      metrics: {
        balanceScore: 1,
        readabilityScore: 0.9,
        visualHarmony: 0.8,
        performanceScore: 1,
      },
      warnings: ['Using fallback sequential layout for mobile'],
      recommendations: ['Consider reducing testimonial count for better mobile experience'],
    };
  }

  return layouts;
}

/**
 * Validate and optimize placement algorithm settings
 */
export function optimizePlacementSettings(testimonials: Testimonial[]): PlacementAlgorithm {
  const stats = {
    totalCount: testimonials.length,
    cardTypeDistribution: testimonials.reduce((acc, t) => {
      acc[t.cardType] = (acc[t.cardType] || 0) + 1;
      return acc;
    }, {} as Record<TestimonialCardType, number>),
  };

  const optimizedSettings: PlacementAlgorithm = {
    balanceRows: true,
    preventClustering: true,
    maintainReadingFlow: true,
    prioritizeHighValue: true,
  };

  // Adjust settings based on testimonial characteristics
  if (stats.totalCount <= 4) {
    // Small grids benefit from simpler placement
    optimizedSettings.preventClustering = false;
  }

  // If there's only one card type, clustering prevention is unnecessary
  const uniqueCardTypes = Object.keys(stats.cardTypeDistribution).length;
  if (uniqueCardTypes === 1) {
    optimizedSettings.preventClustering = false;
  }

  return optimizedSettings;
}