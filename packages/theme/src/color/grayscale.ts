export default function grayscale(color: string) {
  return `hsl(from ${color} h 0% l)`
}

export { grayscale as greyscale }
