import React from "react";
import { SidebarSkeleton } from "@apps/shared/common";

const ArchiveLoading = () => {
    let loadingSkeleton = [];

    for (let i = 0; i < 7; i++) {
        loadingSkeleton.push(<SidebarSkeleton key={i} />);
    }

    return <div>{loadingSkeleton}</div>;
};

export default ArchiveLoading;
