import React from "react";
import Loadable from "react-loadable";
import { GridLoader } from "react-spinners";

/* Add plugins here */
const plugins = {
    "@01labec/datafast-plugin": Loadable({
        loader: () => import("@01labec/datafast-plugin"),
        loading: () => (
            <div className="border-border xxl:w-96 max-w-28 hidden flex-col items-center justify-center rounded-r-xs border-l-default bg-white md:p-4 mid:relative mid:flex mid:w-56 lg:w-70 xxl:p-5">
                <GridLoader size={"0.625rem"} color="#00b3c7" />
            </div>
        ),
    }),
    "@01labec/datafast-pruebas": Loadable({
        loader: () => import("@01labec/datafast-pruebas"),
        loading: () => (
            <div className="border-border xxl:w-96 max-w-28 hidden flex-col items-center justify-center rounded-r-xs border-l-default bg-white md:p-4 mid:relative mid:flex mid:w-56 lg:w-70 xxl:p-5">
                <GridLoader size={"0.625rem"} color="#00b3c7" />
            </div>
        ),
    }),
    "@01labec/interagua-sidebar": Loadable({
        loader: () => import("@01labec/interagua-sidebar"),
        loading: () => (
            <div className="border-border xxl:w-96 max-w-28 hidden flex-col items-center justify-center rounded-r-xs border-l-default bg-white md:p-4 mid:relative mid:flex mid:w-56 lg:w-70 xxl:p-5">
                <GridLoader size={"0.625rem"} color="#00b3c7" />
            </div>
        ),
    }),
    "@01labec/utpl-2-sidebar": Loadable({
        loader: () => import("@01labec/utpl-2-sidebar"),
        loading: () => (
            <div className="border-border xxl:w-96 max-w-28 hidden flex-col items-center justify-center rounded-r-xs border-l-default bg-white md:p-4 mid:relative mid:flex mid:w-56 lg:w-70 xxl:p-5">
                <GridLoader size={"0.625rem"} color="#00b3c7" />
            </div>
        ),
    }),
    "@01labec/utpl-sidebar": Loadable({
        loader: () => import("@01labec/utpl-sidebar"),
        loading: () => (
            <div className="border-border xxl:w-96 max-w-28 hidden flex-col items-center justify-center rounded-r-xs border-l-default bg-white md:p-4 mid:relative mid:flex mid:w-56 lg:w-70 xxl:p-5">
                <GridLoader size={"0.625rem"} color="#00b3c7" />
            </div>
        ),
    }),
    "@01labec/oscus-sidebar": Loadable({
        loader: () => import("@01labec/oscus-sidebar"),
        loading: () => (
            <div className="border-l border-border xxl:w-96 max-w-28 hidden flex-col items-center justify-center rounded-r-xs bg-white md:p-4 mid:relative mid:flex mid:w-56 lg:w-70 xxl:p-5">
                <GridLoader size={"0.625rem"} color="#00b3c7" />
            </div>
        ),
    }),
};

export default plugins;
