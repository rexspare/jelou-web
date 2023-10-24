import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
// import styles from "./circular-progress.module.css";

export function CircularProgress(props) {
    const { MAXIMUM_CHARACTERS, MINIMUM_CHARACTERS, countFieldLength } = props;
    let [percentageName, setPercentageName] = useState(0);

    const findPercentageCharName = (numPercentge) => {
        setPercentageName((numPercentge * 100) / MAXIMUM_CHARACTERS);
    };

    useEffect(() => {
        findPercentageCharName(countFieldLength);
    }, [countFieldLength]);

    return (
        <div className="">
            <div className="flex items-end justify-end ">
                <span className="pr-1 text-xs">{countFieldLength + `/${MAXIMUM_CHARACTERS}`}</span>
                <div className="" style={{ width: 18, height: 18 }}>
                    <CircularProgressbar value={percentageName} styles={{ path: { stroke: countFieldLength < MINIMUM_CHARACTERS ? "#f12b2c" : "#209F8B" } }} />
                </div>
            </div>
        </div>
    );
}
export default CircularProgress;
