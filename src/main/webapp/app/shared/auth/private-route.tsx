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

  const sessionHasBeenFetched = useAppSelector(
    (state) =>
      Storage.session.get("sessionHasBeenFetched") ||
      state.authentication.sessionHasBeenFetched,
  );

  const account = useAppSelector(
    (state) => Storage.session.get("account") || state.authentication.account,
  );

  const isAuthorized = hasAnyAuthority(account.roles, hasAnyAuthorities);
  const pageLocation = useLocation();

  if (!children) {
    throw new Error(
      `A component needs to be specified for private route for path ${rest.path}`,
    );
  }

  if (!sessionHasBeenFetched) {
    return <></>;
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
