export default function hue(color: string, degrees: number) {
  return `hsl(from ${color} ${degrees} s l)`
}

