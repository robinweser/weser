'use client'
import { ComponentProps, PropsWithChildren, Ref } from 'react'
import NextLink from 'next/link'

import El, { ElProps } from './El'
import { T_StyleProp } from './core'

type LinkAction = string
type ClickAction = ComponentProps<'button'>['onClick']

type ClickActionButtonProps = {
  action: ClickAction
  ref?: Ref<HTMLButtonElement>
} & ElProps<'button'>

type ClickFormButtonProps = {
  action?: undefined
  type: 'submit' | 'reset' | 'button'
  ref?: Ref<HTMLButtonElement>
} & ElProps<'button'>

type ClickButtonProps = ClickActionButtonProps | ClickFormButtonProps

type ClickLinkProps = {
  action: LinkAction
  disabled?: boolean
  ref?: Ref<HTMLAnchorElement>
} & ElProps<'a'>

type ClickProps = ClickLinkProps | ClickButtonProps
type Props = ClickProps

export default function Click({
  as,
  disabled,
  style,
  children,
  ...props
}: Props) {
  if (typeof props.action === 'string') {
    const { action, target, ...rest } = props
    const rel = target === '_blank' ? 'noreferrer noopener' : undefined

    const additionalProps = {
      href: !disabled ? action : undefined,
      style: [
        { boxSizing: 'border-box' },
        linkStyle(!!disabled),
        style,
      ] as T_StyleProp,
      rel,
      target,
    }

    return (
      <El
        as={LinkComponent}
        onTouchStart={() => {}}
        {...rest}
        {...additionalProps}>
        {children}
      </El>
    )
  }

  const { action, type = 'button', ...rest } = props
  const additionalProps = {
    onClick: !disabled ? action : undefined,
    style: [
      { boxSizing: 'border-box' },
      buttonStyle(!!disabled),
      style,
    ] as T_StyleProp,
    disabled,
    type,
  }

  return (
    <El as="button" onTouchStart={() => {}} {...rest} {...additionalProps}>
      {children}
    </El>
  )
}

function LinkComponent({
  children,
  href,
  target,
  ...props
}: PropsWithChildren<ComponentProps<'a'>>) {
  if (!href) {
    // @ts-ignore
    return <div {...props}>{children}</div>
  }

  if (typeof href === 'string' && href.startsWith('http')) {
    return (
      <a {...props} href={href} target={target} rel="noopener noreferrer">
        {children}
      </a>
    )
  }

  return (
    // @ts-ignore
    <NextLink href={href} target={target} {...props}>
      {children}
    </NextLink>
  )
}

const buttonStyle = (disabled: boolean) => ({
  backgroundColor: 'unset',
  backgroundImage: 'unset',
  margin: 0,
  padding: 0,
  textAlign: 'left',
  cursor: 'pointer',
  appearance: 'none',
  borderWidth: 0,
  touchAction: 'manipulation',
  color: 'inherit',

  // TODO: not supported
  // '::-moz-focus-inner': {
  //   borderWidth: 0,
  //   padding: 0,
  // },
  extend: [
    {
      condition: disabled,
      style: {
        cursor: 'not-allowed',
      },
    },
  ],
})

const linkStyle = (disabled: boolean) => ({
  textDecoration: 'none',
  color: 'inherit',
  extend: [
    {
      condition: disabled,
      style: {
        cursor: 'not-allowed',
      },
    },
    {
      condition: !disabled,
      style: {
        ':active': {
          color: 'unset',
        },
      },
    },
  ],
})
