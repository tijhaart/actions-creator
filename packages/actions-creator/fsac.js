import { partial as R_partial } from 'ramda';

// FSAC = flux standard action creator
export default R_partial(function createFSAC(type, payload, meta) {
  const action = { type, payload, meta };

  (payload === void 0) && (delete action.payload);
  (meta === void 0) && (delete action.meta);

  return action;
});
