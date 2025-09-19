import {
  ComponentProps,
  ElementType,
  PropsWithChildren,
  ReactNode,
} from 'react'
import { LucideIcon } from 'lucide-react'

import { Box, El, Text } from './core'
import Loading from './Loading'

import { inputStyle, T_InputVariant } from '@/utils/inputs'
import theme from '../../utils/theme'

export type T_InputProps = {
  variant?: T_InputVariant
  valid?: boolean
  disabled?: boolean
  loading?: boolean
}
export type T_InputContainerProps = {
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  prefix?: ReactNode
  suffix?: ReactNode
  focus?: ':focus-visible' | ':focus' | ':focus-within'
}

type Props<T extends ElementType> = T_InputProps &
  T_InputContainerProps &
  Omit<ComponentProps<typeof Box<T>>, 'prefix'>
export default function InputContainer<T extends ElementType>({
  variant = 'default',
  valid = true,
  loading = false,
  disabled = false,
  prefix,
  suffix,
  icon: Icon,
  iconPosition = 'right',
  style,
  focus = ':focus-visible',
  children,
  ...props
}: PropsWithChildren<Props<T>>) {
  const supportsPrefix = variant !== 'function'
  const hasPrefixOrSuffix = !!(supportsPrefix && (prefix || suffix))

  const variantStyle = inputStyle({ variant, valid, loading, disabled }, focus)

  return (
    <Box
      {...props}
      style={[
        variantStyle,
        {
          extend: [
            {
              condition: hasPrefixOrSuffix,
              style: {
                paddingBlock: 0,
              },
            },
          ],
        },
        style,
      ]}>
      <Box
        grow={1}
        shrink={1}
        direction="row"
        alignItems="center"
        maxWidth="100%"
        style={{ lineHeight: 1.2 }}>
        {prefix && supportsPrefix && (
          <Box
            bg="black"
            alignItems="center"
            justifyContent="center"
            marginRight={2}
            height="100%"
            minHeight={variantStyle.minHeight - 2}
            style={{
              paddingBlock: variantStyle.paddingBlock,
              marginInlineStart: -(variantStyle.paddingInline || 0),
              paddingLeft: variantStyle.paddingInline,
              paddingRight: 8,
            }}>
            <Text color="white" height={1.2}>
              {prefix}
            </Text>
          </Box>
        )}
        <Box
          justifyContent="space-between"
          grow={1}
          shrink={1}
          direction="row"
          alignItems="center"
          maxWidth="100%"
          style={{
            lineHeight: 1.2,
            extend: {
              condition: hasPrefixOrSuffix,
              style: { paddingBlock: variantStyle.paddingBlock },
            },
          }}>
          {Icon && iconPosition === 'left' && (
            <Icon
              size={20}
              color={theme.colors.foreground.secondary}
              style={{
                flexShrink: 0,
                marginRight: 8,
                strokeWidth: 1.5,
                pointerEvents: 'none',
              }}
            />
          )}
          {children}
          {Icon && iconPosition === 'right' && (
            <Icon
              size={20}
              color={theme.colors.foreground.secondary}
              style={{
                flexShrink: 0,
                marginLeft: 8,
                strokeWidth: 1.5,
                pointerEvents: 'none',
              }}
            />
          )}
        </Box>
        {suffix && supportsPrefix && (
          <Box
            bg="black"
            alignItems="center"
            justifyContent="center"
            marginLeft={2}
            height="100%"
            minHeight="auto"
            minHeight={variantStyle.minHeight - 2}
            style={{
              paddingBlock: variantStyle.paddingBlock,
              marginInlineEnd: -(variantStyle.paddingInline || 0),
              paddingRight: variantStyle.paddingInline,
              paddingLeft: 8,
            }}>
            <Text color="white" height={1.2}>
              {suffix}
            </Text>
          </Box>
        )}
      </Box>
      {loading && (
        <El as="span" style={{ position: 'absolute' }}>
          <Loading
            color={theme.colors.foreground.primary}
            size={variant === 'inline' ? 24 : 30}
          />
        </El>
      )}
    </Box>
  )
}
