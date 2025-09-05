import { promises as fs } from 'fs'
import { join } from 'path'

import getPageById from './getPageById'
export default async function getPageStructure(id: string) {
  return await getItems(id)
}

export type T_PageStructureItem = {
  path: string
  name?: string
  order?: number
  items?: Array<T_PageStructureItem>
}

const ROOT_PATH = join(process.cwd(), '/docs/')
async function getItems(path: string): Promise<Array<T_PageStructureItem>> {
  const entries = await fs.readdir(join(ROOT_PATH, path), {
    withFileTypes: true,
  })

  const items = []

  for (const file of entries) {
    const { name } = file
    const _path = join(path, name)

    const isRoot = name === 'index'

    if (file.isDirectory()) {
      const inner = await getItems(_path)

      const root = inner.find((item) => item.path === _path + '/index')

      items.push({
        name: root?.name,
        order: root?.order,
        path: _path,
        items: inner.filter((item) => item.path !== _path + '/index'),
      })

      continue
    }

    const filePath = _path.replace('.mdx', '')
    const [error, data] = await getPageById(filePath)

    if (error !== null) {
      continue
    }

    items.push({
      name: data.meta?.title,
      path: isRoot ? path : filePath,
      order: data.meta?.order,
    })
  }

  return items.sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
}
