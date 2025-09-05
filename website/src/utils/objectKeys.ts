export default function objectKeys<T extends Record<string, any>>(object: T) {
  return Object.keys(object) as Array<keyof T>
}
