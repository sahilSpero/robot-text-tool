import * as constants from "./constants";

const initialState = {
  getting: false,
  getDomain: [],
  adding: false,
  deleting: false,
};

const domain = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case constants.GET_ALL_DOMAINS_REQUEST:
      return { ...state, getting: true };

    case constants.GET_ALL_DOMAINS_SUCCESS:
      return { ...state, getting: false, getDomain: payload };

    case constants.GET_ALL_DOMAINS_FAIL:
      return { ...state, getting: false };

    case constants.ADD_NEW_DOMAIN_REQUEST:
      return { ...state, adding: true };

    case constants.ADD_NEW_DOMAIN_SUCCESS:
      return {
        ...state,
        adding: false,
        getDomain: payload,
      };

    case constants.ADD_NEW_DOMAIN_FAIL:
      return { ...state, adding: false };

    case constants.DELETE_DOMAIN_REQUEST:
      return { ...state, deleting: true };

    case constants.DELETE_DOMAIN_SUCCESS:
      return {
        ...state,
        deleting: false,
        getDomain: payload,
      };

    case constants.DELETE_DOMAIN_FAIL:
      return { ...state, deleting: false };

    default:
      return state;
  }
};

export default domain;
