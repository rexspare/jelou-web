import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import styles from "./bubble.module.css";

const ConversationSkeleton = () => {
    return (
        <SkeletonTheme color="#e7e7e7" highlightColor="#44444412">
            <div className={styles.bubble}>
                <div className="ml-2 w-full max-w-xxs text-left md:max-w-sm">
                    <Skeleton className="linkify linkify--left inline-flex h-10 w-full max-w-full rounded-lg py-2 px-3 text-left text-base font-thin leading-normal text-white" />
                </div>
            </div>

            <div className={`${styles.bubble} ${styles["bubble--right"]}`}>
                <div className="w-full max-w-xxs text-right md:max-w-sm">
                    <Skeleton className="text-rigth linkify linkify--right inline-flex h-10 w-full max-w-full rounded-lg py-2 px-3 text-base font-thin leading-normal text-white" />
                </div>
            </div>
        </SkeletonTheme>
    );
};
export default ConversationSkeleton;
