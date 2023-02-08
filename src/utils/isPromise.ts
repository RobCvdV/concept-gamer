export const isPromise = <C>(p: C | Promise<C> | any): p is Promise<C> =>
  p && typeof p.then === 'function';
