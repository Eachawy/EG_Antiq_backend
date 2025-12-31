import "react-toastify/dist/ReactToastify.css";
import "./app.scss";
import "app/config/dayjs";

import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Card } from "reactstrap";

import { ToastContainer } from "react-toastify";

import { AUTHORITIES } from "app/config/constants";
import { useAppDispatch, useAppSelector } from "app/config/store";
import AppRoutes from "app/routes";
import { hasAnyAuthority } from "app/shared/auth/private-route";
import ErrorBoundary from "app/shared/error/error-boundary";
import { Storage } from "react-jhipster";

import { setTextDirection } from "./config/translation";

const baseHref = document
  .querySelector("base")
  .getAttribute("href")
  .replace(/\/$/, "");

export const App = () => {
  const currentLocale = useAppSelector((state) => state.locale.currentLocale);
  Storage.session.set("locale", currentLocale);
  // const isAuthenticated = useAppSelector(
  //   (state) => state.authentication.isAuthenticated,
  // );
  // const isAdmin = useAppSelector((state) =>
  //   hasAnyAuthority(state.authentication.account.authorities, [
  //     AUTHORITIES.ADMIN,
  //   ]),
  // );
  // const ribbonEnv = useAppSelector(
  //   (state) => state.applicationProfile.ribbonEnv,
  // );
  // const isInProduction = useAppSelector(
  //   (state) => state.applicationProfile.inProduction,
  // );
  // const isOpenAPIEnabled = useAppSelector(
  //   (state) => state.applicationProfile.isOpenAPIEnabled,
  // );

  useEffect(() => {
    setTextDirection(currentLocale);
  }, [currentLocale]);

  return (
    <BrowserRouter basename={baseHref}>
      <ToastContainer
        position="top-left"
        className="toastify-container"
        toastClassName="toastify-toast"
      />
      <div id="app-view-container">
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </div>
    </BrowserRouter>
  );
};

export default App;
