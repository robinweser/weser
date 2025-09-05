declare module 'gray-matter' {
  export default function matter<MetaData = any>(
    markdown: string
  ): {
    data: MetaData
    content: string
  }
}
