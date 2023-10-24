import { getTimeRelative } from "@apps/shared/utils";
import { useSelector } from "react-redux";

const Question = (props) => {
    const { question, createdAt } = props;
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    const time = getTimeRelative(createdAt, lang);

    return (
        <div className="flex flex-1 justify-end">
            <div className="my-2 flex max-w-[80%] flex-col rounded-lg bg-neutral-50 p-2 px-3">
                <div className="break-words text-sm text-gray-610">{question}</div>
                <span className="text-right text-11 text-gray-610/60">{time}</span>
            </div>
        </div>
    );
};

export default Question;
