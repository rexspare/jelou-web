/* eslint-disable */
export default {
    displayName: "monitoring-live-tickets-components",
    preset: "../../../../../jest.preset.js",
    transform: {
        "^.+\\.[tj]sx?$": ["babel-jest", { presets: ["@nx/react/babel"] }],
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    coverageDirectory: "../../../../../coverage/libs/monitoring/live/tickets/components",
};
