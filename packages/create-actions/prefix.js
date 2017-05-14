import R, { curry, pipe } from 'ramda';
import pipeN from './pipe-n';

const isStringOrNumber = R.either(
  R.is(Number),
  R.is(String)
);

const prepForJoin = R.converge(
  R.join,
  [
    // Only use the joiner when the prefix is set
    R.ifElse(
      R.pipe(R.prop('prefix'), R.complement(R.isEmpty)),
      R.prop('joiner'),
      R.always('')
    ),
    R.ifElse(
      pipe(
        R.props(['joiner', 'prefix', 'value']),
        R.all(R.both(isStringOrNumber, R.complement(R.isNil)))
      ),
      R.props(['prefix', 'value']),
      pipe(
        R.prop('value'),
        R.unless(isStringOrNumber, R.always('')),
        R.of
      )
    )
  ]
);

export default pipeN(
  curry((joiner, prefix, value) => {
      return {
        joiner,
        prefix,
        value
      };
    }),
    prepForJoin
);
