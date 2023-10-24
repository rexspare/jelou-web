import { useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import toUpper from "lodash/toUpper";

import { withTranslation } from "react-i18next";

const Stats = (props) => {
    const { title, loading, number, t } = props;
    const actualConversationNotReplied = useSelector((state) => state.actualConversationNotReplied);
    let numberColor = actualConversationNotReplied > 0 ? "bg-red-400" : "bg-green-200";
    let color = props.color ? props.color : "bg-white shadow-outline-input";
    let width = props.width ? props.width : "flex-1";

    const actualCases = toUpper(props.title) === "CASOS ACTUALES" || toUpper(props.title) === "ACTUAL CASES";

    return (
        <div className={`${width} flex overflow-hidden rounded-xl ${color}`}>
            <div className="flex-1 px-10 py-7 lg:px-4 lg:py-5">
                <dl className="flex flex-col">
                    {loading ? (
                        <div className="mt-1 w-1/2 leading-9">
                            <BeatLoader color={"#00B3C7"} size={"0.5rem"} />
                        </div>
                    ) : (
                        <dd className="font-bold leading-9 text-gray-500 sm:text-2xl">{number}</dd>
                    )}
                    <dt className="text-sm font-bold leading-5 text-gray-500 xxl:text-15">{title}</dt>
                </dl>
                {actualCases && (
                    <div
                        className={`mt-4 rounded-full py-1 text-10 font-bold text-gray-500 xxl:text-11 ${numberColor} bg-opacity-25 px-2`}>{`${actualConversationNotReplied} ${t(
                        "por Atender"
                    )}`}</div>
                )}
            </div>
        </div>
    );
};
export default withTranslation()(Stats);
