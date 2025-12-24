import { ReducersMapObject } from "@reduxjs/toolkit";
import { loadingBarReducer as loadingBar } from "react-redux-loading-bar";

import applicationProfile from "./application-profile";
import authentication from "./authentication";
import locale from "./locale";

const rootReducer: ReducersMapObject = {
  authentication,
  locale,
  applicationProfile,
  loadingBar,
};

export default rootReducer;
