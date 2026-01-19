export default function desaturate(color: string, amount: number) {
  const percentage = amount * 100

  return `hsl(from ${color} h calc(max(0, min(100, s - ${percentage}))) l)`
}

