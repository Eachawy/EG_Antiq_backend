import { ReducersMapObject } from "@reduxjs/toolkit";
import { loadingBarReducer as loadingBar } from "react-redux-loading-bar";
import authentication from "./authentication";
import locale from "./locale";
import Eras from "app/modules/pages/eras/eras.reducer";
import Dynasties from "app/modules/pages/dynasty/dynasty.reducer";
import Monuments from "app/modules/pages/monuments/monuments.reducer";
import MonumentsEra from "app/modules/pages/monuments-era/monuments-era.reducer";
import MonumentsType from "app/modules/pages/monuments-type/monuments-type.reducer";
import Gallery from "app/modules/pages/gallery/gallery.reducer";
import DescriptionMonuments from "app/modules/pages/description-monuments/description-monuments.reducer";
import Users from "app/modules/pages/users/users.reducer";
import PortalUsers from "app/modules/pages/portal-users/portal-users.reducer";
import Favourites from "app/modules/pages/favourites/favourites.reducer";
import SavedSearches from "app/modules/pages/saved-search/saved-search.reducer";
import UserHistory from "app/modules/pages/user-history/user-history.reducer";

const rootReducer: ReducersMapObject = {
  authentication,
  locale,
  loadingBar,
  Eras,
  Dynasties,
  Monuments,
  MonumentsEra,
  MonumentsType,
  Gallery,
  DescriptionMonuments,
  Users,
  PortalUsers,
  Favourites,
  SavedSearches,
  UserHistory,
};

export default rootReducer;
