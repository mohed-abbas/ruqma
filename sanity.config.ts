import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { media } from 'sanity-plugin-media'
import { schemaTypes } from './sanity/schema'
import { structure } from './sanity/desk/structure'

export default defineConfig({
  name: 'ruqma',
  title: 'Ruqma CMS',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  basePath: '/studio',

  plugins: [
    structureTool({ structure }),
    visionTool(),
    media(),
  ],

  schema: {
    types: schemaTypes,
  },
})
