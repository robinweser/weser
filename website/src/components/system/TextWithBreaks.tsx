export default function TextWithBreaks({ children }: { children: string }) {
  return (
    <span
      style={{ display: 'contents' }}
      dangerouslySetInnerHTML={{ __html: children.replace(/\n/g, '<br />') }}
    />
  )
}
