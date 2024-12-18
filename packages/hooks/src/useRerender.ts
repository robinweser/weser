import { useEffect, useState } from 'react'

export default function useRerender(updateInterval: number = 60 * 1000) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, updateInterval)

    return () => clearInterval(interval)
  }, [])

  return time
}
