import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const OptionSkeleton = () => {
    return (
        <SkeletonTheme color="#e7e7e7" highlightColor="#44444412">
            <div className="flex-1">
                <div className="mb-1 flex items-center justify-between text-base font-medium">
                    <span className="w-24 truncate pb-2">
                        <Skeleton className="h-6 w-full" />
                    </span>
                </div>
                <div className="block w-48 truncate text-xs">
                    <Skeleton className="h-8 w-full" />
                </div>
            </div>
        </SkeletonTheme>
    );
};

const ConversationSidebarSkeleton = () => {
    let loadingSkeleton = [];

    for (let i = 0; i < 8; i++) {
        loadingSkeleton.push(<OptionSkeleton key={i} />);
    }

    return (
        <SkeletonTheme color="#e7e7e7" highlightColor="#44444412">
            <div className="w-auto border-b-1 border-black/10">
                <div className="flex h-[4.53rem] w-full items-center justify-around text-left">
                    <Skeleton className="" height={20} width={30} />
                    <Skeleton className="" height={20} width={30} />
                    <Skeleton className="" height={20} width={30} />
                </div>
            </div>
            <div>
                <div className="flex w-full flex-col content-around items-center justify-around space-y-6 p-4 text-left">{loadingSkeleton}</div>
            </div>
        </SkeletonTheme>
    );
};
export default ConversationSidebarSkeleton;
