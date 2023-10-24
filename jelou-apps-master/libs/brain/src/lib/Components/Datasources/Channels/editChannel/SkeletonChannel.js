import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export default function SkeletonChannel() {
    return (
        <SkeletonTheme color="#e7e7e7" highlightColor="#44444412">
            <div className="flex flex-col p-6 px-8">
                <Skeleton height="1rem" width="10%" />
                <Skeleton height="2.8rem" width="50%" />
                <div className="flex flex-col space-y-2 py-6">
                    <Skeleton height="1rem" width="10%" />
                    <Skeleton height="2.5rem" width="50%" />
                    <Skeleton height="2.5rem" width="50%" />
                </div>
                <div className="flex flex-col space-y-3 border-t-1 border-gray-34 py-5">
                    <Skeleton height="2.2rem" width="50%" />
                    <Skeleton height="2.2rem" width="8rem" style={{ borderRadius: 100 }} />
                </div>
                <div className="flex flex-col space-y-3 border-t-1 border-gray-34 py-5">
                    <Skeleton height="1.2rem" width="15%" />
                    <Skeleton height="2.2rem" width="50%" />
                    <Skeleton height="2.2rem" width="8rem" style={{ borderRadius: 100 }} />
                </div>
            </div>
        </SkeletonTheme>
    );
}
