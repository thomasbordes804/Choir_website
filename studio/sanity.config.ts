// sanity.config.ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schema'
import { structure } from './sanity/structure'

export default defineConfig({
  name: 'churchChoirStudio',
  title: 'Church Choir Studio',

  projectId: 'pbsm0i27',
  dataset: 'production',

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
