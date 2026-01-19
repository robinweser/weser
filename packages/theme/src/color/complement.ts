export default function complement(color: string) {
  return `hsl(from ${color} calc(h + 180) s l)`
}

