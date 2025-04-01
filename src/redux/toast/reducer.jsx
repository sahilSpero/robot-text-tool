import * as constants from "./constants";

const initialState = { open: false, type: null, msg: "" };

const toastReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.SHOW_TOAST:
      return {
        ...state,
        open: true,
        type: action.payload.type,
        msg: action.payload.msg,
      };
    case constants.RESET_TOAST:
      return { ...state, open: false, type: null, msg: "" };
    default:
      return state;
  }
};

export default toastReducer;
