const INC = 'loadingReducer/inc';
const DEC = 'loadingReducer/dec';

const initialState = {
  isLoading: false,
  operationsCount: 0
};

export function loadingReducer(state = initialState, action = {}) {
  let { operationsCount, isLoading } = state;

  switch (action.type) {
    case INC:
      operationsCount += 1;
      return {
        ...state,
        isLoading: true,
        operationsCount
      };
    case DEC:
      operationsCount -= 1;
      if (operationsCount === 0) {
        isLoading = false;
      }
      return {
        ...state,
        operationsCount,
        isLoading
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
    const { meta, payload } = action;

    if (meta && meta.loading) {
      if (isPromise(payload)) {
        dispatch({type: INC});
      } else {
        dispatch({type: DEC});
      }
    }

    return next(action);
  }
}
