import axios from "axios";
import { get, isEmpty } from "lodash";
import { apiDetails } from "./helpers";
import { ApplicationPaths } from "../../shared/components/api-authorization/ApiAuthorizationConstants";

function createAPIInstance() {
  const tokenKey = window.localStorage.getItem(
    "COREIIFrontenduser:https://coreretirement.azurewebsites.net:COREIIFrontend"
  );
  let authToken = get(JSON.parse(tokenKey), "access_token");

  const tokenHeader = {
    Authorization: `Bearer ${authToken}`,
  };

  const api = axios.create({
    baseURL: apiDetails.baseUrl.trim(),
    headers: { "Content-Type": "application/json", ...tokenHeader },
  });

  api.interceptors.response.use(
    (response) => {
      const errorResponse = get(response, "data.result.error", {});
      if (!isEmpty(errorResponse)) {
        throw errorResponse;
      }
      return response.data;
    },
    (error) => {
      if (error && error.response && error.response.status === 401) {
        window.location = ApplicationPaths.Login;
        return null;
      }
      return Promise.reject(error);
    }
  );
  return api;
}

export default createAPIInstance;
