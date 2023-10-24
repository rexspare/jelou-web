const coreLibraries = new Set([
    "react",
    "react-dom",
    "react-router-dom",
    "react-redux",
    "@reduxjs/toolkit",
    "lodash",
    "@headlessui/react",
    "@tippyjs/react",
    "axios",
    "react-multiselect-checkboxes",
    // A workspace library for a publish/subscribe
    // system of communication.
    // "@apps/shared",
    "@apps/shared/common",
    "@apps/shared/modules",
    "@apps/redux/store",
]);

module.exports = {
    name: "apps",
    // remotes: ["monitoring"],
    devtool: "source-map",
    shared: (libraryName, defaultConfig) => {
        if (coreLibraries.has(libraryName)) {
            return defaultConfig;
        }

        // Returning false means the library is not shared.
        return false;
    },
};
