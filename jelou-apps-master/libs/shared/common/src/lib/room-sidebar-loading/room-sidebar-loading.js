import React from "react";
import SidebarSkeleton from "../skeleton/SidebarSkeleton";

const RoomSidebarLoading = () => {
    let loadingSkeleton = [];

    for (let i = 0; i < 8; i++) {
        loadingSkeleton.push(<SidebarSkeleton key={i} />);
    }

    return <div>{loadingSkeleton}</div>;
};

export default RoomSidebarLoading;
