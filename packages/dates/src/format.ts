const PATTERN_REGEX = /(M|y|d|D|h|H|m|s|S|G|Z|P|a)+/g
const ESCAPE_REGEX = /\\"|"((?:\\"|[^"])*)"|(\+)/g

const optionNames = {
  y: 'year',
  M: 'month',
  d: 'day',
  D: 'weekday',
  S: 'fractionalSecondDigits',
  G: 'era',
  Z: 'timeZoneName',
  P: 'dayPeriod',
  a: 'hour12',
  h: 'hour',
  H: 'hour',
  m: 'minute',
  s: 'second',
} as const

const values = {
  y: ['numeric', '2-digit', undefined, 'numeric'],
  M: ['narrow', '2-digit', 'short', 'long'],
  d: ['numeric', '2-digit'],
  D: ['narrow', 'short', 'long'],
  S: [1, 2, 3],
  G: ['narrow', 'short', 'long'],
  Z: ['short', 'long'],
  P: ['narrow', 'short', 'long'],
  a: [true],
  h: ['numeric', '2-digit'],
  H: ['numeric', '2-digit'],
  m: ['numeric', '2-digit'],
  s: ['numeric', '2-digit'],
} as const

type PatternType = keyof typeof optionNames

type Config = {
  locale?: string
  timeZone?: string
}
export default function format(
  date: Date,
  pattern: string,
  config: Config = {}
) {
  return pattern
    .split(ESCAPE_REGEX)
    .filter((sub) => sub !== undefined)
    .map((sub, index) => {
      // keep escaped strings as is
      if (index % 2 !== 0) {
        return sub
      }

      return sub.replace(PATTERN_REGEX, (match) => {
        const type = match.charAt(0)

        return String(
          formatType(date, type as PatternType, match.length, config) || match
        )
      })
    })
    .join('')
}
function formatType(
  date: Date,
  type: PatternType,
  length: number,
  { locale, timeZone }: Config = {}
) {
  const option = optionNames[type]
  const value = values[type][length - 1]

  if (!value) {
    return
  }

  const options = {
    [option]: value,
    timeZone,
  }

  if (type === 'a') {
    return Intl.DateTimeFormat(locale, {
      ...options,
      hour: 'numeric',
    })
      .formatToParts(date)
      .pop()?.value
  }

  if (type === 'G' || type === 'Z') {
    return Intl.DateTimeFormat(locale, options).formatToParts(date).pop()?.value
  }

  if (type === 'H' || type === 'h') {
    return Intl.DateTimeFormat('en-GB', {
      ...options,
      hourCycle: type === 'H' ? 'h23' : 'h11',
    })
      .format(date)
      .toLocaleLowerCase()
      .replace(' am', '')
      .replace(' pm', '')
  }

  return padIf(
    ['m', 's'].includes(type) && value === '2-digit',
    Intl.DateTimeFormat(locale, options).format(date),
    2
  )
}

function padIf(condition: boolean, value: string | number, length: number) {
  if (typeof value === 'string') {
    return condition && length === 2 && parseInt(value) / 10 < 1
      ? '0' + value
      : value
  }

  return condition && length === 2 && value / 10 < 1 ? '0' + value : value
}
