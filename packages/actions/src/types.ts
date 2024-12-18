export type T_ActionResponse<T = any> = T extends any
  ? [string] | [null, T?]
  : [string] | [null, T]
