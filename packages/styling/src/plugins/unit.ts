import { isUnitlessProperty as defaultIsUnitlessProperty } from 'css-in-js-utils'
import isPlainObject from 'isobject'

import { T_RawStyle, T_Style } from '../types.js'

type PropertyMap<T = T_RawStyle> = Partial<Record<keyof T, string>>

export default function unitPlugin<T = T_Style>(
  defaultUnit?: string,
  propertyMap?: PropertyMap,
  isUnitlessProperty?: (property: string) => boolean
) {
  return function unit(style: T) {
    return addUnit(style, defaultUnit, propertyMap, isUnitlessProperty)
  }
}

function addUnit<T = T_Style>(
  style: T,
  defaultUnit: string = 'px',
  propertyMap: PropertyMap = {},
  isUnitlessProperty = defaultIsUnitlessProperty
) {
  for (const property in style) {
    if (!isUnitlessProperty(property)) {
      const cssValue = style[property]
      const propertyUnit =
        propertyMap[property as keyof T_RawStyle] || defaultUnit

      if (isPlainObject(cssValue)) {
        // @ts-ignore
        style[property] = addUnit<T>(
          cssValue as T,
          defaultUnit,
          propertyMap,
          isUnitlessProperty
        )
      } else if (Array.isArray(cssValue)) {
        // @ts-ignore
        style[property] = cssValue.map((val) =>
          addUnitIfNeeded(val, propertyUnit)
        )
      } else {
        style[property] = addUnitIfNeeded(cssValue, propertyUnit)
      }
    }
  }

  return style
}

function addUnitIfNeeded(value: any, propertyUnit: string) {
  const valueType = typeof value

  if (
    (valueType === 'number' ||
      (valueType === 'string' && value == parseFloat(value))) &&
    value != 0
  ) {
    return value + propertyUnit
  }

  return value
}
