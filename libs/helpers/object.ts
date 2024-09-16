export function clone<T>(value: T, exceptKey: string[] = []): T {
  const obj = JSON.parse(JSON.stringify(value));
  if (exceptKey.length > 0) {
    exceptKey.forEach((key): void => {
      if (obj[key] !== undefined) {
        delete obj[key];
      }
    });
  }
  return obj;
}
