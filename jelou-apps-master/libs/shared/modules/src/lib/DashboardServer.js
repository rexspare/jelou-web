import trackerAxios from "@openreplay/tracker-axios";
import axios from "axios";
import Tracker from "./Tracker";

const { DASHBOARD_SERVER } = require("config");

const DashboardServer = axios.create({
  baseURL: DASHBOARD_SERVER,
});

Tracker.use(
  trackerAxios({
    instance: DashboardServer,
    failuresOnly: false,
  })
);

export default DashboardServer;
