import { promises as fs } from 'fs'
import { join } from 'path'

const ROOT_PATH = join(process.cwd(), '/docs/')
export default async function getAllPackages(): Promise<Array<string>> {
  const entries = await fs.readdir(join(ROOT_PATH), {
    withFileTypes: true,
  })

  return entries.filter((file) => file.isDirectory()).map((file) => file.name)
}
