import toUpper from "lodash/toUpper";
import toLower from "lodash/toLower";
import isObject from "lodash/isObject";

import { formatMessage } from "@apps/shared/utils";

const MessagePreview = (props) => {
    const { message } = props.message;
    const { by } = props.message;

    if (!message) {
        return <span></span>;
    }

    const { type, text } = message;
    const truncate_user = "truncate text-13 block text-gray-400 font-medium w-48 sm:w-32 mid:w-56 xxl:w-64";
    const truncate = "truncate text-13 block text-gray-400 font-medium w-48 sm:w-32 mid:w-56 xxl:w-64";

    if (isObject(message.text)) {
        return <span className="block w-48 truncate text-13 font-medium text-gray-400 sm:w-32 mid:w-56 xxl:w-64">Invalid Message</span>;
    }

    try {
        switch (toUpper(type)) {
            case "TEXT":
                if (toUpper(by) === "USER") {
                    return formatMessage(text, truncate_user);
                } else {
                    return <div className="mb-1 flex flex-row items-center">{formatMessage(text, truncate)}</div>;
                }
            default:
                if (toUpper(by) === "USER") {
                    return (
                        <span className="mb-1 block w-48 truncate text-13 font-medium capitalize text-gray-400 sm:w-32 mid:w-56 xxl:w-64">
                            {toLower(message.type)}
                        </span>
                    );
                } else {
                    return (
                        <div className="mb-1 flex flex-row items-center">
                            <span className="ml-1 block w-48 truncate text-13 font-medium capitalize text-gray-400 sm:w-32 mid:w-56 xxl:w-64">
                                {toLower(message.type)}
                            </span>
                        </div>
                    );
                }
        }
    } catch (error) {
        console.log(error);
    }
};
export default MessagePreview;
