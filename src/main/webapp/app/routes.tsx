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
        <Route index element={<Login />} />
        <Route path="" element={<LayoutSystemTemplete />}>
          <Route path="dashnoard" element={<Dashboard />} />
          <Route path="erasManagement" element={<ErasManagement />} />
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
