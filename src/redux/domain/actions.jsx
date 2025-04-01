import api from "../../interceptor";
import * as apiUrl from "./api";
import * as constants from "./constants";
import * as toastActions from "../toast/actions";

export const getAllDomains = () => async (dispatch) => {
  try {
    dispatch({ type: constants.GET_ALL_DOMAINS_REQUEST });
    const res = await api.get(apiUrl.GET_ALL_DOMAINS_API);
    dispatch({
      type: constants.GET_ALL_DOMAINS_SUCCESS,
      payload: res?.data?.data,
    });
  } catch (err) {
    console.log("Get all domain fail", err);
    dispatch({ type: constants.GET_ALL_DOMAINS_FAIL });
  }
};

export const addDomain = (data) => async (dispatch) => {
  try {
    dispatch({ type: constants.ADD_NEW_DOMAIN_REQUEST });
    const res = await api.post(apiUrl.ADD_DOMAIN_API, data);
    dispatch({
      type: constants.ADD_NEW_DOMAIN_SUCCESS,
      payload: res?.data?.data,
    });
    // await dispatch(
    //   toastActions.showToast("success", "Domain added successfully!")
    // );
  } catch (err) {
    console.log("Add domain fail", err);
    dispatch({ type: constants.ADD_NEW_DOMAIN_FAIL });
    await dispatch(toastActions.showToast("error", "Failed to add domain!"));
  }
};

export const deleteDomain = (id) => async (dispatch) => {
  try {
    dispatch({ type: constants.DELETE_DOMAIN_REQUEST });
    const res = await api.delete(`${apiUrl.DELETE_DOMAIN_API}/${id}`);
    dispatch({
      type: constants.DELETE_DOMAIN_SUCCESS,
      payload: res?.data?.data,
    });
    await dispatch(
      // toastActions.showToast("success", "Domain deleted successfully!")
    );
  } catch (err) {
    console.log("Delete domain fail", err);
    dispatch({ type: constants.DELETE_DOMAIN_FAIL });
    await dispatch(toastActions.showToast("error", "Failed to delete domain!"));
  }
};
