import React from "react";

import Loadable from "react-loadable";
import { Route } from "react-router";

import { AUTHORITIES } from "app/config/constants";
import Dashboard from "app/modules/pages/dashboard/dashboard";
import Login from "app/modules/account/login/login";
import PrivateRoute from "app/shared/auth/private-route";
import ErrorBoundaryRoutes from "app/shared/error/error-boundary-routes";
import PageNotFound from "app/shared/error/page-not-found";
import ErasManagement from "./modules/pages/eras/eras";
import LayoutSystemTemplete from "./shared/layout/layout-container/layout-container";
import LoginPage from "./modules/pages/login/login";
import DescriptionMonumentsPage from "./modules/pages/description-monuments/DescriptionMonuments";
import DynastyPage from "./modules/pages/dynasty/Dynasty";
import FavouritesPage from "./modules/pages/favourites/Favourites";
import GalleryPage from "./modules/pages/gallery/Gallery";
import MonumentsPage from "./modules/pages/monuments/Monuments";
import MonumentsEraPage from "./modules/pages/monuments-era/MonumentsEra";
import MonumentsTypePage from "./modules/pages/monuments-type/MonumentsType";
import PortalUsersPage from "./modules/pages/portal-users/PortalUsers";
import SavedSearchPage from "./modules/pages/saved-search/SavedSearch";
import UserHistoryPage from "./modules/pages/user-history/UserHistory";
import UsersPage from "./modules/pages/users/Users";

const loading = <div>loading ...</div>;

// const Account = Loadable({
//   loader: () => import(/* webpackChunkName: "account" */ "app/modules/account"),
//   loading: () => loading,
// });

// const Admin = Loadable({
//   loader: () =>
//     import(
//       /* webpackChunkName: "administration" */ "app/modules/administration"
//     ),
//   loading: () => loading,
// });
const AppRoutes = () => {
  return (
    <div className="view-routes">
      <ErrorBoundaryRoutes>
        <Route index element={<LoginPage />} />
        <Route path="" element={<LayoutSystemTemplete />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="eras" element={<ErasManagement />} />
          <Route
            path="descriptionMonuments"
            element={<DescriptionMonumentsPage />}
          />
          <Route path="dynasty" element={<DynastyPage />} />
          <Route path="favourites" element={<FavouritesPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="monuments" element={<MonumentsPage />} />
          <Route path="monumentsEra" element={<MonumentsEraPage />} />
          <Route path="monumentsType" element={<MonumentsTypePage />} />
          <Route path="portalUsers" element={<PortalUsersPage />} />
          <Route path="savedSearch" element={<SavedSearchPage />} />
          <Route path="userHistory" element={<UserHistoryPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>
        {/* <Route path="account">
          <Route
            path="*"
            element={
              <PrivateRoute
                hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.USER]}
              >
                <Account />
              </PrivateRoute>
            }
          />
          <Route path="register" element={<Register />} />
          <Route path="activate" element={<Activate />} />
          <Route path="reset">
            <Route path="request" element={<PasswordResetInit />} />
            <Route path="finish" element={<PasswordResetFinish />} />
          </Route>
        </Route> */}
        {/* <Route
          path="admin/*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN]}>
              <Admin />
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER]}>
              <EntitiesRoutes />
            </PrivateRoute>
          }
        /> */}
        <Route path="*" element={<PageNotFound />} />
      </ErrorBoundaryRoutes>
    </div>
  );
};

export default AppRoutes;
