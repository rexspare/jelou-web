import React from "react";
import { Detector } from "react-detect-offline";
import DetectorContext from "../detector-context/detector-context";

const { NX_REACT_APP_JELOU_API_BASE } = process.env;

const DetectorWrapper = ({ children }) => {
    const polling = {
        url: `${NX_REACT_APP_JELOU_API_BASE}/status`,
        interval: 30000,
    };
    return <Detector polling={polling} render={({ online }) => <DetectorContext.Provider value={online}>{children}</DetectorContext.Provider>} />;
};

export default DetectorWrapper;
