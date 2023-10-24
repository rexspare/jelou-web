import trackerAxios from "@openreplay/tracker-axios";
import axios from "axios";
import Tracker from "./Tracker";

import has from "lodash/has";

const { JELOU_API_V1 } = require("config");

const JelouApiV1 = axios.create({
  baseURL: JELOU_API_V1,
});

Tracker.use(
  trackerAxios({
    instance: JelouApiV1,
    failuresOnly: false,
  })
);

JelouApiV1.interceptors.request.use((config) => {
  return {
    ...config,
    headers: {
      "Accept-Language": "es",
      ...(config.Authorization ? { Authorization: config.Authorization } : { Authorization: `Bearer ${localStorage.getItem("jwt")}` }),
    },
  };
});

JelouApiV1.interceptors.response.use(
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

export default JelouApiV1;
