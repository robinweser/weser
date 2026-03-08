import createStyleNode from '../core/createStyleNode'

function getFlagSetup(flag: string) {
  return `--${flag}-0:initial;--${flag}-1: ;`
}

function getFlagUsage(property: string, flag: string) {
  const usage = `--${flag}-0: ;--${flag}-1:initial`

  if (property.startsWith('@')) {
    return `${property}{*{${usage}}}`
  }

  return `${property.replace(/&/gi, '*')}{${usage}}`
}

export function createFlagNode(
  flags: Record<string, string> = {},
  devMode: boolean
) {
  const flagsSetup = Object.values(flags).map(getFlagSetup)
  const flagsUsage = Object.entries(flags).map(([property, flag]) =>
    getFlagUsage(property, flag)
  )

  const join = devMode ? '\n' : ''
  const id = Object.values(flags).sort().join('_')
  const markup = `*{${flagsSetup.join(join)}}${join}${flagsUsage.join(join)}`
  return createStyleNode(id, markup)
}
