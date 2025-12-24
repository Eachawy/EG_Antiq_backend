import "./header.scss";

import React, { useState } from "react";
import { Storage, Translate } from "react-jhipster";

import LoadingBar from "react-redux-loading-bar";

import { useAppDispatch } from "app/config/store";
import { setLocale } from "app/shared/reducers/locale";

export interface IHeaderProps {
  currentLocale: string;
}

const Header = (props: IHeaderProps) => {
  const dispatch = useAppDispatch();

  const handleLocaleChange = () => {
    const langKey = Storage.session.get("locale") === "en" ? "ar" : "en";
    Storage.session.set("locale", langKey);
    dispatch(setLocale(langKey));
  };

  return (
    <div id="app-header">
      <div onClick={handleLocaleChange}>{props.currentLocale}</div>
      <LoadingBar className="loading-bar" />
    </div>
  );
};

export default Header;
