# @weser/context

<img alt="npm version" src="https://badge.fury.io/js/@weser%2Fcontext.svg"> <img alt="npm downloads" src="https://img.shields.io/npm/dm/@weser/context.svg"> <a href="https://bundlephobia.com/result?p=@weser/context@latest"><img alt="Bundlephobia" src="https://img.shields.io/bundlephobia/minzip/@weser/context.svg"></a>

## Installation

```sh
# npm
npm i --save @weser/context
# yarn
yarn add @weser/context
# pnpm
pnpm add @weser/context
```

## Documentation

### `createContext<T>`

#### Parameters

| Parameter    | Type      | Default | Description                                              |
| ------------ | --------- | ------- | -------------------------------------------------------- |
| defaultValue | `T`       | `null`  | The default value for when no provider is used           |
| name         |  `string` | `""`    | (Optional) A name for the context used in error messages |

```tsx
import { createContext } from '@weser/context'

type Theme = 'light' | 'dark'

const [useTheme, ThemeProvider] = createContext<Theme>('light', 'theme')

function App({ children }) {
  return <ThemeProvider value="dark">{children}</ThemeProvider>
}

function Component() {
  const theme = useTheme()

  return (
    <div style={{ backgroundColor: theme === 'dark' ? 'black' : 'white' }}>
      Hello
    </div>
  )
}
```

## License

@weser/context is licensed under the [MIT License](http://opensource.org/licenses/MIT).<br>
Documentation is licensed under [Creative Common License](http://creativecommons.org/licenses/by/4.0/).<br>
Created with ♥ by [@robinweser](http://weser.io).
