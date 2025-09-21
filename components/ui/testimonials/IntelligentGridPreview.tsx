/**
 * Intelligent Grid Preview Component - Phase 4: Algorithm Testing
 *
 * Comprehensive testing and demonstration component for the intelligent
 * placement algorithm with real testimonial data and interactive controls.
 */

'use client';

import React, { useState, useMemo } from 'react';
import TestimonialsGrid from './TestimonialsGrid';
import {
  calculateTestimonialWeight,
  calculatePlacementScore,
  sortTestimonialsByPriority,
  calculateWeightStatistics,
} from './utils/calculateWeight';
import type {
  Testimonial,
  PlacementAlgorithm,
  LayoutCalculation,
} from './types';
import {
  DEFAULT_PLACEMENT_ALGORITHM,
  DEFAULT_RESPONSIVE_CONFIG,
  DEFAULT_ANIMATION_CONFIG,
  DEFAULT_ACCESSIBILITY_CONFIG,
} from './index';

// Enhanced sample testimonials for algorithm testing
const sampleTestimonials: Testimonial[] = [
  {
    id: "ceo-techcorp",
    name: "Sarah Chen",
    company: "TechCorp Industries",
    rating: 5,
    text: "This platform increased our team productivity by 40% within the first quarter. The intuitive interface and powerful automation features have completely transformed our workflow processes.",
    avatar: "/testimonials/testimonial1.jpg",
    cardType: "tall",
    priority: 10
  },
  {
    id: "founder-startup",
    name: "Michael Rodriguez",
    company: "Startup Accelerator",
    rating: 5,
    text: "Game-changing solution for scaling businesses. Excellent ROI with 3x efficiency improvements.",
    avatar: "/testimonials/testimonial2.jpg",
    cardType: "wide",
    priority: 9
  },
  {
    id: "dev-agency",
    name: "Emily Johnson",
    company: "Digital Agency Plus",
    rating: 4.5,
    text: "Reliable and user-friendly. Great customer support team.",
    avatar: "/testimonials/testimonial3.svg",
    cardType: "compact",
    priority: 7
  },
  {
    id: "manager-fortune500",
    name: "David Park",
    company: "Fortune 500 Corporation",
    rating: 5,
    text: "Outstanding enterprise solution that reduced our operational costs by 25% while improving service quality. The implementation team was professional and the training was comprehensive.",
    avatar: "/testimonials/testimonial1.jpg",
    cardType: "tall",
    priority: 8
  },
  {
    id: "consultant-freelance",
    name: "Lisa Zhang",
    company: "Independent Consultant",
    rating: 4,
    text: "Perfect for small teams and freelancers. The pricing is fair and the features are exactly what we needed for project management.",
    avatar: "/testimonials/testimonial2.jpg",
    cardType: "wide",
    priority: 6
  },
  {
    id: "student-university",
    name: "Alex Kim",
    company: "University Research Lab",
    rating: 4.5,
    text: "Great educational discount and excellent for research collaboration.",
    avatar: "/testimonials/testimonial3.svg",
    cardType: "compact",
    priority: 5
  },
  {
    id: "cto-biotech",
    name: "Dr. Maria Silva",
    company: "BioTech Innovations",
    rating: 5,
    text: "Exceptional data security and compliance features. The API integration capabilities allowed us to seamlessly connect with our existing laboratory management systems. Highly recommended for regulated industries.",
    avatar: "/testimonials/testimonial1.jpg",
    cardType: "tall",
    priority: 9
  },
  {
    id: "designer-creative",
    name: "James Wilson",
    company: "Creative Studios",
    rating: 4,
    text: "Beautiful interface design with powerful collaboration tools for creative teams.",
    avatar: "/testimonials/testimonial2.jpg",
    cardType: "wide",
    priority: 6
  }
];

