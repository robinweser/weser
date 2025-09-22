'use client'
import { Edit } from 'lucide-react'

import ActionButton from '@/components/system/ActionButton'
import Bleed from '@/components/system/Bleed'

type Props = {
  path: string
}
export default function EditThisPage({ path }: Props) {
  return (
    <Bleed size={3.5}>
      <ActionButton
        variant="function"
        intent="neutral"
        icon={Edit}
        // @ts-ignore
        target="_blank"
        action={`https://github.com/robinweser/weser/edit/main/website/docs/${path}.mdx`}>
        Edit this page
      </ActionButton>
    </Bleed>
  )
}
