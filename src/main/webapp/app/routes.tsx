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
import NewsletterPage from "./modules/pages/newsletter/Newsletter";
import UnauthorizedPage from "./shared/reducers/unauthorized/unathorized.page";

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
        <Route path="*" element={<PageNotFound />} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />

        <Route path="" element={<LayoutSystemTemplete />}>
          <Route path="/">
            <Route
              path="dashboard"
              element={
                <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER]}>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="eras"
              element={
                <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER]}>
                  <ErasManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="descriptionMonuments"
              element={
                <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER]}>
                  <DescriptionMonumentsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="dynasty"
              element={
                <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER]}>
                  <DynastyPage />
                </PrivateRoute>
              }
            />
            <Route
              path="gallery"
              element={
                <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER]}>
                  <GalleryPage />
                </PrivateRoute>
              }
            />
            <Route
              path="monuments"
              element={
                <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER]}>
                  <MonumentsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="monumentsEra"
              element={
                <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER]}>
                  <MonumentsEraPage />
                </PrivateRoute>
              }
            />
            <Route
              path="monumentsType"
              element={
                <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER]}>
                  <MonumentsTypePage />
                </PrivateRoute>
              }
            />
            <Route
              path="sources"
              element={
                <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER]}>
                  <SourcesPage />
                </PrivateRoute>
              }
            />
            <Route
              path="books"
              element={
                <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER]}>
                  <BooksPage />
                </PrivateRoute>
              }
            />
            <Route
              path="monumentSources"
              element={
                <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER]}>
                  <MonumentSourcesPage />
                </PrivateRoute>
              }
            />
            <Route
              path="monumentBooks"
              element={
                <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER]}>
                  <MonumentBooksPage />
                </PrivateRoute>
              }
            />
          </Route>
          <Route
            path="users"
            element={
              <PrivateRoute
                hasAnyAuthorities={[
                  AUTHORITIES.PORTAL_ADMIN,
                  AUTHORITIES.ADMIN,
                ]}
              >
                <UsersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="portalUsers"
            element={
              <PrivateRoute
                hasAnyAuthorities={[
                  AUTHORITIES.PORTAL_ADMIN,
                  AUTHORITIES.ADMIN,
                ]}
              >
                <PortalUsersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="roles"
            element={
              <PrivateRoute
                hasAnyAuthorities={[
                  AUTHORITIES.PORTAL_ADMIN,
                  AUTHORITIES.ADMIN,
                ]}
              >
                <RolesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="userRoles"
            element={
              <PrivateRoute
                hasAnyAuthorities={[
                  AUTHORITIES.PORTAL_ADMIN,
                  AUTHORITIES.ADMIN,
                ]}
              >
                <UserRolesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="favourites"
            element={
              <PrivateRoute
                hasAnyAuthorities={[
                  AUTHORITIES.PORTAL_ADMIN,
                  AUTHORITIES.ADMIN,
                ]}
              >
                <FavouritesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="savedSearch"
            element={
              <PrivateRoute
                hasAnyAuthorities={[
                  AUTHORITIES.PORTAL_ADMIN,
                  AUTHORITIES.ADMIN,
                ]}
              >
                <SavedSearchPage />
              </PrivateRoute>
            }
          />
          <Route
            path="userHistory"
            element={
              <PrivateRoute
                hasAnyAuthorities={[
                  AUTHORITIES.PORTAL_ADMIN,
                  AUTHORITIES.ADMIN,
                ]}
              >
                <UserHistoryPage />
              </PrivateRoute>
            }
          />
          <Route
            path="newsletter"
            element={
              <PrivateRoute
                hasAnyAuthorities={[
                  AUTHORITIES.PORTAL_ADMIN,
                  AUTHORITIES.ADMIN,
                ]}
              >
                <NewsletterPage />
              </PrivateRoute>
            }
          />
        </Route>
      </ErrorBoundaryRoutes>
    </div>
  );
};

export default AppRoutes;
