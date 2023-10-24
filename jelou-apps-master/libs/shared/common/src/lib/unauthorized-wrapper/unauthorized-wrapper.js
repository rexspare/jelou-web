import React from "react";
import UnauthorizedView from "./unauthorized-view";

const UnauthorizedWrapper = (props) => {
    const { session } = props;

    return session && <UnauthorizedView />;
};

export default UnauthorizedWrapper;
