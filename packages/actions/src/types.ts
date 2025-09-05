type IsAny<T> = 0 extends 1 & T ? true : false

export type T_ActionResponse<T = unknown> =
  IsAny<T> extends true ? [string] | [null, T?] : [string] | [null, T]
