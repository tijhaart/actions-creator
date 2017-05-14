import R from 'ramda';
import createFSAC from './fsac';
import createActions from 'create-actions';

export default class Duck {
  static of(options) {
    return new Duck(options);
  }

  constructor({ ns }) {
    this.ns = ns;
  }

  /**
   * Enhance duck instance with a new action creator for a state type
   * @param  {String} stateType  e.g. DONE or LOADING
   * @param  {String} actionType e.g. GET_ITEMS
   * @return {Duck}              duck instance
   */
  stateAction(stateType, actionType) {
    R.compose(
      R.reduce((acc, action) => {
        acc[action.type] = action.nsType;
        acc[action.fnName] = createFSAC([action.nsType]);
        return acc;
      }, this),
      R.filter(({ type }) => !this[type]),
      // RLog,
      createActions
    )({ actionType, ns: this.ns, stateTypes: [stateType] });

    return this;
  }

  // @TODO use action with middleware
  /**
   * Enhance duck instance with a new action creator
   * @param  {String} stateType  e.g. DONE or LOADING
   * @param  {String} actionType e.g. GET_ITEMS
   * @return {Duck}              duck instance
   */
  action(actionType) {
    R.compose(
      R.reduce((acc, action) => {
        acc[action.type] = action.nsType;
        acc[action.fnName] = createFSAC([action.nsType]);
        return acc;
      }, this),
      R.filter(({ type }) => !this[type]),
      createActions
    )({ actionType, ns: this.ns });

    return this;
  }
}
