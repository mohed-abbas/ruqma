import { defineType } from 'sanity'

export default defineType({
  name: 'partner',
  title: 'Partners',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Partner Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'logo',
      title: 'Partner Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
      description: 'Upload partner logo (SVG or PNG recommended)',
    },
    {
      name: 'website',
      title: 'Website URL',
      type: 'url',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    },
    {
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      validation: (Rule) => Rule.integer().positive(),
      initialValue: 1,
    },
    {
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Uncheck to hide partner without deleting',
    },
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrderAsc',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo',
      order: 'displayOrder',
      active: 'isActive',
    },
    prepare({ title, media, order, active }) {
      return {
        title: `${active ? '✓' : '✗'} ${title}`,
        subtitle: `Order: ${order}`,
        media,
      }
    },
  },
})
