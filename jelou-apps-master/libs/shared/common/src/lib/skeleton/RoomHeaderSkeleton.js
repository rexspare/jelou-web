import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const RoomHeaderSkeleton = () => {
    return (
        <SkeletonTheme color="#e7e7e7" highlightColor="#44444412">
            <div className="mb-2 flex items-center px-8">
                <Skeleton className="mr-3" circle={true} height={39} width={39} />
                <div className="flex flex-1 justify-between">
                    <div className="flex-1">
                        <div className="mb-1 flex items-center justify-between text-base font-medium">
                            <span className="w-40 truncate">
                                <Skeleton />
                            </span>
                        </div>
                        <div className="block w-48 truncate text-xs">
                            <Skeleton />
                        </div>
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};
export default RoomHeaderSkeleton;
