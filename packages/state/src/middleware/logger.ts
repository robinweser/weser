import { T_Middleware, T_MiddlewareContext } from '../useStoreFactory'

type Config = {
  prefix?: string
}

const defaultConfig = {
  prefix: 'ALVERON:',
}
export default function logger(userConfig: Config = {}): T_Middleware {
  const config = {
    ...defaultConfig,
    ...userConfig,
  }

  function middleware(
    nextState: any,
    { action, payload, prevState }: T_MiddlewareContext
  ) {
    console.log(config.prefix + action, {
      payload,
      prevState,
      nextState,
    })

    return nextState
  }

  return {
    middleware,
  }
}
