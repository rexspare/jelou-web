import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const PostsSkeleton = () => {
    return (
        <SkeletonTheme color="#e7e7e7" highlightColor="#44444412">
            <div className="flex h-full w-70 flex-row justify-center overflow-hidden overflow-y-hidden bg-white px-3 py-4 text-gray-500 shadow-loading md:px-8 md:py-5 lg:rounded-xl">
                <div className="flex w-full flex-col items-center">
                    <div className="relative mt-8 flex flex-col justify-center">
                        <div className="relative mb-3">
                            <Skeleton circle={true} height={58} width={58} />
                        </div>
                    </div>
                    <div className="mb-5">
                        <div className="block w-48 truncate text-xs sm:w-32 lg:w-48">
                            <Skeleton />
                        </div>
                        <div className="block w-48 truncate text-xs sm:w-32 lg:w-48">
                            <Skeleton />
                        </div>
                    </div>

                    <div className="mb-2 w-full text-13">
                        <Skeleton />
                    </div>
                    <div className="mb-2 w-full text-13">
                        <Skeleton />
                    </div>
                    <div className="mb-2 w-full text-13">
                        <Skeleton />
                    </div>
                    <div className="mb-2 w-full text-13">
                        <Skeleton />
                    </div>
                    <div className="mb-2 w-full text-13">
                        <Skeleton />
                    </div>
                    <div className="mb-2 w-full text-13">
                        <Skeleton />
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default PostsSkeleton;
