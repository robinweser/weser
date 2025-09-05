import { createKeyframe } from '@weser/keyframes'

import { Box } from '@/components/system/core'

const [animationName, node] = createKeyframe({
  to: {
    transform: 'rotate(360deg)',
  },
})

type Props = {
  size?: number
  color?: string
  thickness?: number
}
export default function Loading({
  size = 36,
  thickness = 3,
  color = 'currentColor',
}: Props) {
  return (
    <>
      {node}
      <Box
        as="svg"
        width={size}
        height={size}
        fill="none"
        strokeWidth={thickness}
        stroke={color}
        viewBox="0 0 40 40"
        style={{
          transformOrigin: 'center',
          animationDuration: '1300ms',
          animationName,
          animationIterationCount: 'infinite',
          animationTimingFunction: 'linear',
        }}>
        <circle
          r={20 - thickness}
          cx="20"
          cy="20"
          strokeDasharray="70 120"
          strokeLinecap="round"
        />
      </Box>
    </>
  )
}
