/* eslint-disable */
export default {
    displayName: "shared-img",
    preset: "../../../jest.preset.js",
    transform: {
        "^.+\\.[tj]sx?$": ["babel-jest", { presets: ["@nx/react/babel"] }],
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "svg"],
    coverageDirectory: "../../../coverage/libs/shared/img",
};
