import { defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Products',
  type: 'document',
  groups: [
    { name: 'basic', title: 'Basic Info', default: true },
    { name: 'content', title: 'Content' },
    { name: 'media', title: 'Media' },
    { name: 'features', title: 'Features' },
    { name: 'display', title: 'Display Settings' },
  ],
  fields: [
    // ─── BASIC INFO GROUP ─────────────────────────────────────────
    {
      name: 'name',
      title: 'Product Name',
      type: 'string',
      group: 'basic',
      validation: (Rule) => Rule.required().max(100),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'basic',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      description: 'URL-friendly identifier (auto-generated from name)',
    },
    {
      name: 'brand',
      title: 'Brand',
      type: 'string',
      group: 'basic',
      initialValue: 'Ruqma',
    },

    // ─── CONTENT GROUP ────────────────────────────────────────────
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (Rule) => Rule.max(500),
      description: 'Main product description (up to 500 characters)',
    },
    {
      name: 'additionalDescription',
      title: 'Additional Description',
      type: 'text',
      rows: 2,
      group: 'content',
      validation: (Rule) => Rule.max(300),
      description: 'Secondary description for product details section',
    },

    // ─── MEDIA GROUP ──────────────────────────────────────────────
    {
      name: 'mainImage',
      title: 'Main Product Image',
      type: 'image',
      group: 'media',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          description: 'Describe the image for accessibility',
        },
      ],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'gallery',
      title: 'Product Gallery',
      type: 'object',
      group: 'media',
      description: 'Gallery images shown in the "A Closer Look" section',
      fields: [
        {
          name: 'title',
          title: 'Gallery Title',
          type: 'string',
          initialValue: 'A Closer Look',
        },
        {
          name: 'subtitle',
          title: 'Gallery Subtitle',
          type: 'string',
        },
        {
          name: 'images',
          title: 'Gallery Images',
          type: 'array',
          of: [
            {
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alt Text',
                  description: 'Describe the image for accessibility',
                },
                {
                  name: 'gridSpan',
                  title: 'Grid Size',
                  type: 'object',
                  description: 'Control image size in gallery grid',
                  fields: [
                    {
                      name: 'cols',
                      title: 'Column Span',
                      type: 'number',
                      validation: (Rule) => Rule.required().min(1).max(4),
                      initialValue: 1,
                    },
                    {
                      name: 'rows',
                      title: 'Row Span',
                      type: 'number',
                      validation: (Rule) => Rule.required().min(1).max(2),
                      initialValue: 1,
                    },
                  ],
                },
                {
                  name: 'aspectRatio',
                  title: 'Aspect Ratio',
                  type: 'string',
                  description: 'e.g., "1/1" for square, "16/9" for wide',
                  initialValue: '1/1',
                  options: {
                    list: [
                      { title: 'Square (1:1)', value: '1/1' },
                      { title: 'Wide (16:9)', value: '16/9' },
                      { title: 'Portrait (4:3)', value: '4/3' },
                    ],
                  },
                },
                {
                  name: 'priority',
                  title: 'Priority Loading',
                  type: 'boolean',
                  description: 'Enable for first 2-3 images for faster loading',
                  initialValue: false,
                },
              ],
            },
          ],
          validation: (Rule) =>
            Rule.min(4).max(12).warning('Recommended: 6-10 images for optimal layout'),
        },
      ],
    },

    // ─── FEATURES GROUP ───────────────────────────────────────────
    {
      name: 'productDetails',
      title: 'Product Details',
      type: 'object',
      group: 'features',
      description: 'Product features section with two-column layout',
      fields: [
        // Left Column
        {
          name: 'leftColumn',
          title: 'Left Column',
          type: 'object',
          description: 'Left side with product image and headline',
          fields: [
            {
              name: 'productImage',
              type: 'image',
              title: 'Product Image',
              description: 'Main product image (left column)',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alt Text',
                },
              ],
            },
            {
              name: 'headline',
              type: 'object',
              title: 'Headline',
              description: 'Main headline with mixed colors',
              fields: [
                {
                  name: 'darkText',
                  type: 'string',
                  title: 'Dark Text',
                  description: 'Text in dark color (e.g., "Micro textured for")',
                },
                {
                  name: 'goldText',
                  type: 'string',
                  title: 'Gold Text',
                  description: 'Text in gold/primary color (e.g., "smooth glide")',
                },
              ],
            },
            {
              name: 'description',
              type: 'text',
              title: 'Description',
              description: 'Supporting text below headline',
              rows: 3,
            },
          ],
        },
        // Right Column - Feature Cards
        {
          name: 'featureCards',
          title: 'Feature Cards',
          type: 'array',
          description: 'Feature cards displayed in a row (recommended: 3 cards)',
          validation: (Rule) => Rule.min(1).max(4),
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'id',
                  type: 'string',
                  title: 'Feature ID',
                  description: 'Unique identifier',
                },
                {
                  name: 'goldText',
                  type: 'string',
                  title: 'Gold Text',
                  description: 'Highlighted text in gold (e.g., "Consistent")',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'darkText',
                  type: 'string',
                  title: 'Dark Text',
                  description: 'Text in dark color (e.g., "surface")',
                },
                {
                  name: 'description',
                  type: 'text',
                  title: 'Description',
                  rows: 2,
                },
              ],
              preview: {
                select: {
                  goldText: 'goldText',
                  darkText: 'darkText',
                },
                prepare({ goldText, darkText }) {
                  return {
                    title: `${goldText || ''} ${darkText || ''}`.trim() || 'Untitled Feature',
                  }
                },
              },
            },
          ],
        },
        // Right Column - Large Image
        {
          name: 'detailImage',
          title: 'Large Detail Image',
          type: 'image',
          description: 'Large product image below feature cards',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
            },
          ],
        },
        // Legacy fields (kept for backward compatibility)
        {
          name: 'mainFeature',
          title: 'Main Feature (Legacy)',
          type: 'object',
          hidden: true,
          description: 'Legacy field - use leftColumn instead',
          fields: [
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'highlight', type: 'string', title: 'Highlight' },
            { name: 'description', type: 'text', title: 'Description' },
            {
              name: 'image',
              type: 'image',
              title: 'Feature Image',
              options: { hotspot: true },
              fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
            },
          ],
        },
        {
          name: 'features',
          title: 'Additional Features (Legacy)',
          type: 'array',
          hidden: true,
          description: 'Legacy field - use featureCards instead',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'id', type: 'string', title: 'Feature ID' },
                { name: 'title', type: 'string', title: 'Title' },
                { name: 'highlight', type: 'string', title: 'Highlight Word' },
                { name: 'description', type: 'text', title: 'Description' },
              ],
            },
          ],
        },
      ],
    },

    // ─── DISPLAY SETTINGS GROUP ───────────────────────────────────
    {
      name: 'showOnHome',
      title: 'Show on Homepage',
      type: 'boolean',
      group: 'display',
      initialValue: true,
      description: 'Display this product on the homepage',
    },
    {
      name: 'priority',
      title: 'Display Priority',
      type: 'number',
      group: 'display',
      validation: (Rule) => Rule.integer().positive(),
      initialValue: 10,
      description: 'Lower numbers appear first (1 = highest priority)',
    },
    {
      name: 'featured',
      title: 'Featured Product',
      type: 'boolean',
      group: 'display',
      initialValue: false,
      description: 'Featured products may receive special styling or prominence',
    },
    {
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      group: 'display',
      initialValue: true,
      description: 'Uncheck to hide without deleting',
    },
  ],

  orderings: [
    {
      title: 'Priority',
      name: 'priorityAsc',
      by: [{ field: 'priority', direction: 'asc' }],
    },
    {
      title: 'Name (A-Z)',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
    {
      title: 'Name (Z-A)',
      name: 'nameDesc',
      by: [{ field: 'name', direction: 'desc' }],
    },
  ],

  preview: {
    select: {
      title: 'name',
      brand: 'brand',
      active: 'isActive',
      featured: 'featured',
      showOnHome: 'showOnHome',
      media: 'mainImage',
    },
    prepare({ title, brand, active, featured, showOnHome, media }) {
      const status = active ? (featured ? '⭐' : '✓') : '✗'
      const homeIcon = showOnHome ? '🏠' : ''
      return {
        title: `${status} ${title}`,
        subtitle: `${brand} ${homeIcon}`.trim(),
        media,
      }
    },
  },
})
