type Struct = {toJSON(): any};
type Value<T = any> = {toJSON(): any; value: T};
type EasyObject = Struct | Value<any>;

type OptionalKeys<T> = {
  [K in keyof T]: T[K] extends T[K] | undefined ? K : never;
}[keyof T];

type NiceIntersection<S, T> = {[K in keyof (S & T)]: (S & T)[K]};

type ValueTypes = string | number | boolean | symbol | undefined | Array<any>;

type IsValueType<K extends keyof T, T> = T[K] extends ValueTypes | EasyObject ? K : never;

type ToTypedJsonSingle<T> = T extends Value
  ? NonNullable<T['value']>
  : T extends Struct | (Struct | undefined)
  ? TypedJson<T>
  : T;

type ToJsonType<K extends keyof T, T> = T[K] extends (infer IT)[]
  ? Array<ToTypedJsonSingle<IT>>
  : ToTypedJsonSingle<T[K]>;

export type TypedJson<C extends EasyObject | undefined> = Omit<
  NiceIntersection<
    {
      -readonly [K in OptionalKeys<C> as IsValueType<K, C>]+?: ToJsonType<K, C>;
    },
    {
      -readonly [K in keyof C as IsValueType<K, C>]: ToJsonType<K, C>;
    }
  >,
  'state' | 'isValid' | 'created' | 'lastModified'
>;

type ToTypedStateSingle<T> = T extends Value
  ? NonNullable<T['value']> | T
  : T extends Struct | (Struct | undefined)
  ? TypedJson<T> | T
  : T;

type ToStateType<K extends keyof T, T> = T[K] extends (infer IT)[]
  ? Array<ToTypedStateSingle<IT>>
  : ToTypedStateSingle<T[K]>;

export type TypedState<C extends EasyObject | undefined> = Omit<
  NiceIntersection<
    {
      -readonly [K in OptionalKeys<C> as IsValueType<K, C>]+?: ToStateType<K, C>;
    },
    {
      -readonly [K in keyof C as IsValueType<K, C>]: ToStateType<K, C>;
    }
  >,
  'state' | 'isValid' | 'created' | 'lastModified'
>;
//
// class Test {
//   public arr: Test[] = [];
//   public lst: List<Test> = toList<Test>();
//   readonly x: number = 1;
//   readonly y: string = 'y';
//   readonly z?: Test;
//
//   toJSON() {
//     return {};
//   }
// }
//
// type RE = TypedJson<Test>;
// type ST = TypedState<Test>;
// const re: RE = {
//   x: 3,
//   y: 'e',
//   arr: [],
//   lst: [],
//   z: {
//     x: 3,
//     y: 'e',
//   },
// };
// const ty: ST = {
//   x: 3,
//   y: 'e',
//   arr: [new Test()],
//   z: new Test(),
// };
