// sanity.config.ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schema'
import { structure } from './sanity/structure'

export default defineConfig({
  name: 'churchChoirStudio',
  title: 'Church Choir Studio',
  basePath: '/studio',

  projectId: '3j1hq2pe',
  dataset: 'production',
  apiVersion: '2024-01-01',

  plugins: [
    structureTool({
      structure, // 👈 our custom index.ts structure
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})

