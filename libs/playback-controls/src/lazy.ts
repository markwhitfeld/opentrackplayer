export function lazy<T>(fn: () => T): () => T {
  let value: T | undefined = undefined;
  return () => {
    if (!value) {
      value = fn();
    }
    return value;
  };
}
