import { pipe, curryN } from 'ramda';

export default function pipeN(fn, ...functions) {
  if (!fn) throw Error('Provide a least one function.');

  const { length } = fn;
  const f = pipe(fn, ...functions);

  return curryN(length, (...args) => f(...args));
}
