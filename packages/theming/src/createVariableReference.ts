export default function createVariableReference(
  name: string,
  fallbackValue?: string
): [`--${string}`, string] {
  const variable = `--${name}` as const

  if (fallbackValue) {
    return [variable, `var(${variable}, ${fallbackValue})`]
  }

  return [variable, `var(${variable})`]
}
