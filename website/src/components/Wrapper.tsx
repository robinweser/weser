import React, { PropsWithChildren } from 'react'
import { LayerContextProvider } from '@weser/layers'

import { Box } from '@/components/system/core'
import ModeProvider from '@/components/ModeProvider'
import Header from './Header'
import ScrollBlockingLayer from './ScrollBlockingLayer'

export default function Wrapper({ children }: PropsWithChildren) {
  return (
    <LayerContextProvider>
      <ModeProvider>
        <ScrollBlockingLayer>
          <Box minHeight="100vh">
            <Header />
            <Box
              grow={1}
              as="main"
              id="main"
              role="main"
              aria-label="Main content">
              {children}
            </Box>
          </Box>
        </ScrollBlockingLayer>
      </ModeProvider>
    </LayerContextProvider>
  )
}
