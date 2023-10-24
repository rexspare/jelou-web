import React from "react";

const DashWrapper = ({ padding = true, children }) => {
    return <div className={`ml-18 w-full flex-1 ${padding && "p-10"}`}>{children}</div>;
};

export default DashWrapper;

