import get from "lodash/get";
import isObject from "lodash/isObject";
import toUpper from "lodash/toUpper";
import toLower from "lodash/toLower";
import isEmpty from "lodash/isEmpty";
import { useSelector } from "react-redux";
import Highlighter from "react-highlight-words";

const MessagePreview = (props) => {
    const { message, search = {}, query } = props;
    const archivedSearchBy = useSelector((state) => state.archivedSearchBy);

    if (!message) {
        return <span></span>;
    }

    const type = get(search, "type", "");
    const text = get(search, "text", "");

    if (isObject(message.text)) {
        return <span className="block w-48 truncate text-sm font-medium text-gray-400 sm:w-32 mid:w-56 xxl:w-64">Invalid Message</span>;
    }

    const splitQuery = query.split(" ");

    try {
        switch (toUpper(type)) {
            case "TEXT":
                const truncate_user = `${text.length > 25 && "w-56 mid:w-48 2xl:w-64"} truncate text-xs block text-gray-400 font-medium pb-1`;
                return !isEmpty(search) && get(archivedSearchBy, "text", "text") === "text" ? (
                    <div className={`${truncate_user}`}>
                        <Highlighter
                            highlightClassName="YourHighlightClass"
                            searchWords={splitQuery.length > 1 ? splitQuery : [query]}
                            autoEscape={true}
                            textToHighlight={text}
                        />
                    </div>
                ) : (
                    <div className={`${truncate_user}`}>{text}</div>
                );

            default:
                return (
                    <span className="mb-1 block w-48 truncate text-xs font-medium capitalize text-gray-400 sm:w-32 mid:w-56 xxl:w-64">
                        {toLower(message.type)}
                    </span>
                );
        }
    } catch (error) {
        return null;
    }
};

export default MessagePreview;
