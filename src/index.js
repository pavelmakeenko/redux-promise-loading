const INC = 'loadingReducer/inc';
const DEC = 'loadingReducer/dec';

const initialState = {
  isLoading: false,
  operationsCount: 0,
  loadingTypes: [],
};

export function loadingReducer(state = initialState, action = {}) {
  let { operationsCount, isLoading, loadingTypes } = state;
  const { payload } = action;

  switch (action.type) {
    case INC:
      loadingTypes.push(payload);
      operationsCount += 1;
      return {
        ...state,
        isLoading: true,
        operationsCount,
        loadingTypes
      };
    case DEC:
      const index = loadingTypes.indexOf(payload);
      loadingTypes.splice(index, 1);
      operationsCount -= 1;
      if (operationsCount === 0) {
        isLoading = false;
      }
      return {
        ...state,
        operationsCount,
        isLoading,
        loadingTypes
      };
    default:
      return state;
  }
}

function isPromise(val) {
  return val && typeof val.then === 'function';
}

export function loadingMiddleware(options) {
  return ({dispatch}) => (next) => (action) => {
    const { meta, payload, type } = action;

    if (meta && meta.loading) {
      if (isPromise(payload)) {
        dispatch({type: INC, payload: type});
      } else {
        dispatch({type: DEC, payload: type});
      }
    }

    return next(action);
  }
}
