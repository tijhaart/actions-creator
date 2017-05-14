import R from 'ramda';
import prefix from './prefix';

const nsPrefix = prefix('/');
const actionPrefix = prefix('_');

const toActionMetaObj = R.map(
  R.pipe(
    R.toUpper,
    R.applySpec({
      type: R.identity,
      fnName: R.compose(
        R.replace(/[_.-](\w|$)/g, R.compose(R.toUpper, R.nthArg(1))),
        R.toLower
      )
    })
  )
);

const nsTypeProp = R.lensProp('nsType');

// Similar to: `R.set(R.lensProp('x'), 'foo')({}) =>> { x: 'foo' }` but instead 'foo' is a 'derived?' value.
const setPropNsType = (ns) => R.converge(
  R.set(nsTypeProp),
  [
    R.pipe(R.prop('type'), nsPrefix(ns)),
    R.identity
  ]
);

const stateTypesToActionList = R.curry(function stateTypesToActionList(ns, actionType) {
  return R.pipe(
    // ['a', 'b'] => ['prefix_a', 'prefix_b']
    R.map(actionPrefix(actionType)),
    R.prepend(actionType),

    toActionMetaObj,
    R.map(setPropNsType(ns)),
  );
});

/**
 * Create multiple action creators from a single action type.
 * @param  {String} ns                                  namespace
 * @param  {String} actionType
 *                                                      creator is called.
 * @param  {String[]} [stateTypes=defaultStateTypes }]  Create action creators from actionType + stateType
 * @return {Object[]}                                   { type: String, nsType: String, fnName: String }
 */
export default function createActions({ ns, actionType, stateTypes = ['done', 'error'] }) {
  return stateTypesToActionList(ns, actionType)(stateTypes);
}
