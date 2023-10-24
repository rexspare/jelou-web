import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const NoteSkeleton = () => {
    return (
        <SkeletonTheme color="#e7e7e7" highlightColor="#44444412">
            <div className={`mt-4 flex w-full flex-col overflow-hidden rounded-12 border-default border-[#DCDEE4]`}>
                <div className="w-full bg-[#EFF1F4] object-center py-2 px-2">
                    <Skeleton className="text-rigt inline-flex h-3 w-full max-w-full rounded-lg text-base font-thin leading-normal text-white" />
                </div>
                <div className="px-2 py-2">
                    <Skeleton className="text-rigth inline-flex h-3 w-full max-w-full rounded-lg text-base font-thin leading-normal text-white" />
                    <Skeleton className="text-rigth inline-flex h-3 w-full max-w-full rounded-lg text-base font-thin leading-normal text-white" />
                </div>
            </div>
        </SkeletonTheme>
    );
};
export default NoteSkeleton;
