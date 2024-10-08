import { useEffect, useRef } from 'react'
import { ElementId } from './types'
import useDndContext from './useDndContext'

type Filter<T> = (value: any, key: string, object: T) => boolean
function objectFilter<T extends Object>(obj: T, filter: Filter<T>) {
  const filteredObj: any = {}

  for (const key in obj) {
    const value = obj[key]

    if (filter(value, key, obj)) {
      filteredObj[key] = value
    }
  }

  return filteredObj as T
}
export default function useDroppable({
  id,
  disabled = false,
}: {
  id: ElementId
  disabled?: boolean
}) {
  const { activeOver, setDropzones } = useDndContext()
  const ref = useRef<HTMLElement>(null)

  const isOver = activeOver === id

  useEffect(() => {
    if (ref.current) {
      if (disabled) {
        setDropzones((dropzones) =>
          objectFilter(dropzones, (_, key) => key !== id)
        )
      } else {
        setDropzones((dropzones) => ({
          ...dropzones,
          [id]: ref.current,
        }))
      }
    }
  }, [ref, disabled])

  return {
    ref,
    isOver,
  }
}
