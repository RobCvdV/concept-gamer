type InjectedLogger<T> = (i: T) => T;

export const whenDefined =
  <T>(log: string | ((item: T) => T)): InjectedLogger<T> =>
  (item: T): T => {
    if (item !== undefined)
      typeof log === "string" ? console.log(log) : log(item);
    return item;
  };
