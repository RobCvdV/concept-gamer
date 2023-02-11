export const whenUndefined =
  <T extends any, IF extends T | undefined>(
    make: PromiseLike<T> | (() => PromiseLike<T>)
  ) =>
  (item: IF): T | PromiseLike<T> =>
    item === undefined
      ? typeof make === "function"
        ? (make as Function)()
        : make
      : item;
