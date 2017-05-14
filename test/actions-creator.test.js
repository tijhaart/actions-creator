import ActionsCreator, { setErrorPropForType } from 'actions-creator';
// import { isFSA } from 'flux-standard-action';
import R from 'ramda';

expect.extend({
  toHaveFunction(received, argument) {
    const isFunction = typeof received[argument] === 'function';

    return {
      message: `expected ${argument} to be a function for ${received}.`,
      pass: isFunction,
    };
  }
});

function setupActionsCreator() {
  return new ActionsCreator({ ns: 'cart' })
    .action('ADD_ITEM')
    .create()
  ;
}

// test, empty payload, test empty meta

test('Action type to action creator', () => {
  const cart = setupActionsCreator();
  expect(cart).toHaveFunction('addItem');
  expect(cart).toHaveFunction('addItemDone');
  expect(cart).toHaveFunction('addItemError');
});

test('From action type to default state type action creators', () => {
  const cart = ActionsCreator.of({ ns: 'cart' })
    .use(setErrorPropForType(/_ERROR$/))
    .action('ADD_ITEM')
    .create()
  ;

  expect(cart).toHaveFunction('addItemDone');
  expect(cart).toHaveFunction('addItemError');

  expect(cart.ADD_ITEM_DONE).toBe('cart/ADD_ITEM_DONE');
  expect(cart.ADD_ITEM_ERROR).toBe('cart/ADD_ITEM_ERROR');

  expect(cart.addItemDone({ id: 999, title: 'Banana', qty: 1 }))
    .toMatchObject({
      type: 'cart/ADD_ITEM_DONE',
      payload: { id: 999, title: 'Banana', qty: 1 }
    })
  ;

  expect(cart.addItemError({ id: 999, message: 'Item no longer in stock' }))
    .toMatchObject({
      type: 'cart/ADD_ITEM_ERROR',
      payload: { id: 999, message: 'Item no longer in stock' },
      error: true,
    })
  ;
});

test('Action creator without state type action creators', () => {
  const cart = new ActionsCreator({ ns: 'cart' })
    .actionOnly('ADD_ITEM')
    .create()
  ;

  expect(cart).toHaveFunction('addItem');
  expect(cart.addItemDone).toBeUndefined();
  expect(cart.addItemError).toBeUndefined();

  expect(cart.ADD_ITEM).toBe('cart/ADD_ITEM');
  expect(cart.ADD_ITEM_DONE).toBeUndefined();
  expect(cart.ADD_ITEM_ERROR).toBeUndefined();
});


test('Optional namespace', () => {
  const cart = new ActionsCreator()
    .action('ADD_ITEM')
    .create()
  ;

  expect(cart.addItem({ id: 999, title: 'Banana', qty: 1 }))
    .toMatchObject({
      type: 'ADD_ITEM',
      payload: { id: 999, title: 'Banana', qty: 1 }
    })
  ;

  expect(cart.ADD_ITEM).toBe('ADD_ITEM');
});

test('No payload', () => {
  const cart = new ActionsCreator({ ns: 'cart' })
    .action('CHECKOUT')
    .create()
  ;

  expect(cart.checkout())
    .toMatchObject({
      type: 'cart/CHECKOUT',
    })
  ;
});


test('Meta property', () => {
  const cart = new ActionsCreator({ ns: 'cart' })
    .action('ADD_ITEM')
    .create()
  ;

  expect(cart.addItemDone({ id: 999, title: 'Banana' }, { 'cart.qty': 1 }))
    .toMatchObject({
      type: 'cart/ADD_ITEM_DONE',
      payload: { id: 999, title: 'Banana' },
      meta: {
        'cart.qty': 1,
      },
    })
  ;
});


test('Decorate action (advanced)', () => {
  const cart = ActionsCreator.of({ ns: 'cart' })
    .use(duck => {
      duck.stateAction('pending', 'QUERY');

      return R.when(
        R.propEq('type', duck.QUERY),
        action => (dispatch) => {
          const { payload: query } = action;
          // Mocked remote data
          const data = R.pipe(
            R.drop(query.offset),
            R.take(query.limit)
          )([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

          dispatch(duck.queryPending(query));

          return (data.length ? Promise.resolve(data) : Promise.reject(Error('Empty')))
            .then(result => {
              return dispatch(duck.queryDone(result, { query }));
            })
            .catch((err) => {
              dispatch(duck.queryError(err, { query }));
            })
          ;
        });
    })
    .action('QUERY')
    .create()
  ;

  const action = cart.query({ limit: 10, offset: 5 });
  const dispatchMockFn = jest.fn(R.identity);

  expect(typeof action).toEqual('function');

  const promise = action(dispatchMockFn);
  expect(promise).toBeInstanceOf(Promise);
  expect(dispatchMockFn).toHaveBeenCalledWith({ type: 'cart/QUERY_PENDING', payload: { limit: 10, offset: 5 }});

  return promise
    .then(() => {
      expect(dispatchMockFn).lastCalledWith({
        type: 'cart/QUERY_DONE',
        payload: [6, 7, 8, 9, 10],
        meta: { query: { limit: 10, offset: 5 }}
      });
    })
  ;
});

test('Decorate action (basic)', () => {
  const cart = ActionsCreator.of()
    .use(() => R.when(
      R.pipe(R.prop('type'), R.test(/_ERROR$/)),
      R.set(R.lensProp('error'), true)
    ))
    .use(duck => R.unless(
      R.both(R.propEq('type', duck.ADD_ITEM), R.pipe(R.path(['payload', 'id']), R.is(Number))),
      R.always(duck.addItemError(TypeError('No valid id provided. Needs to be a number')))
    ))
    .action('ADD_ITEM')
    .create()
  ;

  expect(cart.addItem({ title: 'Banana' })).toHaveProperty('error', true);
  expect(cart.addItem({ id: 999, title: 'Banana' })).not.toHaveProperty('error');
});

test('ActionsCreator::of', () => {
  expect(ActionsCreator.of())
    .toBeInstanceOf(ActionsCreator)
  ;

  // Verify options gets passed to the constructor
  expect(ActionsCreator.of({ ns: 'cart' }))
    .toHaveProperty('ns', 'cart')
  ;
});

test('Extend ActionsCreator', () => {
  const a = ActionsCreator.of({ ns: 'a' }).action('DO_FOO');
  const b = a.action('DO_BAR');

  const duckA = a.create();
  const duckB = b.create();

  expect(duckA).not.toHaveFunction('doBar');
  expect(duckB).toHaveFunction('doFoo');
  expect(duckB).toHaveFunction('doBar');
});
