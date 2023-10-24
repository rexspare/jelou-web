import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
export function SkeletonEmail(props) {
    return (
        <SkeletonTheme color="#e7e7e7" highlightColor="#44444412">
            <div className="mt-4 px-8 py-4">
                <Skeleton count={1} />
            </div>
            <div className="mt-4 w-3/5 px-10">
                <Skeleton count={1} />
            </div>
            <div className="bottom-line text-gray-15 relative flex w-full select-none items-center pt-10 pb-8 pl-6 pr-2">
                <div className="relative mr-3">
                    <Skeleton circle={true} height={48} width={48} />
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
            <span className=" block w-4/5 px-8">
                <Skeleton />
            </span>
            <div className="bottom-line text-gray-15 relative flex w-full select-none items-center pt-10 pb-8 pl-6 pr-2">
                <div className="relative mr-3">
                    <Skeleton circle={true} height={48} width={48} />
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
            <span className=" block w-4/5 px-8">
                <Skeleton />
            </span>
            <div className="bottom-line text-gray-15 relative flex w-full select-none items-center pt-10 pb-8 pl-6 pr-2">
                <div className="relative mr-3">
                    <Skeleton circle={true} height={48} width={48} />
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
            <span className=" block w-4/5 px-8">
                <Skeleton />
            </span>
        </SkeletonTheme>
    );
}
export default SkeletonEmail;
