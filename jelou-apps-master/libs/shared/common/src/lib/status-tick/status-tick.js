import React from "react";
import { CheckmarkIcon, DoubleCheckmarkIcon, CloseIcon } from "@apps/shared/icons";
import { MESSAGE_STATUSES } from "@apps/shared/constants";
import { ClipLoader } from "react-spinners";

const StatusTick = ({ status, color }) => {
    switch (status) {
        case MESSAGE_STATUSES.CREATED:
            return <CheckmarkIcon width="0.625rem" height="0.563rem" />;
        case MESSAGE_STATUSES.DELIVERED_CHANNEL:
            return <CheckmarkIcon width="0.625rem" height="0.563rem" />;
        case MESSAGE_STATUSES.DELIVERED_USER:
            return <DoubleCheckmarkIcon width="0.813rem" height="0.563rem" />;
        case MESSAGE_STATUSES.FAILED:
            return <CloseIcon className={`fill-current ${color}`} width="0.563rem" height="0.563rem" />;
        default:
            return <ClipLoader size={"0.625rem"} color="#00B3C7" />;
    }
};
export default StatusTick;
