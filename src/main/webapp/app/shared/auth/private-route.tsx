import React from "react";
import { Storage, Translate } from "react-jhipster";
import { Navigate, PathRouteProps, useLocation } from "react-router-dom";

import { useAppSelector } from "app/config/store";
import ErrorBoundary from "app/shared/error/error-boundary";

interface IOwnProps extends PathRouteProps {
  hasAnyAuthorities?: string[];
  children: React.ReactNode;
}

export const PrivateRoute = ({
  children,
  hasAnyAuthorities = [],
  ...rest
}: IOwnProps) => {
  const isAuthenticated = useAppSelector(
    (state) =>
      Storage.session.get("isAuthenticated") ||
      state.authentication.isAuthenticated,
  );

  const sessionHasBeenFetched =
    Storage.session.get("sessionHasBeenFetched") ||
    useAppSelector((state) => state.authentication.sessionHasBeenFetched);

  const account =
    Storage.session.get("account") ||
    useAppSelector((state) => state.authentication.account);

  Storage.session.set("isAuthenticated", isAuthenticated);
  Storage.session.set("sessionHasBeenFetched", sessionHasBeenFetched);
  Storage.session.set("account", account);

  const isAuthorized = hasAnyAuthority(account.roles, hasAnyAuthorities);
  const pageLocation = useLocation();

  if (!children) {
    throw new Error(
      `A component needs to be specified for private route for path ${rest.path}`,
    );
  }

  if (!sessionHasBeenFetched) {
    return <div></div>;
  }

  if (isAuthenticated) {
    if (isAuthorized) {
      return <ErrorBoundary>{children}</ErrorBoundary>;
    }

    return (
      <Navigate
        to={{
          pathname: "/unauthorized",
        }}
        replace
      />
    );
  }

  return (
    <Navigate
      to={{
        pathname: "/login",
        search: pageLocation.search,
      }}
      replace
      state={{ from: pageLocation }}
    />
  );
};

export const hasAnyAuthority = (
  authorities: string[],
  hasAnyAuthorities: string[],
) => {
  if (authorities && authorities.length !== 0) {
    if (hasAnyAuthorities.length === 0) {
      return true;
    }
    return hasAnyAuthorities.some((auth) => authorities.includes(auth));
  }
  return false;
};

/**
 * Checks authentication before showing the children and redirects to the
 * login page if the user is not authenticated.
 * If hasAnyAuthorities is provided the authorization status is also
 * checked and an error message is shown if the user is not authorized.
 */
export default PrivateRoute;
