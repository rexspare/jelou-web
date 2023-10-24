import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const AutomaticMessagesSkeleton = () => {
    return (
        <div className="flex px-8 py-9">
            <SkeletonTheme color="#e7e7e7" highlightColor="#44444412">
                <div className="bottom-line relative flex w-full select-none flex-col items-center py-4 pr-2 text-gray-15">
                    <div className="w-full">
                        <div className="mb-1 flex items-center justify-between text-base font-medium">
                            <span className=" w-60 truncate">
                                <Skeleton />
                            </span>
                            <span className="text-xs">
                                <Skeleton />
                            </span>
                        </div>
                        <div className="mb-1 flex items-center justify-between text-base font-medium">
                            <span className=" w-48 truncate">
                                <Skeleton />
                            </span>
                            <span className="text-xs">
                                <Skeleton />
                            </span>
                        </div>

                        <div className="block w-60 truncate text-xs">
                            <Skeleton />
                        </div>
                        <div className="flex">
                            <div className="mr-3 block w-24 truncate text-xs">
                                <Skeleton className="h-9" />
                            </div>
                            <div className="block w-24 truncate text-xs">
                                <Skeleton className="h-9" />
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="mb-1 flex items-center justify-between text-base font-medium">
                            <span className=" w-48 truncate">
                                <Skeleton />
                            </span>
                            <span className="text-xs">
                                <Skeleton />
                            </span>
                        </div>

                        <div className="block w-72 truncate text-xs">
                            <Skeleton />
                        </div>
                        <div className="flex">
                            <div className="mr-3 block w-80 truncate text-xs">
                                <Skeleton className=" h-32" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 w-full">
                        <div className="mb-1 flex items-center justify-between text-base font-medium">
                            <span className=" w-48 truncate">
                                <Skeleton />
                            </span>
                            <span className="text-xs">
                                <Skeleton />
                            </span>
                        </div>

                        <div className="block w-72 truncate text-xs">
                            <Skeleton />
                        </div>
                        <div className="flex">
                            <div className="mr-3 block w-80 truncate text-xs">
                                <Skeleton className=" h-32" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 w-full">
                        <div className="mb-1 flex items-center justify-between text-base font-medium">
                            <span className=" w-48 truncate">
                                <Skeleton />
                            </span>
                            <span className="text-xs">
                                <Skeleton />
                            </span>
                        </div>

                        <div className="block w-72 truncate text-xs">
                            <Skeleton />
                        </div>
                        <div className="flex">
                            <div className="mr-3 block w-80 truncate text-xs">
                                <Skeleton className=" h-32" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 w-full">
                        <div className="mb-1 flex items-center justify-between text-base font-medium">
                            <span className=" w-48 truncate">
                                <Skeleton />
                            </span>
                            <span className="text-xs">
                                <Skeleton />
                            </span>
                        </div>
                        <div className="block w-72 truncate text-xs">
                            <Skeleton />
                        </div>
                        <div className="flex">
                            <div className="mr-3 block w-80 truncate text-xs">
                                <Skeleton className=" h-32" />
                            </div>
                        </div>
                    </div>
                </div>
            </SkeletonTheme>
        </div>
    );
};

export default AutomaticMessagesSkeleton;
