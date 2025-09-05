import Image from 'next/image'

import { Box } from '@/components/system/core'

import theme from '@/utils/theme'

type Props = {
  username?: string
  size?: number
  image?: string
  disabled?: boolean
}

export default function Avatar({
  size = 40,
  username,
  image,
  disabled = false,
}: Props) {
  const defaultImage = username
    ? `https://api.dicebear.com/9.x/initials/jpg?seed=${username}`
    : 'https://api.dicebear.com/9.x/notionists-neutral/jpg?seed=Dusty'

  return (
    <Box
      width={size}
      height={size}
      style={{
        borderRadius: '50%',
        overflow: 'hidden',
        opacity: disabled ? 0.5 : 1,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.colors.border,
      }}>
      <Image
        width={size}
        height={size}
        src={image || defaultImage}
        alt={username + "'s Avatar"}
        style={{ objectFit: 'cover' }}
      />
    </Box>
  )
}
