import { useEffect, useState } from 'react'

export default function useClientSide() {
  const [isClientSide, setClientSide] = useState(false)

  useEffect(() => setClientSide(true), [])

  return isClientSide
}
