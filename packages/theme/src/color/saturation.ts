export default function saturation(color: string, percent: number) {
  return `hsl(from ${color} h ${percent}% l)`
}

