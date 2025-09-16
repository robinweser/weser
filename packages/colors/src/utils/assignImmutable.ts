export default function assignImmutable(
  base: Record<string, any>,
  extend: Record<string, any>
) {
  return Object.assign({}, base, extend)
}
