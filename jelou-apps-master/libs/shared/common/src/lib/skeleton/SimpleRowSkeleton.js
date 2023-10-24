import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const SimpleRowSkeleton = () => {
    return (
        <SkeletonTheme color="#e7e7e7" highlightColor="#44444412">
            <div className="relative bottom-line py-4 pl-6 pr-2 flex items-center w-full select-none">
                <div className="relative mr-3">
                    <Skeleton circle={true} height={38} width={38} />
                </div>
                <div className="w-full">
                    <div className="mb-1 flex justify-between items-center text-base font-medium">
                        <span className="w-40 truncate">
                            <Skeleton />
                        </span>
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};
export default SimpleRowSkeleton;
