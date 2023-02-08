type Constructor<T = unknown> = {new (...args: any[]): T};
type Obj = NonNullable<{[k: string]: any}>;

export function ensure<S extends Obj, C extends Obj>(
  ctor: Constructor<C>,
  thing?: S | undefined extends Obj ? S : undefined,
  defaultThing?: never,
): C | undefined;
export function ensure<S extends X, X extends Obj>(
  ctor: Constructor<X>,
  thing: S,
  defaultThing?: never,
): X;
export function ensure<S extends Obj, X extends Obj>(
  ctor: Constructor<X>,
  thing: S,
  defaultThing?: never,
): X;

export function ensure<S extends Obj, X extends Obj>(
  ctor: Constructor<X>,
  thing: S | undefined,
  defaultThing: S,
): X;
export function ensure<X extends Obj>(
  ctor: Constructor<X>,
  thing: Obj | undefined,
  defaultThing: Obj,
): X;
export function ensure<X extends Obj>(
  ctor: Constructor<X>,
  thing?: Obj,
  defaultThing?: Obj,
): X | undefined;

export function ensure<X extends Obj>(
  ctor: Constructor<X>,
  thing?: unknown,
  defaultThing?: unknown,
): X | undefined {
  const it = thing || defaultThing;
  return !it ? undefined : it instanceof ctor ? (it as X) : (new ctor(it) as X);
}
