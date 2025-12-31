import { ReducersMapObject } from "@reduxjs/toolkit";
import { loadingBarReducer as loadingBar } from "react-redux-loading-bar";
import authentication from "./authentication";
import locale from "./locale";
import Eras from "app/modules/pages/eras/eras.reducer";

const rootReducer: ReducersMapObject = {
  authentication,
  locale,
  loadingBar,
  Eras,
};

export default rootReducer;
