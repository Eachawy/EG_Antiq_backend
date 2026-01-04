import React from "react";

import Loadable from "react-loadable";
import { Route } from "react-router";

import { AUTHORITIES } from "app/config/constants";
import Dashboard from "app/modules/pages/dashboard/dashboard";
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
import RolesPage from "./modules/pages/roles/Roles";
import UserRolesPage from "./modules/pages/user-roles/UserRoles";
import SourcesPage from "./modules/pages/sources/sources";
import BooksPage from "./modules/pages/books/books";
import MonumentSourcesPage from "./modules/pages/monument-sources/MonumentSources";
import MonumentBooksPage from "./modules/pages/monument-books/MonumentBooks";
import UnauthorizedPage from "./shared/reducers/unauthorized/unathorized.page";

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
        <Route path="login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <PrivateRoute
              hasAnyAuthorities={[AUTHORITIES.USER, AUTHORITIES.ADMIN]}
            >
              <LayoutSystemTemplete />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="eras" element={<ErasManagement />} />
          <Route
            path="descriptionMonuments"
            element={<DescriptionMonumentsPage />}
          />
          <Route path="dynasty" element={<DynastyPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="monuments" element={<MonumentsPage />} />
          <Route path="monumentsEra" element={<MonumentsEraPage />} />
          <Route path="monumentsType" element={<MonumentsTypePage />} />
          <Route path="sources" element={<SourcesPage />} />
          <Route path="books" element={<BooksPage />} />
          <Route path="monumentSources" element={<MonumentSourcesPage />} />
          <Route path="monumentBooks" element={<MonumentBooksPage />} />

          <Route
            path="users"
            element={
              <PrivateRoute hasAnyAuthorities={[AUTHORITIES.PORTAL_ADMIN]}>
                <UsersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="portalUsers"
            element={
              <PrivateRoute hasAnyAuthorities={[AUTHORITIES.PORTAL_ADMIN]}>
                <PortalUsersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="roles"
            element={
              <PrivateRoute hasAnyAuthorities={[AUTHORITIES.PORTAL_ADMIN]}>
                <RolesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="userRoles"
            element={
              <PrivateRoute hasAnyAuthorities={[AUTHORITIES.PORTAL_ADMIN]}>
                <UserRolesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="favourites"
            element={
              <PrivateRoute hasAnyAuthorities={[AUTHORITIES.PORTAL_ADMIN]}>
                <FavouritesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="savedSearch"
            element={
              <PrivateRoute hasAnyAuthorities={[AUTHORITIES.PORTAL_ADMIN]}>
                <SavedSearchPage />
              </PrivateRoute>
            }
          />
          <Route
            path="userHistory"
            element={
              <PrivateRoute hasAnyAuthorities={[AUTHORITIES.PORTAL_ADMIN]}>
                <UserHistoryPage />
              </PrivateRoute>
            }
          />
        </Route>
        <Route path="*" element={<PageNotFound />} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />
      </ErrorBoundaryRoutes>
    </div>
  );
};

export default AppRoutes;
