import { promises as fs } from 'fs'
import { join } from 'path'
import { T_ActionResponse } from '@weser/actions'

import compileMarkdown from './compileMarkdown'
import { T_Page } from '@/types'

const ROOT_PATH = join(process.cwd(), '/docs/')
export default async function getPageById(
  id: string
): Promise<T_ActionResponse<T_Page>> {
  try {
    const markdown = await getMarkdown(id)
    const data = await compileMarkdown(markdown)

    return [null, data]
  } catch {
    return ['Error loading']
  }
}

async function getMarkdown(id: string) {
  try {
    const markdown = await fs.readFile(join(ROOT_PATH, id + '.mdx'), 'utf-8')

    if (markdown) {
      return markdown
    }
  } catch {}

  return await fs.readFile(join(ROOT_PATH, id + '/index.mdx'), 'utf-8')
}
