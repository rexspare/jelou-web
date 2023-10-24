import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const PostSkeleton = () => {
    return (
        <SkeletonTheme color="#e7e7e7" highlightColor="#44444412">
            <div className="top-0 z-10 w-full bg-white px-4 py-4 md:pt-4 md:pb-3">
                <div className="border-b-default border-gray-400 border-opacity-25 pb-4 last:border-b-0">
                    <div className="mb-2 flex items-center">
                        <Skeleton className="mr-3" circle={true} height={39} width={39} />
                        <div className="flex flex-1 justify-between">
                            <div className="flex-1">
                                <div className="mb-1 flex items-center justify-between text-base font-medium">
                                    <span className="w-40 truncate">
                                        <Skeleton />
                                    </span>
                                    <span className="text-xs">
                                        <Skeleton />
                                    </span>
                                </div>
                                <div className="block w-48 truncate text-xs">
                                    <Skeleton />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-1 w-auto">
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                    </div>
                    <div className="w-60">
                        <Skeleton />
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};
export default PostSkeleton;
