'use client'
import React from 'react'
import { Moon, Sun } from 'lucide-react'

import ActionButton from '@/components/system/ActionButton'
import IconButton from '@/components/system/IconButton'

import useMode from '@/hooks/useMode'

type Props = {
  variant?: 'default' | 'icon'
}
export default function ThemeToggle({ variant = 'default' }: Props) {
  const mode = useMode()

  if (variant === 'icon') {
    return (
      <IconButton
        variant="function"
        icon={mode === 'dark' ? Sun : Moon}
        label={`Switch to ${mode === 'dark' ? 'Light' : 'Dark'}`}
        action={() =>
          window.__setPreferredTheme(mode === 'dark' ? 'light' : 'dark')
        }
      />
    )
  }

  return (
    <ActionButton
      size="small"
      variant="function"
      icon={mode === 'dark' ? Sun : Moon}
      action={() =>
        window.__setPreferredTheme(mode === 'dark' ? 'light' : 'dark')
      }>
      Switch to {mode === 'dark' ? 'Light' : 'Dark'}
    </ActionButton>
  )
}
