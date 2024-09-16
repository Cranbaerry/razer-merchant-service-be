import { clone } from './object';

type Selector<T> = keyof T | ((item: T) => string);

function retrieveValue<T>(element: T, key?: Selector<T>) {
  if (key === undefined) return element as any;
  return typeof key === 'function' ? key(element) : `${element[key]}`;
}

function sort<T>(
  arr: T[],
  option?: { selector?: Selector<T>; descending?: boolean } | undefined,
): T[] {
  const cloned = clone(arr);
  return cloned.sort((a, b) => {
    let keyA = retrieveValue(a, option?.selector);
    let keyB = retrieveValue(b, option?.selector);
    if (option?.descending) {
      const [a, b] = [keyA, keyB];
      keyA = b;
      keyB = a;
    }
    return keyA.localeCompare(keyB, 'en', {
      numeric: true,
      sensitivity: 'base',
    });
  });
}

function group<T>(arr: T[], by: Selector<T>): { [key: string]: T[] } {
  return arr.reduce<{ [key: string]: T[] }>((pv, v) => {
    const key = retrieveValue(v, by);
    pv[key] = [...(pv[key] || []), v];
    return pv;
  }, {});
}

function insertIfNotExist<T>(arr: T[], value: T): T[] {
  return !arr.includes(value) ? [...arr, value] : arr;
}

function remove<T>(arr: T[], target: T, selector?: Selector<T>) {
  return arr.filter(
    (v) => retrieveValue(v, selector) !== retrieveValue(target, selector),
  );
}

function insertOrUpdate<T>(arr: T[], value: T, selector?: keyof T): T[] {
  const index = arr.findIndex(
    (el) => retrieveValue(el, selector) === retrieveValue(value, selector),
  );
  if (index < 0) {
    return [...arr, value];
  }
  return arr.map((oldV, i) => (i !== index ? oldV : value));
}

function insertOrRemove<T>(arr: T[], value: T): T[] {
  const index = arr.findIndex((el) => el === value);
  if (index < 0) {
    return [...arr, value];
  }
  return arr.filter((_, i) => i !== index);
}

function* intersperse(iterable: any[], separator: any) {
  const iterator = iterable[Symbol.iterator]();
  const first = iterator.next();
  if (first.done) return;
  else yield first.value;
  for (const value of iterator) {
    yield separator;
    yield value;
  }
}

function chunk<T>(list: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < list.length; i += size) {
    chunks.push(list.slice(i, i + size > list.length ? list.length : i + size));
  }
  return chunks;
}

async function batch<T, Res>(
  callback: (data: T, index: number) => Promise<Res>,
  items: T[],
  size = 5,
): Promise<Res[]> {
  let position = 0;
  const results: Res[] = [];
  while (position < items.length) {
    const itemsForBatch = items.slice(position, position + size);
    const completed = await Promise.all(
      itemsForBatch.map((item) => callback(item, position)),
    );
    results.push(...completed);
    position += size;
  }
  return results;
}

export {
  sort,
  group,
  insertIfNotExist,
  remove,
  insertOrUpdate,
  insertOrRemove,
  intersperse,
  chunk,
  batch,
};
