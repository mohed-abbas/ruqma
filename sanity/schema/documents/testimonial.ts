import { defineType } from 'sanity'
import { RatingInput } from './RatingInput'

export default defineType({
  name: 'testimonial',
  title: 'Testimonials',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Customer Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'company',
      title: 'Company',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
      initialValue: 5,
      components: {
        input: RatingInput,
      },
    },
    {
      name: 'text',
      title: 'Testimonial Text',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().max(500),
    },
    {
      name: 'avatar',
      title: 'Avatar Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'cardType',
      title: 'Card Type',
      type: 'string',
      options: {
        list: [
          { title: 'Tall', value: 'tall' },
          { title: 'Wide', value: 'wide' },
          { title: 'Compact', value: 'compact' },
        ],
        layout: 'radio',
      },
      initialValue: 'compact',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'priority',
      title: 'Display Priority',
      type: 'number',
      description: 'Lower numbers appear first (1-10)',
      validation: (Rule) => Rule.min(1).max(10).integer(),
      initialValue: 5,
    },
    {
      name: 'date',
      title: 'Testimonial Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'company',
      media: 'avatar',
      rating: 'rating',
    },
    prepare({ title, subtitle, media, rating }) {
      return {
        title,
        subtitle: `${subtitle} - ${'⭐'.repeat(rating)}`,
        media,
      }
    },
  },
})
