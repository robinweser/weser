import { useState } from 'react'

export default function useList<T>(defaultList: Array<T> = []) {
  const [list, setList] = useState<Array<T>>(defaultList)

  function set(list: Array<T>) {
    setList(list)
  }
  function add(item: T) {
    setList([...list, item])
  }
  function removeAt(index: number) {
    setList(list.filter((_, i) => i !== index))
  }
  function updateAt(index: number, item: T) {
    setList(list.map((entry, i) => (i === index ? item : entry)))
  }
  function insertAt(index: number, item: T) {
    setList([...list.slice(0, index), item, ...list.slice(index)])
  }
  function clear() {
    setList([])
  }

  const actions = {
    set,
    add,
    removeAt,
    updateAt,
    insertAt,
    clear,
  }

  return [list, actions] as const
}
