import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import styles from "./bubble.module.css";

const ColumnSkeleton = () => {
    return (
        <SkeletonTheme color="#e7e7e7" highlightColor="#44444412">
            <div className={`${styles.bubble}`}>
                <div className="my-1 ml-2 w-full max-w-xxs px-3 text-center md:max-w-sm">
                    <span className="w-40 truncate">
                        <Skeleton height={"1.5rem"} />
                    </span>
                </div>
            </div>
        </SkeletonTheme>
    );
};
export default ColumnSkeleton;
