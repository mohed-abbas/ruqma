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
      fields: [
        {
          name: 'mainFeature',
          title: 'Main Feature',
          type: 'object',
          description: 'Primary highlighted feature with image',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'Title',
            },
            {
              name: 'highlight',
              type: 'string',
              title: 'Highlight',
              description: 'Word or phrase to emphasize (e.g., "Premium")',
            },
            {
              name: 'description',
              type: 'text',
              title: 'Description',
            },
            {
              name: 'image',
              type: 'image',
              title: 'Feature Image',
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
          ],
        },
        {
          name: 'features',
          title: 'Additional Features',
          type: 'array',
          description: 'List of additional product features',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'id',
                  type: 'string',
                  title: 'Feature ID',
                  description: 'Unique identifier (e.g., "comfort", "durability")',
                },
                {
                  name: 'title',
                  type: 'string',
                  title: 'Title',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'highlight',
                  type: 'string',
                  title: 'Highlight Word',
                  description: 'Word to emphasize in the title',
                },
                {
                  name: 'description',
                  type: 'text',
                  title: 'Description',
                },
              ],
              preview: {
                select: {
                  title: 'title',
                  id: 'id',
                },
                prepare({ title, id }) {
                  return {
                    title: title || 'Untitled Feature',
                    subtitle: id ? `ID: ${id}` : undefined,
                  }
                },
              },
            },
          ],
        },
        {
          name: 'detailImage',
          title: 'Detail Image',
          type: 'image',
          description: 'Additional image for product details section',
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
