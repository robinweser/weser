import { useContext } from 'react'

import { ModeContext } from '@/components/ModeProvider'

export default function useMode() {
  return useContext(ModeContext)
}