const IntelligentGridPreview: React.FC = () => {
  const [selectedTestimonials, setSelectedTestimonials] = useState<Testimonial[]>(sampleTestimonials.slice(0, 6));
  const [placementConfig, setPlacementConfig] = useState<PlacementAlgorithm>(DEFAULT_PLACEMENT_ALGORITHM);
  const [showDebug, setShowDebug] = useState(false);
  const [showWeights, setShowWeights] = useState(false);
  const [maxTestimonials, setMaxTestimonials] = useState<number>(6);
  const [layoutCalculation, setLayoutCalculation] = useState<LayoutCalculation | null>(null);

  // Calculate weight statistics
  const weightStats = useMemo(() => {
    return calculateWeightStatistics(selectedTestimonials);
  }, [selectedTestimonials]);

  // Sort testimonials by placement priority
  const sortedTestimonials = useMemo(() => {
    return sortTestimonialsByPriority(selectedTestimonials);
  }, [selectedTestimonials]);

  // Handle testimonial selection
  const handleTestimonialToggle = (testimonial: Testimonial) => {
    setSelectedTestimonials(prev => {
      const exists = prev.find(t => t.id === testimonial.id);
      if (exists) {
        return prev.filter(t => t.id !== testimonial.id);
      } else {
        return [...prev, testimonial];
      }
    });
  };

  // Handle algorithm configuration changes
  const handleConfigChange = (key: keyof PlacementAlgorithm, value: boolean) => {
    setPlacementConfig(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="p-8 bg-[var(--testimonials-bg)] min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-[var(--testimonials-text-primary)]">
        Phase 4: Intelligent Placement Algorithm
      </h1>

      {/* Controls Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Testimonial Selection */}
        <div className="bg-white rounded-lg border border-[var(--testimonials-border)] p-6">
          <h3 className="text-lg font-semibold mb-4 text-[var(--testimonials-text-primary)]">
            Testimonial Selection ({selectedTestimonials.length}/{sampleTestimonials.length})
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {sampleTestimonials.map(testimonial => (
              <label key={testimonial.id} className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedTestimonials.some(t => t.id === testimonial.id)}
                  onChange={() => handleTestimonialToggle(testimonial)}
                  className="rounded"
                />
                <span className="text-[var(--testimonials-text-primary)]">
                  {testimonial.name} ({testimonial.cardType}, P{testimonial.priority})
                </span>
              </label>
            ))}
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-[var(--testimonials-text-primary)] mb-2">
              Max Testimonials: {maxTestimonials}
            </label>
            <input
              type="range"
              min="1"
              max="8"
              value={maxTestimonials}
              onChange={(e) => setMaxTestimonials(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Algorithm Configuration */}
        <div className="bg-white rounded-lg border border-[var(--testimonials-border)] p-6">
          <h3 className="text-lg font-semibold mb-4 text-[var(--testimonials-text-primary)]">
            Placement Algorithm
          </h3>
          <div className="space-y-3">
            {Object.entries(placementConfig).map(([key, value]) => (
              <label key={key} className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleConfigChange(key as keyof PlacementAlgorithm, e.target.checked)}
                  className="rounded"
                />
                <span className="text-[var(--testimonials-text-primary)] capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Weight Statistics */}
        <div className="bg-white rounded-lg border border-[var(--testimonials-border)] p-6">
          <h3 className="text-lg font-semibold mb-4 text-[var(--testimonials-text-primary)]">
            Weight Statistics
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--testimonials-text-secondary)]">Count:</span>
              <span className="text-[var(--testimonials-text-primary)]">{weightStats.count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--testimonials-text-secondary)]">Avg Weight:</span>
              <span className="text-[var(--testimonials-text-primary)]">{weightStats.averageWeight}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--testimonials-text-secondary)]">Priority Range:</span>
              <span className="text-[var(--testimonials-text-primary)]">
                {weightStats.priorityRange.min}-{weightStats.priorityRange.max}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--testimonials-text-secondary)]">Readability:</span>
              <span className="text-[var(--testimonials-text-primary)]">{weightStats.readabilityAverage}</span>
            </div>
            <div className="mt-3">
              <span className="text-[var(--testimonials-text-secondary)] text-xs">Distribution:</span>
              <div className="grid grid-cols-3 gap-1 mt-1">
                <div className="text-center">
                  <div className="text-xs font-medium text-[var(--testimonials-text-primary)]">
                    {weightStats.weightDistribution.tall}
                  </div>
                  <div className="text-xs text-[var(--testimonials-text-secondary)]">Tall</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium text-[var(--testimonials-text-primary)]">
                    {weightStats.weightDistribution.wide}
                  </div>
                  <div className="text-xs text-[var(--testimonials-text-secondary)]">Wide</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium text-[var(--testimonials-text-primary)]">
                    {weightStats.weightDistribution.compact}
                  </div>
                  <div className="text-xs text-[var(--testimonials-text-secondary)]">Compact</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Debug and Weight Controls */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setShowDebug(!showDebug)}
          className={`px-4 py-2 rounded-lg border font-medium text-sm transition-colors ${
            showDebug
              ? 'bg-blue-100 border-blue-300 text-blue-700'
              : 'bg-white border-[var(--testimonials-border)] text-[var(--testimonials-text-primary)]'
          }`}
        >
          {showDebug ? 'Hide' : 'Show'} Debug Info
        </button>
        <button
          onClick={() => setShowWeights(!showWeights)}
          className={`px-4 py-2 rounded-lg border font-medium text-sm transition-colors ${
            showWeights
              ? 'bg-green-100 border-green-300 text-green-700'
              : 'bg-white border-[var(--testimonials-border)] text-[var(--testimonials-text-primary)]'
          }`}
        >
          {showWeights ? 'Hide' : 'Show'} Weight Details
        </button>
      </div>

      {/* Weight Details Table */}
      {showWeights && (
        <div className="mb-8 bg-white rounded-lg border border-[var(--testimonials-border)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--testimonials-border)]">
            <h3 className="text-lg font-semibold text-[var(--testimonials-text-primary)]">
              Individual Weight Calculations
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-[var(--testimonials-text-secondary)]">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--testimonials-text-secondary)]">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--testimonials-text-secondary)]">Priority</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--testimonials-text-secondary)]">Visual Weight</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--testimonials-text-secondary)]">Readability</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--testimonials-text-secondary)]">Placement Score</th>
                </tr>
              </thead>
              <tbody>
                {sortedTestimonials.map((testimonial, index) => {
                  const weight = calculateTestimonialWeight(testimonial);
                  const placementScore = calculatePlacementScore(testimonial);
                  return (
                    <tr key={testimonial.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-[var(--testimonials-text-primary)]">{testimonial.name}</td>
                      <td className="px-4 py-3 text-[var(--testimonials-text-secondary)]">{testimonial.cardType}</td>
                      <td className="px-4 py-3 text-[var(--testimonials-text-primary)]">{weight.priority.toFixed(2)}</td>
                      <td className="px-4 py-3 text-[var(--testimonials-text-primary)]">{weight.visualWeight}</td>
                      <td className="px-4 py-3 text-[var(--testimonials-text-primary)]">{weight.readabilityScore.toFixed(2)}</td>
                      <td className="px-4 py-3 font-medium text-[var(--testimonials-text-primary)]">{placementScore.toFixed(3)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Layout Metrics */}
      {layoutCalculation && (
        <div className="mb-8 bg-white rounded-lg border border-[var(--testimonials-border)] p-6">
          <h3 className="text-lg font-semibold mb-4 text-[var(--testimonials-text-primary)]">
            Layout Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--testimonials-accent)]">
                {(layoutCalculation.metrics.balanceScore * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-[var(--testimonials-text-secondary)]">Visual Balance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--testimonials-accent)]">
                {(layoutCalculation.metrics.readabilityScore * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-[var(--testimonials-text-secondary)]">Readability</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--testimonials-accent)]">
                {(layoutCalculation.metrics.visualHarmony * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-[var(--testimonials-text-secondary)]">Visual Harmony</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--testimonials-accent)]">
                {(layoutCalculation.metrics.performanceScore * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-[var(--testimonials-text-secondary)]">Performance</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid Display */}
      <div className="bg-white rounded-lg border border-[var(--testimonials-border)] p-6">
        <h3 className="text-lg font-semibold mb-6 text-[var(--testimonials-text-primary)]">
          Intelligent Grid Layout
        </h3>
        <TestimonialsGrid
          testimonials={selectedTestimonials}
          placement={placementConfig}
          responsive={DEFAULT_RESPONSIVE_CONFIG}
          animation={DEFAULT_ANIMATION_CONFIG}
          accessibility={DEFAULT_ACCESSIBILITY_CONFIG}
          maxTestimonials={maxTestimonials}
          debug={showDebug}
          onLayoutCalculated={setLayoutCalculation}
          onError={(error) => console.error('Grid Error:', error)}
        />
      </div>
    </div>
  );
};

export default IntelligentGridPreview;