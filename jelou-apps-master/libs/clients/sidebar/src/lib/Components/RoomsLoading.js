import React from "react";
import { SidebarSkeleton } from "@apps/shared/common";

const RoomsLoading = () => {
    let loadingSkeleton = [];

    for (let i = 0; i < 8; i++) {
        loadingSkeleton.push(<SidebarSkeleton key={i} />);
    }

    return <div>{loadingSkeleton}</div>;
};

export default RoomsLoading;
