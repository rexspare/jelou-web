import trackerAxios from "@openreplay/tracker-axios";
import axios from "axios";
import Tracker from "./Tracker";

const { JELOU_METRICS_API } = require("config");

const MetricServer = axios.create({
  baseURL: JELOU_METRICS_API,
});

Tracker.use(
  trackerAxios({
    instance: MetricServer,
    failuresOnly: false,
  })
);

export default MetricServer;
