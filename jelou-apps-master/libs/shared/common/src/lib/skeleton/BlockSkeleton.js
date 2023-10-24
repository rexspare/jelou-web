import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const BlockSkeleton = () => {
    return (
        <SkeletonTheme color="#e7e7e7" highlightColor="#44444412">
            <div className="top-0 z-10 w-full bg-white px-4 py-4 md:pt-4 md:pb-3">
                <div className="border-b-default border-gray-400 border-opacity-25 pb-4 last:border-b-0">
                    <div className="mb-1 w-auto">
                        <Skeleton count={6} />
                    </div>
                    <div className="mb-2 flex items-center justify-between">
                        <div className="w-48">
                            <Skeleton className="mr-3 rounded-full" height={30} borderRadius={"1rem"} />
                        </div>
                        <div className="flex space-x-3">
                            <div className="block w-32 truncate text-xs">
                                <Skeleton height={30} style={{ borderRadius: 10 }} />
                            </div>
                            <div className="block w-32 truncate text-xs">
                                <Skeleton height={30} style={{ borderRadius: 10 }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};
export default BlockSkeleton;
