import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const SourcesSkeleton = () => {
    return (
        <SkeletonTheme color="#e7e7e7" highlightColor="#44444412">
            <div className="rounded-md border-1 border-neutral-200">
                <table className="min-w-full table-auto">
                    <thead className="sticky top-0 h-14 border-b-1 border-neutral-200">
                        <tr>
                            <th className="px-4" scope="col">
                                <Skeleton />
                            </th>
                        </tr>
                    </thead>
                    <tbody className="overflow-y-auto">
                        <tr className="h-14 items-center">
                            <td className="items-center px-4">
                                <Skeleton />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </SkeletonTheme>
    );
};

export default SourcesSkeleton;
