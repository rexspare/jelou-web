import get from "lodash/get";
import toUpper from "lodash/toUpper";
import toLower from "lodash/toLower";
import isObject from "lodash/isObject";
import { formatMessage } from "@apps/shared/utils";

const MessagePreview = (props) => {
    const message = get(props, "message.message", get(props, "message.bubble", null));

    const { by } = props.message;

    const names = get(props, "message.sender.names", "");

    if (!message) {
        return <span></span>;
    }

    const type = get(message, "type", "");
    const text = get(message, "text", "");
    const slug = get(message, "slug");

    const getMessage = () => {
        switch (toUpper(slug)) {
            case "ASSIGNED":
                return (
                    <span className="mb-1 block w-48 truncate text-13 font-medium text-gray-400 sm:w-32 mid:w-56 xxl:w-64">Asignado a {names}</span>
                );
            case "TIME_END":
                return (
                    <span className="mb-1 block w-48 truncate text-13 font-medium text-gray-400 sm:w-32 mid:w-56 xxl:w-64">
                        Conversación expirada
                    </span>
                );
            case "REMOVE_USER":
                return (
                    <span className="mb-1 block w-48 truncate text-13 font-medium text-gray-400 sm:w-32 mid:w-56 xxl:w-64">
                        Conversación finalizada
                    </span>
                );
            case "SWITCH_OPERATOR_FROM":
                return (
                    <span className="mb-1 block w-48 truncate text-13 font-medium text-gray-400 sm:w-32 mid:w-56 xxl:w-64">
                        Transferido a {get(props, "message.newOperator.names", "")}
                    </span>
                );
            default:
                return (
                    <span className="mb-1 block w-48 truncate text-13 font-medium text-gray-400 sm:w-32 mid:w-56 xxl:w-64">
                        {get(message, "message.description", get(message, "bubble.description", "Sin Descripción"))}
                    </span>
                );
        }
    };

    if (isObject(message.text)) {
        return <span className="block w-48 truncate text-sm font-medium text-gray-400 sm:w-32 mid:w-56 xxl:w-64">Invalid Message</span>;
    }

    try {
        switch (toUpper(type)) {
            case "TEXT":
                if (toUpper(by) === "USER") {
                    const truncate_user = `${
                        text.length > 25 ? "w-56 mid:w-48 2xl:w-64" : ""
                    } truncate text-13 sm:text-sm block text-gray-400 font-medium pb-1`;
                    return formatMessage(text, truncate_user);
                } else {
                    const truncate = `${
                        text.length > 25 ? "w-56 mid:w-48 2xl:w-64" : ""
                    } truncate text-13 sm:text-sm block text-gray-400 font-medium pb-1`;
                    return <div className="flex flex-row items-center">{formatMessage(text, truncate)}</div>;
                }
            case "EVENT":
                return getMessage();
            default:
                if (toUpper(by) === "USER") {
                    return (
                        <span className="mb-1 block w-48 truncate text-13 font-medium capitalize text-gray-400 sm:w-32 mid:w-56 xxl:w-64">
                            {toLower(message.type)}
                        </span>
                    );
                } else {
                    return (
                        <div className="flex flex-row items-center">
                            <span className="block w-48 truncate text-13 font-medium capitalize text-gray-400 sm:w-32 mid:w-56 xxl:w-64">
                                {toLower(message.type)}
                            </span>
                        </div>
                    );
                }
        }
    } catch (error) {
        return null;
    }
};

export default MessagePreview;
