/**
 * Advanced Animations Utilities - Phase 5: Design Polish
 *
 * Sophisticated animation system with performance optimization,
 * accessibility support, and customizable transition effects.
 */

export interface AnimationVariant {
  name: string;
  duration: number;
  easing: string;
  delay?: number;
  transform?: string;
  opacity?: number[];
  scale?: number[];
  rotateY?: number[];
  stagger?: number;
}

export interface AdvancedAnimationConfig {
  enabled: boolean;
  respectMotionPreference: boolean;
  performance: 'smooth' | 'crisp' | 'auto';
  staggerDelay: number;
  entrance: AnimationVariant;
  hover: AnimationVariant;
  focus: AnimationVariant;
  exit: AnimationVariant;
}

/**
 * Pre-defined animation variants
 */
export const ANIMATION_VARIANTS: Record<string, AnimationVariant> = {
  // Entrance animations
  fadeInUp: {
    name: 'fadeInUp',
    duration: 600,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'translateY(30px)',
    opacity: [0, 1],
    stagger: 100,
  },

  fadeInScale: {
    name: 'fadeInScale',
    duration: 500,
    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    opacity: [0, 1],
    scale: [0.8, 1],
    stagger: 80,
  },

  slideInLeft: {
    name: 'slideInLeft',
    duration: 700,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    transform: 'translateX(-50px)',
    opacity: [0, 1],
    stagger: 120,
  },

  flipInX: {
    name: 'flipInX',
    duration: 800,
    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    opacity: [0, 1],
    rotateY: [-90, 0],
    stagger: 150,
  },

  // Hover animations
  liftAndGlow: {
    name: 'liftAndGlow',
    duration: 300,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    transform: 'translateY(-8px) scale(1.02)',
  },

  gentleScale: {
    name: 'gentleScale',
    duration: 250,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    scale: [1, 1.05],
  },

  rotateGlow: {
    name: 'rotateGlow',
    duration: 400,
    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    transform: 'rotate(2deg) scale(1.03)',
  },

  // Focus animations
  focusRing: {
    name: 'focusRing',
    duration: 200,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'scale(1.02)',
  },

  // Exit animations
  fadeOutDown: {
    name: 'fadeOutDown',
    duration: 400,
    easing: 'cubic-bezier(0.4, 0, 1, 1)',
    transform: 'translateY(20px)',
    opacity: [1, 0],
  },
};

/**
 * Default animation configurations
 */
export const ANIMATION_PRESETS: Record<string, AdvancedAnimationConfig> = {
  luxury: {
    enabled: true,
    respectMotionPreference: true,
    performance: 'smooth',
    staggerDelay: 100,
    entrance: ANIMATION_VARIANTS.fadeInScale,
    hover: ANIMATION_VARIANTS.liftAndGlow,
    focus: ANIMATION_VARIANTS.focusRing,
    exit: ANIMATION_VARIANTS.fadeOutDown,
  },

  minimal: {
    enabled: true,
    respectMotionPreference: true,
    performance: 'crisp',
    staggerDelay: 60,
    entrance: ANIMATION_VARIANTS.fadeInUp,
    hover: ANIMATION_VARIANTS.gentleScale,
    focus: ANIMATION_VARIANTS.focusRing,
    exit: ANIMATION_VARIANTS.fadeOutDown,
  },

  playful: {
    enabled: true,
    respectMotionPreference: true,
    performance: 'smooth',
    staggerDelay: 150,
    entrance: ANIMATION_VARIANTS.flipInX,
    hover: ANIMATION_VARIANTS.rotateGlow,
    focus: ANIMATION_VARIANTS.focusRing,
    exit: ANIMATION_VARIANTS.fadeOutDown,
  },

  disabled: {
    enabled: false,
    respectMotionPreference: true,
    performance: 'auto',
    staggerDelay: 0,
    entrance: { name: 'none', duration: 0, easing: 'linear' },
    hover: { name: 'none', duration: 0, easing: 'linear' },
    focus: { name: 'none', duration: 0, easing: 'linear' },
    exit: { name: 'none', duration: 0, easing: 'linear' },
  },
};

/**
 * Generate CSS keyframes for animation variants
 */
export function generateKeyframes(variant: AnimationVariant): string {
  const { name, opacity, scale, rotateY, transform } = variant;

  let keyframes = `@keyframes ${name} {\n  from {\n`;

  // Initial state
  if (opacity) keyframes += `    opacity: ${opacity[0]};\n`;
  if (scale) keyframes += `    transform: scale(${scale[0]});\n`;
  if (rotateY) keyframes += `    transform: rotateY(${rotateY[0]}deg);\n`;
  if (transform) keyframes += `    transform: ${transform};\n`;

  keyframes += `  }\n  to {\n`;

  // Final state
  if (opacity) keyframes += `    opacity: ${opacity[1]};\n`;
  if (scale) keyframes += `    transform: scale(${scale[1]});\n`;
  if (rotateY) keyframes += `    transform: rotateY(${rotateY[1]}deg);\n`;
  if (!transform && !scale && !rotateY) keyframes += `    transform: translateY(0);\n`;

  keyframes += `  }\n}`;

  return keyframes;
}

