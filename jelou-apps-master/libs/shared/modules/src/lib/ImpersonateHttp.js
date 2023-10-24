import trackerAxios from "@openreplay/tracker-axios";
import axios from "axios";
import Tracker from "./Tracker";

import has from "lodash/has";

const { DASHBOARD_SERVER } = require("config");

const ImpersonateHttp = axios.create({
  baseURL: DASHBOARD_SERVER,
});

Tracker.use(
  trackerAxios({
    instance: ImpersonateHttp,
    failuresOnly: false,
  })
);

ImpersonateHttp.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (has(error, "response.status") && error.response.status === 401) {
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default ImpersonateHttp;
