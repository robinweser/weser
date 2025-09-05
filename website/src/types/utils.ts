export type Nullable<T> = T | null

type RequireNonNullable<T> = {
  [K in keyof T]-?: null extends T[K] ? never : boolean extends T[K] ? never : K
}[keyof T]

type ExtractOptional<T> = {
  [K in keyof T as null extends T[K]
    ? K
    : boolean extends T[K]
      ? K
      : never]?: T[K]
}

export type NullableOptional<T> = ExtractOptional<T> &
  Pick<T, RequireNonNullable<T>>

export type DistributiveOmit<T, TOmitted extends PropertyKey> = T extends any
  ? Omit<T, TOmitted>
  : never
