# Testimonials Bento Grid System

A sophisticated, intelligent testimonial display system with advanced placement algorithms, responsive design, and accessibility features. Built for Next.js 15 with Tailwind CSS 4 and TypeScript.

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Components](#-components)
- [Design System](#-design-system)
- [Data Management](#-data-management)
- [Animations](#-animations)
- [Accessibility](#-accessibility)
- [API Reference](#-api-reference)
- [Examples](#-examples)
- [Development](#️-development)

## 🎯 Overview

The Testimonials Bento Grid System provides an intelligent, responsive layout for displaying customer testimonials with:

- **Intelligent Placement Algorithm**: Multi-criteria optimization for visual balance
- **Three Card Types**: Tall (291×429px), Wide (589×254px), Compact (319×241px)
- **Advanced Animations**: Motion-safe transitions with performance optimization
- **Full Accessibility**: WCAG AA compliance with keyboard navigation
- **Responsive Design**: Mobile-first approach with breakpoint intelligence
- **Design System Integration**: CSS custom properties with dark mode support

## ✨ Features

### Core Features

- 🧠 **Intelligent Auto-Placement**: Multi-criteria algorithm for optimal layout
- 📱 **Responsive Design**: Adaptive layouts for mobile, tablet, and desktop
- ♿ **Accessibility First**: WCAG AA compliance with screen reader optimization
- 🎨 **Advanced Animations**: Performance-optimized transitions with reduced motion support
- 📊 **Performance Monitoring**: Built-in metrics and optimization tracking
- 🔧 **TypeScript Support**: Comprehensive type safety throughout the system

### Design System

- 🎨 **CSS Custom Properties**: Consistent theming with dark mode support
- 📏 **Semantic Typography**: IBM Plex Sans + Nunito Sans font pairing
- 🌈 **Color System**: Luxury gold accent (#d4af37) with neutral palette
- 📐 **Spacing System**: Consistent grid-based spacing and proportions

### Data & Services

- 📄 **Static JSON Support**: Development-friendly data loading from JSON files
- 🔄 **Intelligent Caching**: Memory-efficient caching with TTL and LRU eviction
- 🛡️ **Data Validation**: Comprehensive validation with error handling
- 🔌 **Future CMS Ready**: Prepared for Sanity CMS integration

## 🚀 Quick Start

### Installation

```bash
# The testimonials system is included in the project
# Import components from the testimonials module
```

### Basic Usage

```tsx
import { TestimonialsGrid, useStaticTestimonials } from '@/components/ui/testimonials';

function TestimonialsSection() {
  const { testimonials, loading } = useStaticTestimonials({ limit: 8 });

  return (
    <TestimonialsGrid
      testimonials={testimonials}
      loading={loading}
      animationPreset="luxury"
    />
  );
}
```

### Demo Component

```tsx
import { TestimonialsDemo } from '@/components/ui/testimonials';

// Full-featured demo with interactive controls
function DemoPage() {
  return <TestimonialsDemo />;
}
```

## 🧩 Components

### Core Components

#### `<TestimonialsGrid>`
The main grid component with intelligent placement algorithm.

```tsx
<TestimonialsGrid
  testimonials={testimonials}
  placement={placementConfig}
  responsive={responsiveConfig}
  animationPreset="luxury"
  accessibility={accessibilityConfig}
  maxTestimonials={8}
  debug={false}
/>
```

#### `<TestimonialCard>`
Smart router component that automatically selects the appropriate card type.

```tsx
<TestimonialCard
  testimonial={testimonial}
  cardType="auto" // or "tall" | "wide" | "compact"
  showHoverEffects={true}
/>
```

#### `<StarRating>`
Accessible star rating component with multiple variants.

```tsx
<StarRating
  rating={4.5}
  variant="luxury"
  size="md"
  interactive={false}
  showHalfStars={true}
/>
```

### Individual Card Components

#### `<TallTestimonial>`
Vertical card for detailed testimonials (291×429px).

```tsx
<TallTestimonial
  testimonial={testimonial}
  loading={false}
  showHoverEffects={true}
/>
```

#### `<WideTestimonial>`
Horizontal card for medium-length testimonials (589×254px).

```tsx
<WideTestimonial
  testimonial={testimonial}
  loading={false}
  showHoverEffects={true}
/>
```

#### `<CompactTestimonial>`
Minimal card for short testimonials (319×241px).

```tsx
<CompactTestimonial
  testimonial={testimonial}
  loading={false}
  showHoverEffects={true}
/>
```

## 🎨 Design System

### CSS Custom Properties

The system uses CSS custom properties for consistent theming:

```css
/* Primary Variables */
--testimonials-bg: var(--white);
--testimonials-card-bg: var(--white);
--testimonials-text-primary: var(--black);
--testimonials-text-secondary: var(--color-gray-600);
--testimonials-accent: #d4af37;

/* Interactive States */
--testimonials-hover-bg: var(--color-gray-50);
--testimonials-focus-ring: var(--color-blue-500);
--testimonials-border: var(--color-gray-200);

/* Typography */
--testimonials-font-heading: 'IBM Plex Sans', sans-serif;
--testimonials-font-body: 'Nunito Sans', sans-serif;

/* Layout */
--testimonials-card-radius: 12px;
--testimonials-card-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
```

### Dark Mode Support

All components automatically adapt to dark mode using CSS custom properties:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --testimonials-bg: var(--color-gray-900);
    --testimonials-card-bg: var(--color-gray-800);
    --testimonials-text-primary: var(--white);
    --testimonials-text-secondary: var(--color-gray-300);
  }
}
```

## 📊 Data Management

### Testimonial Data Structure

```typescript
interface Testimonial {
  id: string;
  name: string;
  company?: string;
  role?: string;
  text: string;
  rating: number; // 0-5
  avatar?: string;
  cardType: 'tall' | 'wide' | 'compact';
  priority: number; // 1-10
  featured: boolean;
  tags: string[];
  metadata: {
    source: string;
    version: string;
    createdAt: string;
    updatedAt: string;
  };
}
```

### Static Data Service

```typescript
import { staticTestimonialsService } from '@/components/ui/testimonials';

// Load all testimonials
const { testimonials, total } = await staticTestimonialsService.loadTestimonials({
  limit: 20,
  featured: true,
  cardType: 'tall',
  shuffle: false
});

// Get featured testimonials
const featured = await staticTestimonialsService.getFeaturedTestimonials(6);

// Get by card type
const tallCards = await staticTestimonialsService.getTestimonialsByType('tall', 4);

// Get random selection
const random = await staticTestimonialsService.getRandomTestimonials(8);
```

### React Hooks

```typescript
import { useStaticTestimonials } from '@/components/ui/testimonials';

function TestimonialsComponent() {
  const {
    testimonials,
    loading,
    error,
    total,
    refresh
  } = useStaticTestimonials({
    limit: 8,
    featured: true,
    cardType: 'all'
  });

  // Handle refresh
  const handleRefresh = () => refresh();

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {/* Render testimonials */}
    </div>
  );
}
```

## 🎬 Animations

### Animation Presets

The system includes four animation presets:

```typescript
// Luxury preset (default)
<TestimonialsGrid animationPreset="luxury" />

// Minimal preset
<TestimonialsGrid animationPreset="minimal" />

// Playful preset
<TestimonialsGrid animationPreset="playful" />

// Disabled animations
<TestimonialsGrid animationPreset="disabled" />
```

### Custom Animation Configuration

```typescript
import { ANIMATION_PRESETS } from '@/components/ui/testimonials';

const customConfig = {
  ...ANIMATION_PRESETS.luxury,
  entrance: {
    name: 'fadeInScale',
    duration: 600,
    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    stagger: 100
  }
};
```

### Motion Preferences

The system automatically respects `prefers-reduced-motion` settings:

```typescript
// Automatically adapts animations for accessibility
<TestimonialsGrid
  animationPreset="luxury"
  // Will use minimal animations if user prefers reduced motion
/>
```

## ♿ Accessibility

### WCAG AA Compliance

- **Keyboard Navigation**: Full keyboard support with focus management
- **Screen Reader Support**: Semantic markup with ARIA labels
- **Color Contrast**: Meets WCAG AA requirements (4.5:1 minimum)
- **Motion Preferences**: Respects `prefers-reduced-motion`
- **Focus Management**: Visible focus indicators and logical tab order

### Accessibility Configuration

```typescript
const accessibilityConfig = {
  announceChanges: true,
  keyboardNavigation: true,
  screenReaderOptimized: true,
  highContrastMode: false
};

<TestimonialsGrid
  accessibility={accessibilityConfig}
  testimonials={testimonials}
/>
```

### Screen Reader Support

```typescript
// Automatic announcements for dynamic content
<TestimonialsGrid
  testimonials={testimonials}
  accessibility={{ announceChanges: true }}
/>
```

## 🔧 Examples

### Basic Implementation

```tsx
import { TestimonialsGrid, useStaticTestimonials } from '@/components/ui/testimonials';

export default function TestimonialsPage() {
  const { testimonials, loading, error } = useStaticTestimonials();

  if (error) return <div>Error loading testimonials</div>;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Our Customers Say
        </h2>
        <TestimonialsGrid
          testimonials={testimonials}
          loading={loading}
          maxTestimonials={8}
          animationPreset="luxury"
        />
      </div>
    </section>
  );
}
```

## 🛠️ Development

### Project Structure

```text
components/ui/testimonials/
├── README.md                          # This documentation
├── index.ts                           # Barrel exports
├── types.ts                           # TypeScript interfaces
├── TestimonialsGrid.tsx               # Main grid component
├── TestimonialCard.tsx                # Smart card router
├── TestimonialsDemo.tsx               # Interactive demo
├── TallTestimonial.tsx                # Tall card component
├── WideTestimonial.tsx                # Wide card component
├── CompactTestimonial.tsx             # Compact card component
├── StarRating.tsx                     # Star rating component
├── services/
│   ├── staticTestimonialsService.ts   # Static JSON data service
│   └── testimonialsService.ts         # Advanced service (future CMS)
├── utils/
│   ├── calculateWeight.ts             # Weight calculation utilities
│   ├── IntelligentPlacement.ts        # Placement algorithm
│   ├── gridLayout.ts                  # Grid layout utilities
│   ├── sanityIntegration.ts           # Sanity CMS utilities
│   └── animations.ts                  # Animation system
└── __tests__/
    └── integration.test.tsx           # Comprehensive tests
```

### Data File

```text
data/
└── testimonials.json                  # Static testimonials data
```

---

## 📝 Implementation Status

### ✅ Completed Phases

#### Phase 1: Foundation & TypeScript Architecture
- Comprehensive TypeScript interfaces and types
- Barrel exports and project structure
- CSS custom properties integration

#### Phase 2: StarRating Component
- Accessible star rating with multiple variants
- WCAG AA compliance with keyboard navigation
- Half-star precision and interactive mode

#### Phase 3: Basic Card Components
- TallTestimonial (291×429px) with detailed layout
- WideTestimonial (589×254px) with horizontal design
- CompactTestimonial (319×241px) with minimal layout
- Smart TestimonialCard router component

#### Phase 4: Intelligent Placement Algorithm
- Multi-criteria weight calculation system
- Visual balance and clustering prevention
- Reading flow optimization
- Responsive grid layout generation

#### Phase 5: Design Completion & Production Features
- Static JSON data service for design purposes
- Advanced animation system with motion preferences
- Comprehensive integration testing
- Interactive demo component
- Complete documentation and usage guidelines

---

## Built with ❤️ for exceptional user experiences
