export default function getFallbackVariable(property: string, value: string) {
  return '--' + property + '-' + value
}
