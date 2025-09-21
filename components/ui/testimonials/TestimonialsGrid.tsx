/**
 * TestimonialsGrid Component - Phase 4: Intelligent Placement Integration
 *
 * Advanced bento grid component that automatically arranges testimonial cards
 * using intelligent placement algorithms with responsive design and accessibility.
 *
 * Features:
 * - Intelligent card placement with visual weight optimization
 * - Responsive grid adaptation across breakpoints
 * - Smooth animations with stagger effects
 * - WCAG AA accessibility compliance
 * - Performance optimization with layout shift prevention
 * - Real-time layout metrics and debugging
 */

'use client';

import React, { useMemo, useEffect, useState } from 'react';
import TestimonialCard from './TestimonialCard';
import { calculateIntelligentPlacement, calculateResponsivePlacement } from './utils/IntelligentPlacement';
import { generateGridStyles, generateCellStyles, validateGridLayout } from './utils/gridLayout';
import type {
  Testimonial,
  TestimonialsGridConfig,
  PlacementAlgorithm,
  ResponsiveConfig,
  AnimationConfig,
  AccessibilityConfig,
  LayoutCalculation,
} from './types';
import {
  DEFAULT_RESPONSIVE_CONFIG,
  DEFAULT_ANIMATION_CONFIG,
  DEFAULT_ACCESSIBILITY_CONFIG,
  DEFAULT_PLACEMENT_ALGORITHM,
} from './index';

export interface TestimonialsGridProps {
  /** Array of testimonials to display */
  testimonials: Testimonial[];
  /** Placement algorithm configuration */
  placement?: PlacementAlgorithm;
  /** Responsive breakpoint configuration */
  responsive?: ResponsiveConfig;
  /** Animation and transition settings */
  animation?: AnimationConfig;
  /** Accessibility configuration */
  accessibility?: AccessibilityConfig;
  /** Custom className for the grid container */
  className?: string;
  /** Loading state for skeleton display */
  loading?: boolean;
  /** Debug mode for development */
  debug?: boolean;
  /** Maximum number of testimonials to display */
  maxTestimonials?: number;
  /** Error callback for placement failures */
  onError?: (error: string) => void;
  /** Layout calculation callback for debugging */
  onLayoutCalculated?: (calculation: LayoutCalculation) => void;
}

/**
 * Hook for responsive grid calculation
 */
function useResponsiveLayout(
  testimonials: Testimonial[],
  placement: PlacementAlgorithm,
  responsive: ResponsiveConfig
) {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // Calculate responsive layouts
  const layouts = useMemo(() => {
    if (testimonials.length === 0) {
      return {
        mobile: { success: false, layout: { rows: 0, columns: 0, cells: [], totalVisualWeight: 0, balanceScore: 0 }, metrics: { balanceScore: 0, readabilityScore: 0, visualHarmony: 0, performanceScore: 0 }, warnings: [], recommendations: [] },
        tablet: { success: false, layout: { rows: 0, columns: 0, cells: [], totalVisualWeight: 0, balanceScore: 0 }, metrics: { balanceScore: 0, readabilityScore: 0, visualHarmony: 0, performanceScore: 0 }, warnings: [], recommendations: [] },
        desktop: { success: false, layout: { rows: 0, columns: 0, cells: [], totalVisualWeight: 0, balanceScore: 0 }, metrics: { balanceScore: 0, readabilityScore: 0, visualHarmony: 0, performanceScore: 0 }, warnings: [], recommendations: [] },
      };
    }

    return calculateResponsivePlacement(testimonials, placement);
  }, [testimonials, placement]);

  // Detect current breakpoint
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setCurrentBreakpoint('mobile');
      } else if (width < 1024) {
        setCurrentBreakpoint('tablet');
      } else {
        setCurrentBreakpoint('desktop');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return {
    layouts,
    currentLayout: layouts[currentBreakpoint],
    currentBreakpoint,
  };
}

/**
 * Debug information component
 */
