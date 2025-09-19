'use client'
import React, { PropsWithChildren, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

import { Box, Text } from '@/components/system/core'
import theme from '@/utils/theme'

type Props = {
  summary: string
  defaultExpanded?: boolean
}
export default function Accordion({
  summary,
  children,
  defaultExpanded = false,
}: PropsWithChildren<Props>) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  const Icon = isExpanded ? ChevronUp : ChevronDown

  return (
    <Box
      paddingBottom={isExpanded ? 6 : 0}
      gap={isExpanded ? 1 : 0}
      style={{
        ':focus-within': theme.focusRing,
      }}>
      <Box
        as="button"
        onClick={handleToggle}
        direction="row"
        alignItems="center"
        justifyContent="center"
        paddingBlock={2}
        width="100%"
        gap={4}
        style={{
          outline: 0,
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          font: 'inherit',
          color: 'inherit',
        }}>
        <Box grow={1} shrink={1}>
          <Text weight={500} align="left">
            {summary}
          </Text>
        </Box>
        <Box shrink={0}>
          <Icon
            color={theme.colors.foreground.secondary}
            style={{ marginRight: -2, pointerEvents: 'none' }}
          />
        </Box>
      </Box>

      {isExpanded && <Box width="100%">{children}</Box>}
    </Box>
  )
}
