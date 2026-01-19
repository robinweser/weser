export default function lightness(color: string, percent: number) {
  return `hsl(from ${color} h s ${percent}%)`
}

