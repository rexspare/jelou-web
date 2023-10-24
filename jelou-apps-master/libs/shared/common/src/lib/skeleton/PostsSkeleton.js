import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const PostsSkeleton = (props) => {
    return (
        <SkeletonTheme color="#e7e7e7" highlightColor="#44444412">
            <div className="flex flex-1 flex-col overflow-x-hidden">
                <div className="mx-auto space-y-4 lg:flex lg:flex-col">
                    <div className="flex w-full flex-col">
                        <div className="flex flex-row overflow-hidden rounded-12">
                            <div className={`relative flex flex-col overflow-hidden rounded-12 bg-white ${props.width ? props.width : "w-88"}`}>
                                <div className="top-0 z-10 w-full rounded-12 bg-white px-3 py-4 md:px-8 md:py-5">
                                    <div className="flex flex-col items-center">
                                        <div className="relative flex w-full select-none items-center pb-4">
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

                                                <div className="block w-48 truncate text-xs sm:w-32 lg:w-48">
                                                    <Skeleton />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full text-13">
                                            <Skeleton />
                                        </div>
                                        <div className="w-full text-13">
                                            <Skeleton />
                                        </div>
                                        <div className="w-full text-13">
                                            <Skeleton />
                                        </div>
                                        <div className="w-full text-13">
                                            <Skeleton />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default PostsSkeleton;
