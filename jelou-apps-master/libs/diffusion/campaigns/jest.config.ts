/* eslint-disable */
export default {
    displayName: "diffusion-campaigns",
    preset: "../../../jest.preset.js",
    transform: {
        "^.+\\.[tj]sx?$": ["babel-jest", { presets: ["@nx/react/babel"] }],
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    coverageDirectory: "../../../coverage/libs/diffusion/campaigns",
};
