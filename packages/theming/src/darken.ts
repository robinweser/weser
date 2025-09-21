export default function darken(color: string, amount: number) {
  const percentage = amount * 100

  return `hsl(from ${color} h s calc(max(0, min(100, l - ${percentage}))))`
}
