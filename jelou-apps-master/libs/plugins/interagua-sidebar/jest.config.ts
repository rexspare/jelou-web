/* eslint-disable */
/* eslint-disable */
export default {
    displayName: "plugins-interagua-sidebar",
    preset: "../../../jest.preset.js",
    transform: {
        "^.+\\.[tj]sx?$": ["babel-jest", { presets: ["@nx/react/babel"] }],
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    coverageDirectory: "../../../coverage/libs/plugins/interagua-sidebar",
};
