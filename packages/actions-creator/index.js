import R from 'ramda';
import createActions from 'create-actions';
import createFSAC from './fsac';
import Duck from './Duck';

const middlewareWithDuck = R.compose(
  R.ifElse(
    R.length,
    R.apply(R.compose),
    () => R.identity
  ),
  R.curryN(2, (middlewares, duck) => R.map(m => m(duck), middlewares))
);

export default class ActionsCreator {
  static of(options) {
    return new ActionsCreator(options);
  }

  constructor(options = {}) {
    this.ns = options.ns;
    this._stateTypes = [].concat(options.stateTypes || ['done', 'error']);
    this._value = [].concat(options.value || []);
    this._middlewares = options.middlewares || [];
  }

  use(fn) {
    return ActionsCreator.of({
      ns: this.ns,
      value: [].concat(this._value),
      middlewares: this._middlewares.concat([fn]),
      stateTypes: this._stateTypes,
    });
  }

  action(type) {
    return ActionsCreator.of({
      ns: this.ns,
      value: this._value.concat(createActions({
        ns: this.ns,
        actionType: type,
        stateTypes: this._stateTypes,
      })),
      middlewares: this._middlewares,
    });
  }

  actionOnly(type) {
    return ActionsCreator.of({
      ns: this.ns,
      value: this._value.concat(createActions({
        ns: this.ns,
        actionType: type,
        stateTypes: [],
      })),
      middlewares: this._middlewares.concat()
    });
  }

  create() {
    const { _value, _middlewares, ns } = this;

    const duck = Duck.of({ ns });

    const f1 = R.reduce((acc, { type, nsType, fnName }) => {
      acc[type] = nsType;
      acc[fnName] = createFSAC([nsType]);

      return acc;
    }, duck);

    // @TODO make more elegant with R.converge.
    return createApiWitMiddleware(
      _middlewares,
      f1(_value)
    )(_value);
  }

  create1() {
    const { _value, _middlewares } = this;
    const p = R.fromPairs(_value);

    if (!_middlewares.length) {
      _middlewares.push(() => n => a => n(a));
    }

    const f = R.compose(
      R.apply(R.compose),
      R.curryN(2, ((m, x) => R.map(o => o(x), m)))
    );
    const f2 = f(_middlewares, p)(
      R.unless(
        R.is(Object),
        () => { throw TypeError('Middlware did not yield a valid action object'); }
      )
    );
    const m = R.memoize((t, k) => {
      const v = t[k];

      switch (typeof v) {
        case 'string':
          return v;
        case 'function':
          return _middlewares.length ? R.compose(f2, v) : v;
        default:
          return void 0;
      }
    });

    const proxy = new Proxy(p, {
      get: (t, k) => {
        return t.hasOwnProperty(k) ? m(t, k) : t[k];
      },
    });

    return proxy;
  }
}

function createApiWitMiddleware(middlewares = [], duck) {
  const chain = middlewareWithDuck(middlewares, duck);

  return R.reduce((acc, { type, nsType, fnName }) => {
    acc[type] = nsType;
    acc[fnName] = R.compose(chain, duck[fnName]);

    return acc;
  }, Duck.of({ ns: duck.ns }));
}

/**
 * Set error prop to true for any action matching the regEx
 * @param {RegExp} propTest e.g /_ERROR$/
 */
export function setErrorPropForType(propTest) {
  return () => R.when(
    R.propSatisfies(R.test(propTest), 'type'),
    R.set(R.lensProp('error'), true)
  );
}
