import { useState } from 'react'

import useStoreFactory, { T_Middleware } from './useStoreFactory'

export default function useStoreWithMiddleware<Model>(
  middleware: Array<T_Middleware<Model>> = []
) {
  return useStoreFactory<Model>(useState<Model>)(middleware)
}
