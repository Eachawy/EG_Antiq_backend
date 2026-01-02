export const AUTHORITIES = {
  ADMIN: "admin",
  USER: "member",
  PORTAL_ADMIN: "PORTAL_ADMIN",
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
export const REFRESH_TOKEN_KEY = "refreshToken";

export const GATEWAY_SERVER_API_URL = "http://localhost:3000/api";
export const AUTH_LOGIN = "/v1/auth/login";
export const AUTH_LOGOUT = "/v1/auth/logout";
export const AUTH_REFRESH = "/v1/auth/refresh";

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
export const GET_MonumentsType_API = "/v1/monument-types";
export const CREATE_MonumentsType_API = "/v1/monument-types";
export const UPDATE_MonumentsType_API = "/v1/monument-types"; // Will append /:id
export const DELETE_MonumentsType_API = "/v1/monument-types"; // Will append /:id

// Gallery APIs
export const GET_Gallery_API = "/v1/gallery";
export const CREATE_Gallery_API = "/v1/gallery";
export const UPDATE_Gallery_API = "/v1/gallery"; // Will append /:id
export const DELETE_Gallery_API = "/v1/gallery"; // Will append /:id

// Description Monuments APIs
export const GET_DescriptionMonuments_API = "/v1/description-monuments";
export const CREATE_DescriptionMonument_API = "/v1/description-monuments";
export const UPDATE_DescriptionMonument_API = "/v1/description-monuments"; // Will append /:id
export const DELETE_DescriptionMonument_API = "/v1/description-monuments"; // Will append /:id

// Organization Users APIs
// TODO: Backend endpoints for organization/admin users management not yet implemented
// These would manage User model (not PortalUser)
export const GET_Users_API = "/v1/users";
export const CREATE_User_API = "/v1/users";
export const UPDATE_User_API = "/v1/users"; // Will append /:id
export const DELETE_User_API = "/v1/users"; // Will append /:id

// Portal Users APIs (Admin management)
export const GET_PortalUsers_API = "/v1/admin/portal-users";
export const CREATE_PortalUser_API = "/v1/admin/portal-users";
export const UPDATE_PortalUser_API = "/v1/admin/portal-users"; // Will append /:id
export const DELETE_PortalUser_API = "/v1/admin/portal-users"; // Will append /:id

// Favorites APIs (Admin)
export const GET_Favourites_API = "/v1/admin/portal-users/favorites/all";
export const CREATE_Favourite_API = "/v1/admin/portal-users/favorites";
export const DELETE_Favourite_API = "/v1/admin/portal-users/favorites"; // Will append /:id

// Saved Search APIs (Admin)
export const GET_SavedSearches_API =
  "/v1/admin/portal-users/saved-searches/all";
export const CREATE_SavedSearch_API = "/v1/admin/portal-users/saved-searches";
export const DELETE_SavedSearch_API = "/v1/admin/portal-users/saved-searches"; // Will append /:id

// Browsing History APIs (Admin)
export const GET_BrowsingHistory_API = "/v1/admin/portal-users/history/all";
export const DELETE_BrowsingHistory_API = "/v1/admin/portal-users/history"; // Will append /:id

// Roles APIs
export const GET_Roles_API = "/v1/roles";
export const CREATE_Role_API = "/v1/roles";
export const UPDATE_Role_API = "/v1/roles"; // Will append /:id
export const DELETE_Role_API = "/v1/roles"; // Will append /:id
export const ASSIGN_Role_API = "/v1/roles/assign";
export const REMOVE_Role_API = "/v1/roles"; // Will append /:roleId/users/:userId
export const GET_RoleUsers_API = "/v1/roles"; // Will append /:id/users

// Sources APIs
export const GET_Sources_API = "/v1/sources";
export const CREATE_Source_API = "/v1/sources";
export const UPDATE_Source_API = "/v1/sources"; // Will append /:id
export const DELETE_Source_API = "/v1/sources"; // Will append /:id
export const IMPORT_Sources_CSV_API = "/v1/sources/import-csv";

// Books APIs
export const GET_Books_API = "/v1/books";
export const CREATE_Book_API = "/v1/books";
export const UPDATE_Book_API = "/v1/books"; // Will append /:id
export const DELETE_Book_API = "/v1/books"; // Will append /:id
export const IMPORT_Books_CSV_API = "/v1/books/import-csv";

// Monument Sources APIs (Junction table)
export const GET_MonumentSources_API = "/v1/monument-sources";
export const CREATE_MonumentSource_API = "/v1/monument-sources";
export const UPDATE_MonumentSource_API = "/v1/monument-sources"; // Will append /:id
export const BULK_LINK_MonumentSources_API = "/v1/monument-sources/bulk";
export const DELETE_MonumentSource_API = "/v1/monument-sources"; // Will append /:id
export const GET_MonumentSources_ByMonument_API =
  "/v1/monument-sources/monument"; // Will append /:monumentId

// Monument Books APIs (Junction table)
export const GET_MonumentBooks_API = "/v1/monument-books";
export const CREATE_MonumentBook_API = "/v1/monument-books";
export const UPDATE_MonumentBook_API = "/v1/monument-books"; // Will append /:id
export const BULK_LINK_MonumentBooks_API = "/v1/monument-books/bulk";
export const DELETE_MonumentBook_API = "/v1/monument-books"; // Will append /:id
export const GET_MonumentBooks_ByMonument_API = "/v1/monument-books/monument"; // Will append /:monumentId
