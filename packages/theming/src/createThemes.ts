import createTheme, {
  defaultShouldTransformValue,
  SingleConfig,
} from './createTheme.js'
import { Tokens } from './types.js'

type ThemeMap<T> = {
  [name: string]: T
}

type MutliConfig = {
  shouldTransformValue?: SingleConfig['shouldTransformValue']
  getSelector?: (name: string) => string
}

const defaultGetSelector = (name: string) => '.' + name

export default function createThemes<T extends Tokens>(
  themes: ThemeMap<T>,
  config: MutliConfig = {}
): [T, string] {
  const {
    shouldTransformValue = defaultShouldTransformValue,
    getSelector = defaultGetSelector,
  } = config

  let css = ''
  let theme

  for (const name in themes) {
    const [_theme, _css] = createTheme(themes[name], {
      shouldTransformValue,
      selector: getSelector(name),
    })

    css += _css
    theme = _theme
  }

  return [theme as T, css]
}
