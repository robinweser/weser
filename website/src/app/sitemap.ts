import { MetadataRoute } from 'next'

import { baseUrl } from '@/data/meta'
import getAllPackages from '@/utils/getAllPackages'
import getPageStructure, { T_PageStructureItem } from '@/utils/getPageStructure'

const staticPages = [['', 1, 'monthly']]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const packages = await getAllPackages()

  const pages = []
  for (const packageName of packages) {
    const structure = await getPageStructure(packageName)

    const packagePages = getPages(structure)
    pages.push(...packagePages)
  }

  const statics = staticPages.map(([path, priority, changeFrequency]) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }))

  return [...statics, ...pages] as MetadataRoute.Sitemap
}

function getPages(structure: Array<T_PageStructureItem>) {
  const pages = []
  for (const item of structure) {
    if (item.items) {
      pages.push(...getPages(item.items))
    }

    pages.push({
      url: `${baseUrl}/${item.path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  }

  return pages
}