/**
 * Generate CSS styles for animation
 */
export function generateAnimationStyles(
  variant: AnimationVariant,
  index: number = 0,
  config: AdvancedAnimationConfig
): React.CSSProperties {
  if (!config.enabled || variant.name === 'none') {
    return {};
  }

  const delay = (variant.delay || 0) + (index * (variant.stagger || config.staggerDelay));

  return {
    animation: `${variant.name} ${variant.duration}ms ${variant.easing} ${delay}ms both`,
    willChange: 'transform, opacity',
  };
}

/**
 * Generate hover styles
 */
export function generateHoverStyles(
  variant: AnimationVariant,
  config: AdvancedAnimationConfig
): React.CSSProperties {
  if (!config.enabled || variant.name === 'none') {
    return {};
  }

  return {
    transition: `all ${variant.duration}ms ${variant.easing}`,
    willChange: 'transform',
  };
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Create motion-safe animation configuration
 */
export function createMotionSafeConfig(config: AdvancedAnimationConfig): AdvancedAnimationConfig {
  if (!config.respectMotionPreference || !prefersReducedMotion()) {
    return config;
  }

  // Return minimal animations for reduced motion preference
  return {
    ...config,
    entrance: {
      ...config.entrance,
      duration: Math.min(config.entrance.duration, 200),
      transform: undefined,
      scale: undefined,
      rotateY: undefined,
    },
    hover: {
      ...config.hover,
      duration: Math.min(config.hover.duration, 150),
      transform: undefined,
      scale: undefined,
      rotateY: undefined,
    },
    staggerDelay: Math.min(config.staggerDelay, 50),
  };
}

/**
 * Performance optimization utilities
 */
export function optimizeForPerformance(config: AdvancedAnimationConfig): AdvancedAnimationConfig {
  const isLowPower = typeof window !== 'undefined' &&
    'deviceMemory' in navigator &&
    (navigator as any).deviceMemory < 4;

  if (config.performance === 'auto' && isLowPower) {
    return {
      ...config,
      entrance: {
        ...config.entrance,
        duration: Math.min(config.entrance.duration, 300),
      },
      hover: {
        ...config.hover,
        duration: Math.min(config.hover.duration, 200),
      },
      staggerDelay: Math.min(config.staggerDelay, 50),
    };
  }

  return config;
}

/**
 * Create complete animation stylesheet
 */
export function createAnimationStylesheet(configs: AdvancedAnimationConfig[]): string {
  const keyframes = new Set<string>();

  configs.forEach(config => {
    if (config.enabled) {
      [config.entrance, config.hover, config.focus, config.exit].forEach(variant => {
        if (variant.name !== 'none') {
          keyframes.add(generateKeyframes(variant));
        }
      });
    }
  });

  return Array.from(keyframes).join('\n\n');
}

/**
 * Intersection Observer for triggering animations
 */
export class AnimationObserver {
  private observer: IntersectionObserver | null = null;
  private callbacks = new Map<Element, () => void>();

  constructor(options: IntersectionObserverInit = {}) {
    if (typeof window !== 'undefined') {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const callback = this.callbacks.get(entry.target);
            if (callback) {
              callback();
              this.unobserve(entry.target);
            }
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      });
    }
  }

  observe(element: Element, callback: () => void): void {
    if (this.observer) {
      this.callbacks.set(element, callback);
      this.observer.observe(element);
    } else {
      // Fallback for server-side rendering
      callback();
    }
  }

  unobserve(element: Element): void {
    if (this.observer) {
      this.observer.unobserve(element);
      this.callbacks.delete(element);
    }
  }

  disconnect(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.callbacks.clear();
    }
  }
}

/**
 * React hook for animations
 */
export function useAnimation(
  config: AdvancedAnimationConfig,
  trigger: boolean = true
): {
  ref: React.RefCallback<HTMLElement>;
  isVisible: boolean;
  animationConfig: AdvancedAnimationConfig;
} {
  const [isVisible, setIsVisible] = React.useState(false);
  const [element, setElement] = React.useState<HTMLElement | null>(null);
  const observerRef = React.useRef<AnimationObserver>();

  // Create motion-safe and performance-optimized config
  const optimizedConfig = React.useMemo(() => {
    let finalConfig = createMotionSafeConfig(config);
    finalConfig = optimizeForPerformance(finalConfig);
    return finalConfig;
  }, [config]);

  React.useEffect(() => {
    if (!element || !trigger || !optimizedConfig.enabled) return;

    if (!observerRef.current) {
      observerRef.current = new AnimationObserver();
    }

    observerRef.current.observe(element, () => {
      setIsVisible(true);
    });

    return () => {
      if (observerRef.current && element) {
        observerRef.current.unobserve(element);
      }
    };
  }, [element, trigger, optimizedConfig.enabled]);

  React.useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const ref = React.useCallback((node: HTMLElement | null) => {
    setElement(node);
  }, []);

  return {
    ref,
    isVisible,
    animationConfig: optimizedConfig,
  };
}

// React import
import React from 'react';