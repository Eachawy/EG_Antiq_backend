export const AUTHORITIES = {
  ADMIN: "ROLE_ADMIN",
  USER: "ROLE_USER",
};

export const messages = {
  DATA_ERROR_ALERT: "Internal Error",
};

export const APP_DATE_FORMAT = "DD/MM/YY HH:mm";
export const APP_TIMESTAMP_FORMAT = "DD/MM/YY HH:mm:ss";
export const APP_LOCAL_DATE_FORMAT = "DD/MM/YYYY";
export const APP_LOCAL_DATETIME_FORMAT = "YYYY-MM-DDTHH:mm";
export const APP_WHOLE_NUMBER_FORMAT = "0,0";
export const APP_TWO_DIGITS_AFTER_POINT_NUMBER_FORMAT = "0,0.[00]";
export const AUTH_TOKEN_KEY = "token";

export const GATEWAY_SERVER_API_URL = "http://localhost:3000/api";
export const AUTH_LOGIN = "/v1/auth/login";
export const AUTH_LOGOUT = "/v1/auth/logout";

// Eras APIs
export const GET_Eras_API = "/v1/eras";
export const CREATE_Era_API = "/v1/eras";
export const UPDATE_Era_API = "/v1/eras"; // Will append /:id
export const DELETE_Era_API = "/v1/eras"; // Will append /:id

// Dynasty APIs
export const GET_Dynasties_API = "/v1/dynasties";
export const CREATE_Dynasty_API = "/v1/dynasties";
export const UPDATE_Dynasty_API = "/v1/dynasties"; // Will append /:id
export const DELETE_Dynasty_API = "/v1/dynasties"; // Will append /:id

// Monuments APIs
export const GET_Monuments_API = "/v1/monuments";
export const CREATE_Monument_API = "/v1/monuments";
export const UPDATE_Monument_API = "/v1/monuments"; // Will append /:id
export const DELETE_Monument_API = "/v1/monuments"; // Will append /:id

// Monuments Era APIs
export const GET_MonumentsEra_API = "/v1/monuments-era";
export const CREATE_MonumentsEra_API = "/v1/monuments-era";
export const UPDATE_MonumentsEra_API = "/v1/monuments-era"; // Will append /:id
export const DELETE_MonumentsEra_API = "/v1/monuments-era"; // Will append /:id

// Monuments Type APIs
export const GET_MonumentsType_API = "/v1/monuments-type";
export const CREATE_MonumentsType_API = "/v1/monuments-type";
export const UPDATE_MonumentsType_API = "/v1/monuments-type"; // Will append /:id
export const DELETE_MonumentsType_API = "/v1/monuments-type"; // Will append /:id

// Gallery APIs
export const GET_Gallery_API = "/v1/galleries";
export const CREATE_Gallery_API = "/v1/galleries";
export const UPDATE_Gallery_API = "/v1/galleries"; // Will append /:id
export const DELETE_Gallery_API = "/v1/galleries"; // Will append /:id

// Description Monuments APIs
export const GET_DescriptionMonuments_API = "/v1/description-monuments";
export const CREATE_DescriptionMonument_API = "/v1/description-monuments";
export const UPDATE_DescriptionMonument_API = "/v1/description-monuments"; // Will append /:id
export const DELETE_DescriptionMonument_API = "/v1/description-monuments"; // Will append /:id

// Users APIs
export const GET_Users_API = "/v1/users";
export const CREATE_User_API = "/v1/users";
export const UPDATE_User_API = "/v1/users"; // Will append /:id
export const DELETE_User_API = "/v1/users"; // Will append /:id

// Portal Users APIs
export const GET_PortalUsers_API = "/v1/portal-users";
export const CREATE_PortalUser_API = "/v1/portal-users";
export const UPDATE_PortalUser_API = "/v1/portal-users"; // Will append /:id
export const DELETE_PortalUser_API = "/v1/portal-users"; // Will append /:id

// Favourites APIs
export const GET_Favourites_API = "/v1/favourites";
export const CREATE_Favourite_API = "/v1/favourites";
export const DELETE_Favourite_API = "/v1/favourites"; // Will append /:id

// Saved Search APIs
export const GET_SavedSearches_API = "/v1/saved-searches";
export const CREATE_SavedSearch_API = "/v1/saved-searches";
export const DELETE_SavedSearch_API = "/v1/saved-searches"; // Will append /:id

// User History APIs
export const GET_UserHistory_API = "/v1/user-history";
