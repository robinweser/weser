import compileMarkdown from '@/utils/compileMarkdown'

export type T_PageMeta = {
  title?: string
  description?: string
  order?: number
}

export type T_Page<T = T_PageMeta> = Awaited<
  ReturnType<typeof compileMarkdown<T>>
>
