import { defineType } from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonials',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'display', title: 'Display Settings' },
    { name: 'metadata', title: 'Metadata' },
  ],
  fields: [
    // ─── CONTENT GROUP ───────────────────────────────────────────
    {
      name: 'name',
      title: 'Customer Name',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required().max(50),
    },
    {
      name: 'role',
      title: 'Role / Position',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required().max(50),
    },
    {
      name: 'company',
      title: 'Company',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required().max(50),
    },
    {
      name: 'content',
      title: 'Testimonial Text',
      type: 'text',
      rows: 4,
      group: 'content',
      validation: (Rule) => Rule.required().min(50).max(500),
      description: 'The testimonial quote (50-500 characters)',
    },
    {
      name: 'rating',
      title: 'Star Rating',
      type: 'number',
      group: 'content',
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
      initialValue: 5,
      options: {
        list: [
          { title: '⭐', value: 1 },
          { title: '⭐⭐', value: 2 },
          { title: '⭐⭐⭐', value: 3 },
          { title: '⭐⭐⭐⭐', value: 4 },
          { title: '⭐⭐⭐⭐⭐', value: 5 },
        ],
      },
    },
    {
      name: 'image',
      title: 'Profile Image',
      type: 'image',
      group: 'content',
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
    },

    // ─── DISPLAY GROUP ───────────────────────────────────────────
    {
      name: 'cardType',
      title: 'Card Type',
      type: 'string',
      group: 'display',
      validation: (Rule) => Rule.required(),
      initialValue: 'compact',
      options: {
        list: [
          { title: 'Tall (vertical emphasis, spans 2 rows)', value: 'tall' },
          { title: 'Wide (horizontal, spans 2 columns)', value: 'wide' },
          { title: 'Compact (standard single cell)', value: 'compact' },
        ],
        layout: 'radio',
      },
      description: 'Controls how the testimonial appears in the bento grid',
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
      title: 'Featured',
      type: 'boolean',
      group: 'display',
      initialValue: false,
      description: 'Featured testimonials may receive special styling',
    },

    // ─── METADATA GROUP ──────────────────────────────────────────
    {
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      group: 'metadata',
      initialValue: true,
      description: 'Uncheck to hide without deleting',
    },
    {
      name: 'dateReceived',
      title: 'Date Received',
      type: 'date',
      group: 'metadata',
      description: 'When the testimonial was received (optional)',
    },
  ],

  orderings: [
    {
      title: 'Priority',
      name: 'priorityAsc',
      by: [{ field: 'priority', direction: 'asc' }],
    },
    {
      title: 'Date Received (Newest)',
      name: 'dateDesc',
      by: [{ field: 'dateReceived', direction: 'desc' }],
    },
  ],

  preview: {
    select: {
      title: 'name',
      company: 'company',
      cardType: 'cardType',
      active: 'isActive',
      featured: 'featured',
      media: 'image',
    },
    prepare({ title, company, cardType, active, featured, media }) {
      const status = active ? (featured ? '⭐' : '✓') : '✗'
      const typeEmoji =
        cardType === 'tall' ? '📐' : cardType === 'wide' ? '📏' : '📦'
      return {
        title: `${status} ${title}`,
        subtitle: `${company} · ${typeEmoji} ${cardType}`,
        media,
      }
    },
  },
})