const DebugInfo: React.FC<{ calculation: LayoutCalculation; className?: string }> = ({
  calculation,
  className = '',
}) => (
  <div className={`bg-gray-100 border border-gray-300 rounded p-4 text-xs font-mono ${className}`}>
    <h4 className="font-bold mb-2">Layout Debug Info</h4>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h5 className="font-semibold">Layout</h5>
        <p>Rows: {calculation.layout.rows}</p>
        <p>Columns: {calculation.layout.columns}</p>
        <p>Cells: {calculation.layout.cells.length}</p>
        <p>Success: {calculation.success ? 'Yes' : 'No'}</p>
      </div>
      <div>
        <h5 className="font-semibold">Metrics</h5>
        <p>Balance: {calculation.metrics.balanceScore}</p>
        <p>Readability: {calculation.metrics.readabilityScore}</p>
        <p>Visual Harmony: {calculation.metrics.visualHarmony}</p>
        <p>Performance: {calculation.metrics.performanceScore}</p>
      </div>
    </div>
    {calculation.warnings.length > 0 && (
      <div className="mt-2">
        <h5 className="font-semibold text-yellow-600">Warnings</h5>
        <ul className="list-disc list-inside">
          {calculation.warnings.map((warning, index) => (
            <li key={index} className="text-yellow-600">{warning}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

/**
 * Loading skeleton for the grid
 */
const GridSkeleton: React.FC<{ responsive: ResponsiveConfig; className?: string }> = ({
  responsive,
  className = '',
}) => (
  <div
    className={`testimonials-grid-skeleton animate-pulse ${className}`}
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: responsive.desktop.cardSpacing,
      maxWidth: responsive.desktop.maxWidth,
      margin: '0 auto',
    }}
  >
    {Array.from({ length: 6 }, (_, index) => (
      <div
        key={index}
        className="bg-[var(--testimonials-border)] rounded-[var(--testimonials-card-radius)] h-64"
      />
    ))}
  </div>
);

const TestimonialsGrid: React.FC<TestimonialsGridProps> = ({
  testimonials,
  placement = DEFAULT_PLACEMENT_ALGORITHM,
  responsive = DEFAULT_RESPONSIVE_CONFIG,
  animation = DEFAULT_ANIMATION_CONFIG,
  accessibility = DEFAULT_ACCESSIBILITY_CONFIG,
  className = '',
  loading = false,
  debug = false,
  maxTestimonials,
  onError,
  onLayoutCalculated,
}) => {
  // Limit testimonials if maxTestimonials is specified
  const limitedTestimonials = useMemo(() => {
    if (maxTestimonials && maxTestimonials > 0) {
      return testimonials.slice(0, maxTestimonials);
    }
    return testimonials;
  }, [testimonials, maxTestimonials]);

  // Calculate responsive layouts
  const { layouts, currentLayout, currentBreakpoint } = useResponsiveLayout(
    limitedTestimonials,
    placement,
    responsive
  );

  // Validate layout and handle errors
  useEffect(() => {
    if (currentLayout && !currentLayout.success) {
      const errorMessage = `Layout calculation failed: ${currentLayout.warnings.join(', ')}`;
      console.warn('TestimonialsGrid:', errorMessage);
      onError?.(errorMessage);
    }

    if (currentLayout) {
      onLayoutCalculated?.(currentLayout);

      // Validate the layout
      const validation = validateGridLayout(currentLayout.layout);
      if (!validation.isValid) {
        console.error('TestimonialsGrid validation errors:', validation.errors);
        onError?.(validation.errors.join(', '));
      }

      if (validation.warnings.length > 0) {
        console.warn('TestimonialsGrid validation warnings:', validation.warnings);
      }
    }
  }, [currentLayout, onError, onLayoutCalculated]);

  // Generate grid styles
  const gridStyles = useMemo(() => {
    if (!currentLayout || !currentLayout.success) {
      return {};
    }

    return generateGridStyles(currentLayout.layout, responsive, currentBreakpoint);
  }, [currentLayout, responsive, currentBreakpoint]);

  // Handle loading state
  if (loading) {
    return <GridSkeleton responsive={responsive} className={className} />;
  }

  // Handle empty state
  if (limitedTestimonials.length === 0) {
    return (
      <div
        className={`flex items-center justify-center h-64 bg-[var(--testimonials-bg)] rounded-[var(--testimonials-card-radius)] border border-[var(--testimonials-border)] ${className}`}
        role="region"
        aria-label="No testimonials available"
      >
        <p className="text-[var(--testimonials-text-secondary)] text-center">
          No testimonials to display
        </p>
      </div>
    );
  }

  // Handle layout calculation failure
  if (!currentLayout || !currentLayout.success) {
    return (
      <div
        className={`flex items-center justify-center h-64 bg-[var(--testimonials-bg)] rounded-[var(--testimonials-card-radius)] border border-red-300 ${className}`}
        role="alert"
        aria-label="Layout error"
      >
        <div className="text-center">
          <p className="text-red-600 font-medium mb-2">
            Unable to calculate grid layout
          </p>
          <p className="text-[var(--testimonials-text-secondary)] text-sm">
            {currentLayout?.warnings.join(', ') || 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }

  const { layout } = currentLayout;

  return (
    <div className={className}>
      {/* Accessibility announcements */}
      {accessibility.announceChanges && (
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Testimonials grid updated with {layout.cells.length} testimonials arranged in {layout.rows} rows and {layout.columns} columns
        </div>
      )}

      {/* Debug information */}
      {debug && (
        <DebugInfo
          calculation={currentLayout}
          className="mb-6"
        />
      )}

      {/* Main grid container */}
      <div
        className="testimonials-grid"
        style={gridStyles}
        role="region"
        aria-label={`Testimonials grid with ${layout.cells.length} testimonials`}
        tabIndex={accessibility.keyboardNavigation ? 0 : -1}
      >
        {layout.cells.map((cell, index) => {
          const testimonial = limitedTestimonials.find(t => t.id === cell.testimonialId);

          if (!testimonial) {
            console.warn(`Testimonial not found for cell: ${cell.testimonialId}`);
            return null;
          }

          return (
            <div
              key={cell.id}
              style={{
                ...generateCellStyles(cell),
                ...(animation.enabled && {
                  animation: `fadeInUp ${animation.duration}ms ${animation.easing} ${index * animation.stagger}ms both`,
                }),
              }}
              className="testimonial-grid-cell"
            >
              <TestimonialCard
                testimonial={testimonial}
                cardType={cell.cardType}
                showHoverEffects={true}
              />
            </div>
          );
        })}
      </div>

      {/* CSS animations */}
      {animation.enabled && (
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      )}
    </div>
  );
};

export default TestimonialsGrid;