/* eslint-disable */
export default {
    displayName: "monitoring-operators",
    preset: "../../../jest.preset.js",
    transform: {
        "^.+\\.[tj]sx?$": ["babel-jest", { presets: ["@nx/react/babel"] }],
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    coverageDirectory: "../../../coverage/libs/monitoring/operators",
};
