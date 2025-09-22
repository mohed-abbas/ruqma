/**
 * Testimonial Weight Calculation Utilities - Phase 4: Intelligent Placement Algorithm
 *
 * Calculates comprehensive weight scores for testimonials to optimize placement
 * in the bento grid layout. Considers business priority, content characteristics,
 * visual impact, and reading flow optimization.
 */

import type { Testimonial, TestimonialWeight, TestimonialCardType } from '../types';
import { VISUAL_WEIGHTS } from '../index';

/**
 * Calculate readability score based on content complexity
 * Higher scores indicate easier-to-read content that flows better
 */
export function calculateReadabilityScore(text: string): number {
  const wordCount = text.split(/\s+/).length;
  const sentences = text.split(/[.!?]+/).filter(Boolean);

  // Calculate average sentence length
  const avgWordsPerSentence = sentences.length > 0 ? wordCount / sentences.length : wordCount;

  // Readability factors (0-1 scale)
  const lengthScore = Math.max(0, 1 - (wordCount - 20) / 80); // Optimal around 20-100 words
  const sentenceScore = Math.max(0, 1 - (avgWordsPerSentence - 10) / 20); // Optimal around 10-30 words per sentence
  const complexityScore = 1 - (text.match(/[,;:()]/g)?.length || 0) / text.length; // Fewer punctuation marks = higher readability

  // Weighted average (prioritize length and sentence structure)
  return Math.round((lengthScore * 0.4 + sentenceScore * 0.4 + complexityScore * 0.2) * 100) / 100;
}

/**
 * Calculate content engagement score based on testimonial characteristics
 * Higher scores indicate more engaging content
 */
export function calculateEngagementScore(testimonial: Testimonial): number {
  const { text, rating, company } = testimonial;

  // Rating boost (5-star reviews get highest engagement)
  const ratingScore = rating / 5;

  // Content richness (presence of specific details, numbers, outcomes)
  const hasNumbers = /\d+/.test(text);
  const hasPercentage = /%/.test(text);
  const hasSpecifics = /\b(increase|improve|reduce|save|boost|enhance)\b/i.test(text);
  const hasOutcomes = /\b(result|outcome|impact|effect|change)\b/i.test(text);

  const contentScore = [hasNumbers, hasPercentage, hasSpecifics, hasOutcomes]
    .filter(Boolean).length / 4;

  // Company credibility (longer company names often indicate established businesses)
  const companyScore = Math.min(1, company.length / 20);

  // Weighted engagement score
  return Math.round((ratingScore * 0.5 + contentScore * 0.3 + companyScore * 0.2) * 100) / 100;
}

/**
 * Calculate comprehensive testimonial weight for intelligent placement
 */
export function calculateTestimonialWeight(testimonial: Testimonial): TestimonialWeight {
  const { priority, text, cardType } = testimonial;

  // Business priority (1-10 scale, normalized to 0-1)
  const normalizedPriority = Math.max(0, Math.min(10, priority)) / 10;

  // Content characteristics
  const contentLength = text.length;
  const readabilityScore = calculateReadabilityScore(text);
  const engagementScore = calculateEngagementScore(testimonial);

  // Visual weight from card type
  const visualWeight = VISUAL_WEIGHTS[cardType as keyof typeof VISUAL_WEIGHTS] || 1;

  // Combined readability score (considers both readability and engagement)
  const combinedReadabilityScore = Math.round((readabilityScore * 0.7 + engagementScore * 0.3) * 100) / 100;

  return {
    priority: normalizedPriority,
    contentLength,
    visualWeight,
    readabilityScore: combinedReadabilityScore,
  };
}

/**
 * Calculate overall testimonial score for placement priority
 * Higher scores should be placed more prominently
 */
export function calculatePlacementScore(testimonial: Testimonial): number {
  const weight = calculateTestimonialWeight(testimonial);

  // Weighted placement score (priority heavily influences placement)
  const placementScore = (
    weight.priority * 0.5 +           // Business priority is most important
    weight.readabilityScore * 0.25 +  // Readable content gets better placement
    (weight.visualWeight / 3) * 0.15 + // Visual impact consideration
    Math.min(1, weight.contentLength / 200) * 0.1 // Content richness bonus
  );

  return Math.round(placementScore * 100) / 100;
}

/**
 * Sort testimonials by placement priority
 * Returns testimonials in order of placement importance (highest first)
 */
export function sortTestimonialsByPriority(testimonials: Testimonial[]): Testimonial[] {
  return [...testimonials].sort((a, b) => {
    const scoreA = calculatePlacementScore(a);
    const scoreB = calculatePlacementScore(b);

    // Primary sort: placement score (descending)
    if (scoreA !== scoreB) {
      return scoreB - scoreA;
    }

    // Secondary sort: business priority (descending)
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }

    // Tertiary sort: visual weight (descending for balance)
    const weightA = VISUAL_WEIGHTS[a.cardType as keyof typeof VISUAL_WEIGHTS] || 1;
    const weightB = VISUAL_WEIGHTS[b.cardType as keyof typeof VISUAL_WEIGHTS] || 1;

    return weightB - weightA;
  });
}

/**
 * Validate testimonial data for weight calculation
 */
export function validateTestimonialForWeight(testimonial: Testimonial): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields validation
  if (!testimonial.id) errors.push('Missing testimonial ID');
  if (!testimonial.text) errors.push('Missing testimonial text');
  if (!testimonial.cardType) errors.push('Missing card type');

  // Priority validation
  if (testimonial.priority < 1 || testimonial.priority > 10) {
    warnings.push(`Priority ${testimonial.priority} outside recommended range (1-10)`);
  }

  // Content validation
  if (testimonial.text.length < 10) {
    warnings.push('Testimonial text is very short (< 10 characters)');
  }

  if (testimonial.text.length > 500) {
    warnings.push('Testimonial text is very long (> 500 characters)');
  }

  // Rating validation
  if (testimonial.rating < 1 || testimonial.rating > 5) {
    warnings.push(`Rating ${testimonial.rating} outside expected range (1-5)`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Calculate weight statistics for a collection of testimonials
 */
export function calculateWeightStatistics(testimonials: Testimonial[]) {
  if (testimonials.length === 0) {
    return {
      count: 0,
      averageWeight: 0,
      weightDistribution: { tall: 0, wide: 0, compact: 0 },
      priorityRange: { min: 0, max: 0 },
      readabilityAverage: 0,
    };
  }

  const weights = testimonials.map(calculateTestimonialWeight);
  const placementScores = testimonials.map(calculatePlacementScore);

  // Weight distribution by card type
  const weightDistribution = testimonials.reduce((acc, t) => {
    acc[t.cardType]++;
    return acc;
  }, { tall: 0, wide: 0, compact: 0 } as Record<TestimonialCardType, number>);

  // Statistics calculations
  const averageWeight = placementScores.reduce((sum, score) => sum + score, 0) / placementScores.length;
  const priorities = testimonials.map(t => t.priority);
  const readabilityScores = weights.map(w => w.readabilityScore);

  return {
    count: testimonials.length,
    averageWeight: Math.round(averageWeight * 100) / 100,
    weightDistribution,
    priorityRange: {
      min: Math.min(...priorities),
      max: Math.max(...priorities),
    },
    readabilityAverage: Math.round((readabilityScores.reduce((sum, score) => sum + score, 0) / readabilityScores.length) * 100) / 100,
  };
}