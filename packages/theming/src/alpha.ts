function normalizeAlpha(alpha: number) {
  if (alpha < 0) {
    return 0
  }

  if (alpha > 1) {
    return 1
  }

  return alpha
}
export default function alpha(reference: string, alpha: number) {
  return `hsl(from ${reference} h s l / ${normalizeAlpha(alpha)})`
}
