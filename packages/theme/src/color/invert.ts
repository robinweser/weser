export default function invert(color: string) {
  return `hsl(from ${color} calc(h + 180) s calc(100% - l))`
}

