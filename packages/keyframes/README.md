# @weser/keyframes

<img alt="npm version" src="https://badge.fury.io/js/@weser%2Ferrors.svg"> <img alt="npm downloads" src="https://img.shields.io/npm/dm/@weser/keyframes.svg"> <a href="https://bundlephobia.com/result?p=@weser/keyframes@latest"><img alt="Bundlephobia" src="https://img.shields.io/bundlephobia/minzip/@weser/keyframes.svg"></a>

## Installation

```sh
# npm
npm i --save @weser/keyframes
# yarn
yarn add @weser/keyframes
# pnpm
pnpm add @weser/keyframes
```

## Documentation

### invariant

#### Parameters

| Parameter | Type      | Description                      |
| --------- | --------- | -------------------------------- |
| condition | `boolean` | A condition that throws if false |
| message   |  string   | The error message that is thrown |

```tsx
import { invariant } from '@weser/keyframes'

function login(email: string, password: string) {
  invariant(password.length < 8, 'The password needs to be at least 8 letters.')

  // do actual login
}
```

## License

@weser/keyframes is licensed under the [MIT License](http://opensource.org/licenses/MIT).<br>
Documentation is licensed under [Creative Common License](http://creativecommons.org/licenses/by/4.0/).<br>
Created with ♥ by [@robinweser](http://weser.io).
