/**
 * Comprehensive Integration Tests - Phase 5: Quality Assurance
 *
 * End-to-end testing of the testimonials bento grid system
 * with static JSON data, animations, and responsive behavior.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestimonialsGrid from '../TestimonialsGrid';
import TestimonialsDemo from '../TestimonialsDemo';
import { staticTestimonialsService } from '../services/staticTestimonialsService';
import type { Testimonial } from '../types';

// Mock data for tests
const mockTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'John Doe',
    company: 'Test Corp',
    role: 'CEO',
    text: 'This is a test testimonial for the tall card type with longer text content.',
    rating: 5,
    avatar: '/testimonials/test1.jpg',
    cardType: 'tall',
    priority: 10,
    featured: true,
    tags: ['test'],
    metadata: {
      source: 'test',
      version: '1.0',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  },
  {
    id: 'test-2',
    name: 'Jane Smith',
    company: 'Another Corp',
    role: 'Manager',
    text: 'This is a test testimonial for wide cards.',
    rating: 4.5,
    avatar: '/testimonials/test2.jpg',
    cardType: 'wide',
    priority: 8,
    featured: false,
    tags: ['test'],
    metadata: {
      source: 'test',
      version: '1.0',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  },
  {
    id: 'test-3',
    name: 'Bob Johnson',
    company: 'Small Business',
    role: 'Owner',
    text: 'Short review.',
    rating: 4,
    avatar: '/testimonials/test3.jpg',
    cardType: 'compact',
    priority: 6,
    featured: false,
    tags: ['test'],
    metadata: {
      source: 'test',
      version: '1.0',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  },
];

// Mock fetch for testimonials.json
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      testimonials: mockTestimonials,
      metadata: {
        version: '1.0',
        totalTestimonials: mockTestimonials.length,
      },
    }),
  } as Response)
);

describe('Testimonials Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    staticTestimonialsService.clearCache();
  });

  describe('TestimonialsGrid Component', () => {
    it('renders with mock testimonials data', async () => {
      render(
        <TestimonialsGrid
          testimonials={mockTestimonials}
          debug={false}
          animationPreset="disabled"
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('region')).toBeInTheDocument();
        expect(screen.getByLabelText(/testimonials grid with/i)).toBeInTheDocument();
      });
    });

    it('handles empty testimonials array', () => {
      render(
        <TestimonialsGrid
          testimonials={[]}
          animationPreset="disabled"
        />
      );

      expect(screen.getByText(/no testimonials to display/i)).toBeInTheDocument();
    });

    it('displays loading state', () => {
      render(
        <TestimonialsGrid
          testimonials={mockTestimonials}
          loading={true}
          animationPreset="disabled"
        />
      );

      expect(document.querySelector('.testimonials-grid-skeleton')).toBeInTheDocument();
    });

    it('handles error state', () => {
      const onError = jest.fn();

      render(
        <TestimonialsGrid
          testimonials={[]}
          onError={onError}
          animationPreset="disabled"
        />
      );

      // Should not call error for empty testimonials
      expect(onError).not.toHaveBeenCalled();
    });

    it('limits testimonials based on maxTestimonials prop', async () => {
      render(
        <TestimonialsGrid
          testimonials={mockTestimonials}
          maxTestimonials={2}
          animationPreset="disabled"
        />
      );

      await waitFor(() => {
        const gridCells = document.querySelectorAll('.testimonial-grid-cell');
        expect(gridCells).toHaveLength(2);
      });
    });

    it('applies accessibility features', async () => {
      render(
        <TestimonialsGrid
          testimonials={mockTestimonials}
          accessibility={{
            announceChanges: true,
            keyboardNavigation: true,
            screenReaderOptimized: true,
            highContrastMode: false,
          }}
          animationPreset="disabled"
        />
      );

      await waitFor(() => {
        const gridContainer = screen.getByRole('region');
        expect(gridContainer).toHaveAttribute('tabIndex', '0');
        expect(gridContainer).toHaveAttribute('aria-label');
      });
    });

    it('supports different animation presets', async () => {
      const presets: Array<'luxury' | 'minimal' | 'playful' | 'disabled'> = [
        'luxury', 'minimal', 'playful', 'disabled'
      ];

      for (const preset of presets) {
        const { unmount } = render(
          <TestimonialsGrid
            testimonials={mockTestimonials.slice(0, 1)}
            animationPreset={preset}
          />
        );

        await waitFor(() => {
          expect(screen.getByRole('region')).toBeInTheDocument();
        });

        unmount();
      }
    });
  });

  describe('Static Testimonials Service', () => {
    it('loads testimonials from JSON', async () => {
      const result = await staticTestimonialsService.loadTestimonials();

      expect(result.testimonials).toHaveLength(mockTestimonials.length);
      expect(result.metadata.source).toBe('file');
      expect(result.total).toBe(mockTestimonials.length);
    });

    it('filters featured testimonials', async () => {
      const featured = await staticTestimonialsService.getFeaturedTestimonials();

      expect(featured.every(t => t.featured)).toBe(true);
      expect(featured).toHaveLength(1); // Only test-1 is featured
    });

    it('filters testimonials by card type', async () => {
      const tallCards = await staticTestimonialsService.getTestimonialsByType('tall');

      expect(tallCards.every(t => t.cardType === 'tall')).toBe(true);
      expect(tallCards).toHaveLength(1);
    });

    it('gets random testimonials', async () => {
      const random1 = await staticTestimonialsService.getRandomTestimonials(2);
      const random2 = await staticTestimonialsService.getRandomTestimonials(2);

      expect(random1).toHaveLength(2);
      expect(random2).toHaveLength(2);
      // Note: Due to randomization, order might be different
    });

    it('retrieves single testimonial by ID', async () => {
      const testimonial = await staticTestimonialsService.getTestimonialById('test-1');

      expect(testimonial).toBeTruthy();
      expect(testimonial?.id).toBe('test-1');
      expect(testimonial?.name).toBe('John Doe');
    });

    it('handles cache operations', async () => {
      // First load
      const result1 = await staticTestimonialsService.loadTestimonials();
      expect(result1.metadata.source).toBe('file');

      // Second load should use cache
      const result2 = await staticTestimonialsService.loadTestimonials();
      expect(result2.metadata.source).toBe('cache');

      // Clear cache and reload
      staticTestimonialsService.clearCache();
      const result3 = await staticTestimonialsService.loadTestimonials();
      expect(result3.metadata.source).toBe('file');
    });

    it('handles network errors gracefully', async () => {
      // Mock fetch error
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

      const result = await staticTestimonialsService.loadTestimonials();

      expect(result.testimonials).toHaveLength(1); // Fallback testimonial
      expect(result.testimonials[0].id).toBe('fallback-1');
    });
  });

  describe('TestimonialsDemo Component', () => {
    it('renders demo interface with controls', async () => {
      render(<TestimonialsDemo />);

      await waitFor(() => {
        expect(screen.getByText(/testimonials bento grid system/i)).toBeInTheDocument();
        expect(screen.getByText(/demo controls/i)).toBeInTheDocument();
      });
    });

    it('handles filter controls', async () => {
      render(<TestimonialsDemo />);

      await waitFor(() => {
        const featuredCheckbox = screen.getByLabelText(/featured only/i);
        expect(featuredCheckbox).toBeInTheDocument();

        fireEvent.click(featuredCheckbox);
        expect(featuredCheckbox).toBeChecked();
      });
    });

    it('handles card type selection', async () => {
      render(<TestimonialsDemo />);

      await waitFor(() => {
        const cardTypeSelect = screen.getByLabelText(/card type/i);
        expect(cardTypeSelect).toBeInTheDocument();

        fireEvent.change(cardTypeSelect, { target: { value: 'tall' } });
        expect(cardTypeSelect).toHaveValue('tall');
      });
    });

    it('handles max testimonials slider', async () => {
      render(<TestimonialsDemo />);

      await waitFor(() => {
        const maxSlider = screen.getByLabelText(/max count/i);
        expect(maxSlider).toBeInTheDocument();

        fireEvent.change(maxSlider, { target: { value: '6' } });
        expect(maxSlider).toHaveValue('6');
      });
    });

    it('handles shuffle button', async () => {
      render(<TestimonialsDemo />);

      await waitFor(() => {
        const shuffleButton = screen.getByText(/shuffle layout/i);
        expect(shuffleButton).toBeInTheDocument();

        fireEvent.click(shuffleButton);
        expect(screen.getByText(/sort by priority/i)).toBeInTheDocument();
      });
    });

    it('handles reset button', async () => {
      render(<TestimonialsDemo />);

      await waitFor(() => {
        // Change some settings
        const featuredCheckbox = screen.getByLabelText(/featured only/i);
        fireEvent.click(featuredCheckbox);

        // Reset
        const resetButton = screen.getByText(/reset filters/i);
        fireEvent.click(resetButton);

        expect(featuredCheckbox).not.toBeChecked();
      });
    });

    it('displays statistics correctly', async () => {
      render(<TestimonialsDemo />);

      await waitFor(() => {
        expect(screen.getByText(/displayed/i)).toBeInTheDocument();
        expect(screen.getByText(/total available/i)).toBeInTheDocument();
        expect(screen.getByText(/featured/i)).toBeInTheDocument();
        expect(screen.getByText(/avg rating/i)).toBeInTheDocument();
      });
    });
  });

  describe('Animation System', () => {
    it('respects reduced motion preferences', () => {
      // Mock prefers-reduced-motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      render(
        <TestimonialsGrid
          testimonials={mockTestimonials.slice(0, 1)}
          animationPreset="luxury"
        />
      );

      // Should render without errors and respect motion preferences
      expect(screen.getByRole('region')).toBeInTheDocument();
    });

    it('handles animation intersection observer', async () => {
      // Mock IntersectionObserver
      const mockIntersectionObserver = jest.fn();
      mockIntersectionObserver.mockReturnValue({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      });
      window.IntersectionObserver = mockIntersectionObserver;

      render(
        <TestimonialsGrid
          testimonials={mockTestimonials.slice(0, 1)}
          animationPreset="luxury"
        />
      );

      await waitFor(() => {
        expect(mockIntersectionObserver).toHaveBeenCalled();
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('adapts to different screen sizes', async () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(
        <TestimonialsGrid
          testimonials={mockTestimonials}
          animationPreset="disabled"
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('region')).toBeInTheDocument();
      });

      // Change to mobile size
      Object.defineProperty(window, 'innerWidth', {
        value: 375,
      });

      fireEvent(window, new Event('resize'));

      await waitFor(() => {
        expect(screen.getByRole('region')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles malformed testimonial data', async () => {
      const malformedData = [
        { id: 'bad-1' }, // Missing required fields
        { id: 'bad-2', name: 'Test', rating: 'invalid' }, // Invalid rating
      ];

      // This should not crash the component
      render(
        <TestimonialsGrid
          testimonials={malformedData as Testimonial[]}
          animationPreset="disabled"
        />
      );

      expect(screen.getByText(/no testimonials to display/i)).toBeInTheDocument();
    });

    it('handles layout calculation errors', () => {
      const onError = jest.fn();

      render(
        <TestimonialsGrid
          testimonials={mockTestimonials}
          onError={onError}
          animationPreset="disabled"
        />
      );

      // Component should render without throwing errors
      expect(screen.getByRole('region')).toBeInTheDocument();
    });
  });
});

describe('Performance Tests', () => {
  it('handles large number of testimonials', async () => {
    const manyTestimonials = Array.from({ length: 50 }, (_, i) => ({
      ...mockTestimonials[0],
      id: `test-${i}`,
      name: `Test User ${i}`,
    }));

    const start = performance.now();

    render(
      <TestimonialsGrid
        testimonials={manyTestimonials}
        maxTestimonials={20}
        animationPreset="disabled"
      />
    );

    const end = performance.now();
    const renderTime = end - start;

    await waitFor(() => {
      expect(screen.getByRole('region')).toBeInTheDocument();
    });

    // Should render within reasonable time (adjust threshold as needed)
    expect(renderTime).toBeLessThan(1000);
  });

  it('optimizes re-renders', async () => {
    const { rerender } = render(
      <TestimonialsGrid
        testimonials={mockTestimonials}
        animationPreset="disabled"
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('region')).toBeInTheDocument();
    });

    // Re-render with same props should not cause issues
    rerender(
      <TestimonialsGrid
        testimonials={mockTestimonials}
        animationPreset="disabled"
      />
    );

    expect(screen.getByRole('region')).toBeInTheDocument();
  });
});