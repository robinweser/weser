import { openDB } from 'idb'

export default function createIndexedStorage(database: string, table: string) {
  const dbPromise = openDB(database, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(table)) {
        db.createObjectStore(table)
      }
    },
  })

  async function setItem(key: string, value: any) {
    const db = await dbPromise
    await db.put(table, value, key)
  }

  async function getItem(key: string) {
    const db = await dbPromise
    return await db.get(table, key)
  }

  async function removeItem(key: string) {
    const db = await dbPromise
    await db.delete(table, key)
  }

  async function clear() {
    const db = await dbPromise
    await db.clear(table)
  }

  return {
    setItem,
    getItem,
    removeItem,
    clear,
  }
}
