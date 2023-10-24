import OpenReplay from "@openreplay/tracker";
import trackerAssist from "@openreplay/tracker-assist";

const {
  NX_REACT_APP_OPEN_REPLAY_TRACKER_ID,
  // NX_REACT_APP_OPEN_REPLAY_TRACKER_URL
} = process.env;
const { IS_PRODUCTION } = require("config");

const tracker = new OpenReplay({
  projectKey: NX_REACT_APP_OPEN_REPLAY_TRACKER_ID,
  obscureTextEmails: false,
  obscureTextNumbers: false,
  obscureInputEmails: false,
  respectDoNotTrack: !IS_PRODUCTION,
  __DISABLE_SECURE_MODE: !IS_PRODUCTION,
  network: {
    capturePayload: true, // Capture HTTP payload
    sessionTokenHeader: true,
    ignoreHeaders: false,
  },
});

tracker.use(
  trackerAssist({
    callConfirm: {
      text: "Soporte técnico desea comunicarse contigo",
      confirmBtn: "Contestar",
      declineBtn: "Rechazar",
    },
    controlConfirm: {
      text: "El agente solicitó el control remoto",
      confirmBtn: "Aceptar",
      declineBtn: "Rechazar",
    },
  })
);

export default tracker;
