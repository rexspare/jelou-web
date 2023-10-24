import React from "react";
//import Dashboard from "@jelou-ui/dashboard";
//import "@jelou-ui/dashboard/dist/dashboard.css";

import { DashWrapper } from "@apps/shared/common";
import Metrics from "./metrics/Metrics";

const MetricsIndex = ({ ...rest }) => {
    return (
        // <DashWrapper>
        <Metrics {...rest} />
        // </DashWrapper>
    );
};

export default MetricsIndex;
