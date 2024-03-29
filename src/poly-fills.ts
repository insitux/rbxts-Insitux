export const isObj = (x: unknown): x is { [index: string]: unknown } =>
  typeIs(x, "table");

export const isStr = (x: unknown): x is string => typeIs(x, "string");

function combine<T extends defined>(arr: (T[] | T)[]): T[] {
  const _result: T[] = [];
  const _combine = (arr: T[]) => {
    arr.forEach((element) => {
      if (isArray(element)) {
        _combine(element as unknown as T[]);
      } else {
        _result.push(element);
      }
    });
  };

  _combine(arr as T[]);
  return _result;
}

export const toNum = (x: unknown): number => {
  if (x === true) return 1;
  if (x === false) return 0;

  if (tonumber(tostring(x)) !== undefined) return tonumber(x) as number;
  else return 1 / 0;
};

export const slice = <T extends defined>(
  arr: T[],
  start?: number,
  _end?: number,
) => {
  const result: T[] = [];

  if (!start && !_end) {
    arr.forEach((element) => result.push(element));
  } else if (start !== undefined) {
    const cond = _end !== undefined ? _end : arr.size();
    for (let i = start; i < cond; i++) {
      result.push(arr[i]);
    }
  }

  return result;
};

export const trim = (lol: string) => {
  while (lol.sub(1, 1) === " " || lol.sub(1, 1) === "\n") {
    lol = lol.sub(2, -1);
  }

  while (lol.sub(-1, -1) === " " || lol.sub(-1, -1) === "\n") {
    lol = lol.sub(1, -2);
  }

  return lol;
};

export const splice = <T extends defined>(
  arr: T[],
  start: number,
  numDel?: number,
) => {
  const cond = numDel !== undefined ? numDel : arr.size();
  const deleted: T[] = [];

  for (let i = 0; i < cond; i++) {
    const item = arr.remove(start);
    if (item) deleted.push(item);
  }

  return deleted;
};

export const objKeys = (x: { [index: string]: unknown }): string[] => {
  const arr: string[] = [];

  for (const [index, value] of pairs(x)) {
    arr.push(index as string);
  }

  return arr;
};

export const isNum = (x: unknown): x is number =>
  x !== "" && tonumber(tostring(x)) !== undefined;
export const flat = <T extends defined>(arr: T[][]): T[] => combine<T>(arr); //e.g. [[0], [1], []] => [0, 1]
export const has = (x: string | defined[], y: defined) => {
  if (typeIs(x, "string")) {
    return x.find(y as string, 1, true) !== undefined;
  } else {
    return x.includes(y);
  }
};

export const randNum = (a: number, b: number) => new Random().NextNumber(a, b);
export const randInt = (a: number, b: number) => math.floor(randNum(a, b));
export const concat = <T extends defined>(a: T[], b: T[]): T[] => {
  const result: T[] = [];
  a.forEach((element) => result.push(element));
  b.forEach((element) => result.push(element));
  return result;
};
export const sub = (x: string, s: string): boolean =>
  x.find(s, undefined, true)[0] !== undefined;
export const substr = (str: string, start: number, length?: number) => {
  return length !== undefined
    ? length > 0
      ? str.sub(start + 1, start + length)
      : ""
    : str.sub(start + 1);
};
export const strIdx = (str: string, idx: number) => str.sub(idx + 1, idx + 1);
export const starts = (str: string, x: string) => subIdx(str, x) === 0;
//TODO: this needs to check more than one character
export const ends = (str: string, x: string): boolean => str.sub(-1, -1) === x;
export const replace = (str: string, what: string, to: string): string =>
  str.split(what).join(to);
export const rreplace = (str: string, what: string, to: string): string =>
  string.gsub(str, what, to)[0];
export const sortBy = <T extends defined>(
  arr: T[],
  by: (a: T, b: T) => number,
) =>
  arr.sort((a, b) => {
    const res = by(a, b);
    return res === 1;
  });

export const reverse = <T>(arr: T[]) => {
  const reversed = [];

  for (let i = arr.size(); i >= 0; i++) {
    const v = arr[i];
    reversed.push(v);
  }

  return reversed;
};

export const push = <T extends defined>(arr: T[], add: T[]) => {
  add.forEach((element) => arr.push(element));
};

export const subIdx = (a: string, b: string) => {
  const found = string.find(a, b, 1, true)[0];
  return found ? found - 1 : -1;
};

export const range = (len: number) => {
  const res: number[] = [];

  for (let i = 0; i < len; i++) {
    res.push(i);
  }

  return res;
};
export const len = (arr: unknown[]) => arr.size();
export const slen = (str: string) => str.size();
export const padEnd = (s: string, size: number) => {
  while (s.size() < size) s = s + " ";
  return s;
};

export const tan = math.tan;
export const sqrt = math.sqrt;
export const sin = math.sin;
export const round = math.round;
export const min = math.min;
export const max = math.max;
export const floor = math.floor;
export const cos = math.cos;
export const ceil = math.ceil;
export const abs = math.abs;
export const sign = math.sign;
export const sinh = math.sinh;
export const cosh = math.cosh;
export const tanh = math.tanh;
export const asin = math.asin;
export const acos = math.acos;
export const atan = math.atan;
export const pi = math.pi;

export const isArray = (x: unknown): x is unknown[] => {
  if (type(x) === "table") {
    for (const [index, value] of pairs(
      x as { [index: string | number]: unknown },
    )) {
      if (type(index) !== "number") return false;
    }
    return true;
  } else {
    return false;
  }
};

export const logn = (x: number) => math.log(x);
export const log2 = (x: number) => math.log(x, 2);
export const log10 = math.log10;

export const upperCase = string.upper;
export const lowerCase = string.lower;

export const trimStart = (str: string) => {
  let res = str;
  while (res.sub(1, 1) === " ") res = res.sub(2, -1);
  return res;
};
export const trimEnd = (str: string) => {
  let res = str;
  while (res.sub(-1, -1) === " ") res = res.sub(1, -2);
  return res;
};

export const charCode = (str: string): number => utf8.codes(str)()[0];
export const codeChar = (num: number): string => utf8.char(num);

export const getTimeMs = () => tick() * 1000;
