import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const TableSkeleton = (props) => {
    const { columns } = props;
    const cellStyles = {
        fontSize: "13px",
        whiteSpace: "nowrap",
        color: "#707C97",
        textAlign: "left",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        paddingBottom: "1rem",
        paddingTop: "1rem",
        lineHeight: "1.25rem",
        fontWeight: 500,
        backgroundColor: "#ffffff",
    };

    let loadingSkeleton = [];

    let index = 0;
    for (const column of columns) {
        const width = column.width ? column.width : column.Header.lenght;
        loadingSkeleton.push(
            <td style={cellStyles} key={index}>
                <SkeletonTheme color="#ecf0f1" highlightColor="#fafbfb">
                    <Skeleton width={width} />
                </SkeletonTheme>
            </td>
        );
        index++;
    }

    return (
        <tr role="row" className="jl-w-full jl-pr-5">
            {loadingSkeleton}
        </tr>
    );
};
export default TableSkeleton;
