import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const SidebarSkeleton = () => {
    return (
        <SkeletonTheme color="#e7e7e7" highlightColor="#44444412">
            <div className="bottom-line relative flex w-full select-none items-center py-4 pl-6 pr-2 text-gray-15">
                <div className="relative mr-3">
                    <Skeleton circle={true} height={38} width={38} />
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

                    <div className="block w-48 truncate text-xs">
                        <Skeleton />
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};
export default SidebarSkeleton;
