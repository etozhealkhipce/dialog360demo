import wretch from "wretch";
import FormDataAddon from "wretch/addons/formData";
import QueryStringAddon from "wretch/addons/queryString";

import { NetworkException } from "./exceptions";

const isProduction = import.meta.env.PROD;
const baseUrl = isProduction
  ? "https://waba-sandbox.360dialog.io/v1/"
  : "/api/";

// ONLY RELATIVE path to the API
export const httpClient = wretch(baseUrl)
  .addon(QueryStringAddon)
  .addon(FormDataAddon)
  .catcherFallback((error) => {
    if (error.json) {
      throw error.json;
    }

    if (error.response?.status === 404) {
      throw new NetworkException("NotFound");
    }

    if (error.response?.status === 429) {
      throw new NetworkException("TooManyRequests");
    }

    if (error.response?.status === 401) {
      throw new NetworkException("Unauthorized");
    }

    throw new NetworkException("Unknown");
  })
  .errorType("json")
  .resolve((r) => r.json());
