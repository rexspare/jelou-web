const { JELOU_API_V1 } = require("config");

export const JELOU = (enpoint) => `${JELOU_API_V1}${enpoint}`;
