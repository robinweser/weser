'use client'
import { ArrowUp } from 'lucide-react'

import ActionButton from '@/components/system/ActionButton'

export default function BackToTop() {
  return (
    <ActionButton
      icon={ArrowUp}
      variant="control"
      intent="neutral"
      action={() => {
        // reset first to make sure the page actually scrolls to the correct position
        window.location.hash = ''
        window.location.hash = 'top'
      }}>
      Back to top
    </ActionButton>
  )
}
