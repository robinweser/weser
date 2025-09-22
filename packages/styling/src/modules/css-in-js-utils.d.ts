declare module 'css-in-js-utils' {
  type Style = Record<string, any>

  export function hyphenateProperty(property: string): string
  export function isUnitlessProperty(property: string): boolean
  export function assignStyle<T extends Style>(...style: Array<T>): T
  export function cssifyObject<T extends Style>(object: T): string
}
