'use client'
import { createContext, useState, useEffect, PropsWithChildren } from 'react'

import { T_Theme } from '@/types/theming'

export const ModeContext = createContext<T_Theme>('light')

export default function ModeProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<T_Theme>('light')

  useEffect(() => {
    setMode(window.__theme)
    window.__onThemeChange = () => setMode(window.__theme)
  }, [])

  return <ModeContext.Provider value={mode}>{children}</ModeContext.Provider>
}
