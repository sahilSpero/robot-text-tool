import * as constants from "./constants";

const initialState = {
  registering: false,
  registerData: null,
  verifing: false,
  isVerified: false,
  resending: false,
  gettingUser: false,
  getUser: null,
  isLoggingOut: false,
  token: null,
};

const auth = (state = initialState, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case constants.USER_REGISTER_REQUEST:
      return {
        ...state,
        registering: true,
      };
    case constants.USER_REGISTER_SUCCCESS:
      return {
        ...state,
        registering: false,
        registerData: payload,
      };
    case constants.USER_REGISTER_FAIL:
      return {
        ...state,
        registering: false,
      };

    case constants.VERIFY_CODE_REQUEST:
      return {
        ...state,
        verifing: true,
        isVerified: false,
      };
    case constants.VERIFY_CODE_SUCCCESS:
      return {
        ...state,
        verifing: false,
        isVerified: true,
        token: payload,
      };
    case constants.VERIFY_CODE_FAIL:
      return {
        ...state,
        verifing: false,
        isVerified: false,
      };

    case constants.RESEND_CODE_REQUEST:
      return {
        ...state,
        resending: true,
      };
    case constants.RESEND_CODE_SUCCCESS:
    case constants.RESEND_CODE_FAIL:
      return {
        ...state,
        resending: false,
      };

    case constants.GET_USER_REQUEST:
      return {
        ...state,
        gettingUser: true,
        isVerified: false,
      };
    case constants.GET_USER_SUCCESS:
      return {
        ...state,
        gettingUser: false,
        isVerified: true,
        getUser: payload,
      };
    case constants.GET_USER_FAIL:
      return {
        ...state,
        gettingUser: false,
        isVerified: false,
      };

    case constants.LOGOUT_REQUEST:
      return {
        ...state,
        isLoggingOut: true,
        token : null
      };
    case constants.LOGOUT_SUCCESS:
      return {
        ...state,
        isLoggingOut: true,
      };
    case constants.LOGOUT_FAIL:
      return {
        ...state,
        isLoggingOut: false,
      };
    default:
      return state;
  }
};

export default auth;
