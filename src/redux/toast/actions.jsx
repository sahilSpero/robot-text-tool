import * as constants from "./constants";

export const showToast = (type, msg) => async (dispatch) => {
  const validTypes = ["success", "error", "warning", "info"];
  if (!validTypes.includes(type)) {
    console.error("Invalid toast type:", type);
    return;
  }

  dispatch({
    type: constants.SHOW_TOAST,
    payload: { open: true, type, msg },
  });

  setTimeout(() => {
    dispatch(resetToast());
  }, 3000);
};

export const resetToast = () => async (dispatch) => {
  dispatch({ type: constants.RESET_TOAST });
};
