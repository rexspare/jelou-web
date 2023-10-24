import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const RowsSkeleton = ({ numRows = 4 }) => {
    const skeletonRows = Array.from({ length: numRows }, (_, index) => (
        <Skeleton key={index} />
    ));

    return (
        <SkeletonTheme color="#e7e7e7" highlightColor="#44444412">
            <div className="mb-5 flex flex-row items-center justify-between">
                {skeletonRows[0]}
            </div>
            <div className="flex flex-col gap-4">
                {skeletonRows}
            </div>
        </SkeletonTheme>
    );
};

export default RowsSkeleton;