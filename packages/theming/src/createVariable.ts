export default function createVariable(
  name: string,
  value: string
): [string, string] {
  const variable = `--${name}`
  const reference = `var(${variable})`
  const declaration = `${variable}:${value}`

  return [reference, declaration]
}
