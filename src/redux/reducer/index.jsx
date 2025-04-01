import { combineReducers } from "redux";
import authReducer from "../auth/reducer";
import domainReducer from "../domain/reducer";
import toastReducer from "../toast/reducer";

const reducer = combineReducers({
  auth: authReducer,
  domain: domainReducer,
  toast: toastReducer,
});

export default reducer;
