import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const GeneralBotsSkeleton = () => {
    return (
        <div className="flex px-8 py-9">
            <SkeletonTheme color="#e7e7e7" highlightColor="#44444412">
                <div className="bottom-line relative flex w-full select-none items-center py-4 text-gray-15">
                    <div className="relative mr-3 self-start">
                        <Skeleton height={14} width={14} />
                    </div>
                    <div className="w-full">
                        <div className="mb-1 flex items-center justify-between text-base font-medium">
                            <span className="w-40 truncate">
                                <Skeleton />
                            </span>
                            <span className="text-xs">
                                <Skeleton />
                            </span>
                        </div>

                        <div className="block w-72 truncate text-xs">
                            <Skeleton />
                        </div>
                        <div className="block  w-24 truncate text-xs">
                            <Skeleton />
                        </div>
                    </div>
                </div>
                <div className="bottom-line relative flex w-full select-none items-center py-4 text-gray-15">
                    <div className="relative mr-3 self-start">
                        <Skeleton height={14} width={14} />
                    </div>
                    <div className="w-full">
                        <div className="mb-1 flex items-center justify-between text-base font-medium">
                            <span className="w-40 truncate">
                                <Skeleton />
                            </span>
                            <span className="text-xs">
                                <Skeleton />
                            </span>
                        </div>

                        <div className="block w-72 truncate text-xs">
                            <Skeleton />
                        </div>
                        <div className="block  w-24 truncate text-xs">
                            <Skeleton />
                        </div>
                    </div>
                </div>

                <div className="bottom-line relative mt-6 flex w-full select-none items-center py-4 text-gray-15">
                    <div className="w-full">
                        <div className="mb-1 flex items-center justify-between text-base font-medium">
                            <span className=" w-40 truncate">
                                <Skeleton />
                            </span>
                            <span className="text-xs">
                                <Skeleton />
                            </span>
                        </div>

                        <div className="block w-78 truncate text-xs">
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
                </div>
                <div className="bottom-line relative flex w-full select-none items-center py-4  text-gray-15">
                    <div className="w-full">
                        <div className="mb-1 flex items-center justify-between text-base font-medium">
                            <span className=" w-40 truncate">
                                <Skeleton />
                            </span>
                            <span className="text-xs">
                                <Skeleton />
                            </span>
                        </div>

                        <div className="block w-78 truncate text-xs">
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
                </div>
                <div className="bottom-line relative flex w-full select-none items-center py-4 text-gray-15">
                    <div className="w-full">
                        <div className="mb-1 flex items-center justify-between text-base font-medium">
                            <span className=" w-40 truncate">
                                <Skeleton />
                            </span>
                            <span className="text-xs">
                                <Skeleton />
                            </span>
                        </div>

                        <div className="block w-78 truncate text-xs">
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
                </div>
                <div className="bottom-line relative flex w-full select-none items-center py-4 text-gray-15">
                    <div className="w-full">
                        <div className="mb-1 flex items-center justify-between text-base font-medium">
                            <span className=" w-40 truncate">
                                <Skeleton />
                            </span>
                            <span className="text-xs">
                                <Skeleton />
                            </span>
                        </div>

                        <div className="block w-78 truncate text-xs">
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
                </div>
                <div className="bottom-line relative flex w-full select-none items-center py-4 text-gray-15">
                    <div className="w-full">
                        <div className="mb-1 flex items-center justify-between text-base font-medium">
                            <span className=" w-40 truncate">
                                <Skeleton />
                            </span>
                            <span className="text-xs">
                                <Skeleton />
                            </span>
                        </div>

                        <div className="block w-78 truncate text-xs">
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
                </div>
            </SkeletonTheme>
        </div>
    );
};

export default GeneralBotsSkeleton;
