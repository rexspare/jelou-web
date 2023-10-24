/* eslint-disable */
module.exports = {
    displayName: "plugins-gea-ecuador-sidebar",
    preset: "../../../jest.preset.js",
    globals: {},
    transform: {
        "^.+\\.[tj]sx?$": [
            "ts-jest",
            {
                tsconfig: "<rootDir>/tsconfig.spec.json",
            },
        ],
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    coverageDirectory: "../../../coverage/libs/plugins/gea-ecuador-sidebar",
};
