export default function rotate(color: string, degrees: number) {
  return `hsl(from ${color} calc(h + ${degrees}) s l)`
}

