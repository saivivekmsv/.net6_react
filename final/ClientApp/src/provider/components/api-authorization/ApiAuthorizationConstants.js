export const ApplicationName = "COREIIFrontend";

export const QueryParameterNames = {
  ReturnUrl: "returnUrl",
  Message: "message",
};

export const LogoutActions = {
  LogoutCallback: "logout-callback",
  Logout: "logout",
  LoggedOut: "logged-out",
};

export const LoginActions = {
  Login: "login",
  LoginCallback: "login-callback",
  LoginFailed: "login-failed",
  Profile: "profile",
  Register: "register",
};

export const IdentitySettings = {
  Authority: process.env.REACT_APP_AUTHENTICATION_BASE_URL,
};

const IdentityUrl = process.env.REACT_APP_AUTHENTICATION_BASE_URL;
const prefix = "/authentication";

export const ApplicationPaths = {
  DefaultLoginRedirectPath: "/",
  ApiAuthorizationClientConfigurationUrl: `${IdentityUrl}/_configuration/${ApplicationName}`,
  ApiAuthorizationPrefix: prefix,
  Login: `${prefix}/${LoginActions.Login}`,
  LoginFailed: `${prefix}/${LoginActions.LoginFailed}`,
  LoginCallback: `${prefix}/${LoginActions.LoginCallback}`,
  Register: `${prefix}/${LoginActions.Register}`,
  Profile: `${prefix}/${LoginActions.Profile}`,
  LogOut: `${prefix}/${LogoutActions.Logout}`,
  LoggedOut: `${prefix}/${LogoutActions.LoggedOut}`,
  LogOutCallback: `${prefix}/${LogoutActions.LogoutCallback}`,
  IdentityRegisterPath: "/Identity/Account/Register",
  IdentityManagePath: "/Identity/Account/Manage",
};
