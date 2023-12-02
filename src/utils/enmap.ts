import type { MathOps } from "enmap";
import DefaultEnmap from "enmap";

export class Enmap<
  K extends string = string,
  V = object,
  SV = unknown,
> extends DefaultEnmap<K, V, SV> {
  public ensure(key: K, defaultValue: Partial<V>): V {
    return super.ensure(key, defaultValue as V);
  }

  public get(key: K): V;
  public get<P extends Path<V>, D = GetFieldType<V, P>>(key: K, path: P): D;
  public get<P extends Path<V>, D = GetFieldType<V, P>>(key: K, path?: P): D {
    if (!path) return super.get(key) as D;
    else return super.get(key, path) as D;
  }

  public set(key: K, val: V): this;
  public set<P extends Path<V>, D = GetFieldType<V, P>>(
    key: K,
    val: D,
    path: P
  ): this;
  public set<P extends Path<V>, D = GetFieldType<V, P>>(
    key: K,
    val: D,
    path?: P
  ): this {
    if (!path) return super.set(key, val as any);
    else return super.set(key, val, path);
  }

  public push(key: K, val: V): this;
  public push<
    P extends Path<Matching<V, any[]>>,
    // @ts-expect-error typescript I know what I'm doing thank you
    D = GetFieldType<V, P>[number],
  >(key: K, val: D, path: P): this;
  public push<P extends Path<Matching<V, any[]>>, D = GetFieldType<V, P>>(
    key: K,
    val: D,
    path?: P
  ): this {
    if (!path) return super.push(key, val as any);
    else return super.push(key, val, path);
  }

  public math(key: K, operation: MathOps, operand: number): this;
  public math<P extends Path<Matching<V, number>>>(
    key: K,
    operation: MathOps,
    operand: number,
    path: P
  ): this;
  public math<P extends Path<Matching<V, number>>>(
    key: K,
    operation: MathOps,
    operand: number,
    path?: P
  ): this {
    if (!path) return super.math(key, operation, operand);
    else return super.math(key, operation, operand, path as any);
  }

  public delete(key: K): this;
  public delete<P extends Path<V>>(key: K, path: P): this;
  public delete<P extends Path<V>>(key: K, path?: P): this {
    if (!path) return super.delete(key);
    else return super.delete(key, path);
  }
}

// type helpers
type Primitive = null | undefined | string | number | boolean | symbol | bigint;

type IsTuple<T extends readonly any[]> = number extends T["length"]
  ? false
  : true;
type TupleKey<T extends readonly any[]> = Exclude<keyof T, keyof any[]>;
type ArrayKey = number;

type PathImpl<K extends string | number, V> = V extends Primitive
  ? `${K}`
  : `${K}` | `${K}.${Path<V>}`;

type Path<T> = T extends readonly (infer V)[]
  ? IsTuple<T> extends true
    ? {
        [K in TupleKey<T>]-?: PathImpl<K & string, T[K]>;
      }[TupleKey<T>]
    : PathImpl<ArrayKey, V>
  : {
      [K in keyof T]-?: PathImpl<K & string, T[K]>;
    }[keyof T];

//   ^?

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

type Matching<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
};
