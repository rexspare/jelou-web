import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";

// type Props = {
//     MAXIMUM_CHARACTERS: number;
//     MINIMUM_CHARACTERS: number;
//     countFieldLength: number;
//     showProgressbar?: boolean;
// };

export function CircularProgress({ MAXIMUM_CHARACTERS, MINIMUM_CHARACTERS, countFieldLength, showProgressbar = false, showError = false }) {
    const [percentageName, setPercentageName] = useState(0);

    const findPercentageCharName = (numPercentge) => {
        setPercentageName((numPercentge * 100) / MAXIMUM_CHARACTERS);
    };

    useEffect(() => {
        findPercentageCharName(countFieldLength);
    }, [countFieldLength]);

    return (
        <div className="">
            <div className="flex items-end justify-end ">
                <span className={showError ? 'pr-1 text-xs text-semantic-error' : 'pr-1 text-xs'}>{countFieldLength + `/${MAXIMUM_CHARACTERS}`}</span>
                {showProgressbar && (
                    <div className="" style={{ width: 18, height: 18 }}>
                        <CircularProgressbar value={percentageName} styles={{ path: { stroke: countFieldLength < MINIMUM_CHARACTERS ? "#f12b2c" : "#959DAF" } }} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default CircularProgress;
