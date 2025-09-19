import { CSSProperties } from 'react'

type Key = `${number}%` | 'from' | 'to'
export type T_Keyframe = Partial<Record<Key, CSSProperties>>
