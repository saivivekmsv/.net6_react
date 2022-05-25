import axios from "axios";
import { get, isEmpty } from "lodash";
import { apiDetails } from "./helpers";
import { ApplicationPaths } from "../components/api-authorization/ApiAuthorizationConstants";

function createFileAPIInstance() {
  const tokenKey = window.localStorage.getItem(
    "COREIIFrontenduser:https://coreretirement.azurewebsites.net:COREIIFrontend"
  );
  let authToken = get(JSON.parse(tokenKey), "access_token");

  const tokenHeader = {
    Authorization: `Bearer ${authToken}`,
  };

  const fileApi = axios.create({
    baseURL: apiDetails.baseUrl.trim(),
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "application/json", //"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ...tokenHeader,
    },
  });

  fileApi.interceptors.response.use(
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
  return fileApi;
}

export default createFileAPIInstance;
