export default function alpha(reference: string, alpha: number) {
  return `hsl(from ${reference} h s l / max(0, min(1, ${alpha})))`
}
