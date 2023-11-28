import DefaultEnmap from "enmap";

export class Enmap<
  K extends string = string,
  V = any,
  SV = unknown
> extends DefaultEnmap<K, V, SV> {
  public get<P extends Paths<V>, D = GetFieldType<V, P>>(
    key: K,
    path: P | null = null
  ): D {
    if (!path) return super.get(key) as D;
    else return super.get(key, path) as D;
  }

  public set<P extends Paths<V>, D = GetFieldType<V, P>>(
    key: K,
    val: D,
    path: P | null = null
  ): this {
    if (!path) return super.set(key, val as any);
    else return super.set(key, val, path);
  }
}

// type helpers
type Paths<T> = T extends object
  ? {
      [K in keyof T]: `${Exclude<K, symbol>}${"" | `.${Paths<T[K]>}`}`;
    }[keyof T]
  : never;

type GetIndexedField<T, K> = K extends keyof T
  ? T[K]
  : K extends `${number}`
  ? "0" extends keyof T
    ? undefined
    : number extends keyof T
    ? T[number]
    : undefined
  : undefined;

type FieldWithPossiblyUndefined<T, Key> =
  | GetFieldType<Exclude<T, undefined>, Key>
  | Extract<T, undefined>;

type IndexedFieldWithPossiblyUndefined<T, Key> =
  | GetIndexedField<Exclude<T, undefined>, Key>
  | Extract<T, undefined>;

export type GetFieldType<T, P> = P extends `${infer Left}.${infer Right}`
  ? Left extends keyof T
    ? FieldWithPossiblyUndefined<T[Left], Right>
    : Left extends `${infer FieldKey}[${infer IndexKey}]`
    ? FieldKey extends keyof T
      ? FieldWithPossiblyUndefined<
          IndexedFieldWithPossiblyUndefined<T[FieldKey], IndexKey>,
          Right
        >
      : undefined
    : undefined
  : P extends keyof T
  ? T[P]
  : P extends `${infer FieldKey}[${infer IndexKey}]`
  ? FieldKey extends keyof T
    ? IndexedFieldWithPossiblyUndefined<T[FieldKey], IndexKey>
    : undefined
  : undefined;
