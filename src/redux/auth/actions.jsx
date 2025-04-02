import api from "../../interceptor";
import * as apiUrl from "./api";
import * as constants from "./constants";
import * as service from "../../service";
import * as toastActions from "../toast/actions";

export const register = (data) => async (dispatch) => {
  try {
    dispatch({ type: constants.USER_REGISTER_REQUEST });
    const res = await api.post(apiUrl.USER_REGISTER_API, data);
    dispatch({
      type: constants.USER_REGISTER_SUCCCESS,
      payload: res?.data?.data,
    });
    // dispatch(toastActions.showToast("success", "Registration successful!"));
  } catch (err) {
    console.log("Register fail", err);
    dispatch({ type: constants.USER_REGISTER_FAIL });
    dispatch(toastActions.showToast("error", "Registration failed!"));
  }
};

export const verifyCode = (data, router) => async (dispatch) => {
  try {
    dispatch({ type: constants.VERIFY_CODE_REQUEST });
    const res = await api.post(apiUrl.USER_VERIFY_BY_CODE_API, data);
    const { token } = res?.data;
    // service.setAuthToken(token);
    dispatch({ type: constants.VERIFY_CODE_SUCCCESS, payload: token });
    // dispatch(toastActions.showToast("success", "Verification successful!"));
    localStorage.setItem("authToken", token);
    if (token) {
      router.push(`/dashboard`);
    }
  } catch (err) {
    console.log("Verify fail", err);
    dispatch({ type: constants.VERIFY_CODE_FAIL });
    dispatch(toastActions.showToast("error", "Verification failed!"));
  }
};

export const resendCode = (data) => async (dispatch) => {
  try {
    dispatch({ type: constants.RESEND_CODE_REQUEST });
    await api.post(apiUrl.RESEND_VERIFY_CODE_API, data);
    dispatch({ type: constants.RESEND_CODE_SUCCCESS });
    // dispatch(toastActions.showToast("success", "Code resent successfully!"));
  } catch (err) {
    console.log("Resend fail", err);
    dispatch({ type: constants.RESEND_CODE_FAIL });
    dispatch(toastActions.showToast("error", "Failed to resend code!"));
  }
};

export const getUser = () => async (dispatch) => {
  try {
    dispatch({ type: constants.GET_USER_REQUEST });
    const res = await api.get(apiUrl.GET_USER_API);
    dispatch({ type: constants.GET_USER_SUCCESS, payload: res?.data?.user });
  } catch (err) {
    dispatch({
      type: constants.GET_USER_FAIL,
      payload: err.response?.data,
    });
  }
};

export const logOut = (router) => async (dispatch) => {
  try {
    dispatch({ type: constants.LOGOUT_REQUEST });
    const res = await api.get(apiUrl.LOGOUT_USER);
    setTimeout(() => {
      dispatch({ type: constants.LOGOUT_SUCCESS, payload: res?.data });
      if (res?.data?.redirect) {
        router.push(res?.data?.redirect);
      }
      // dispatch(toastActions.showToast("success", "Logout successfully!"));
    }, 100);
  } catch (err) {
    console.log(err, "logout fail");
    dispatch({ type: constants.LOGOUT_FAIL });
  }
};
