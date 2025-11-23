import { defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Products',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'model',
      title: 'Model',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    },
    {
      name: 'additionalDescription',
      title: 'Additional Description',
      type: 'text',
      rows: 2,
    },
    {
      name: 'mainImage',
      title: 'Main Product Image',
      type: 'image',
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
      name: 'showOnHome',
      title: 'Show on Homepage',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'brand',
      title: 'Brand',
      type: 'string',
      initialValue: 'Ruqma',
    },
    {
      name: 'productDetails',
      title: 'Product Details',
      type: 'object',
      fields: [
        {
          name: 'mainFeature',
          title: 'Main Feature',
          type: 'object',
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
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'id',
                  type: 'string',
                  title: 'Feature ID',
                },
                {
                  name: 'title',
                  type: 'string',
                  title: 'Title',
                },
                {
                  name: 'highlight',
                  type: 'string',
                  title: 'Highlight Word',
                },
                {
                  name: 'description',
                  type: 'text',
                  title: 'Description',
                },
              ],
            },
          ],
        },
        {
          name: 'detailImage',
          title: 'Detail Image',
          type: 'image',
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
      name: 'gallery',
      title: 'Product Gallery',
      type: 'object',
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
          validation: (Rule) => Rule.min(4).max(12).warning('Recommended: 6-10 images for optimal layout'),
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'model',
      media: 'mainImage',
    },
  },
})
