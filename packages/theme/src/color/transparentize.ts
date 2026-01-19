export default function transparentize(color: string, amount: number) {
  return `hsl(from ${color} h s l / max(0, min(1, calc(alpha - ${amount}))))`
}

