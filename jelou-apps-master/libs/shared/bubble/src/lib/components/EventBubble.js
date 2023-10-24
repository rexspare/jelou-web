import get from "lodash/get";
import toUpper from "lodash/toUpper";
import { useTranslation } from "react-i18next";

const EventBubble = ({ message, rawEvent, time }) => {
    const { t } = useTranslation();
    const slug = get(message, "slug");

    const checkIfShouldRenderEvent = () => {
        switch (toUpper(slug)) {
            case "TIME_WAIT":
            case "EXTEND_TIME":
            case "TYPING_WITHOUT_ASSIGNATION":
            case "CHANGE_STATUS":
            case "SWITCH_OPERATOR_TO":
            case "INPUT":
                return false;
            default:
                return true;
        }
    };

    const getMessage = () => {
        switch (toUpper(slug)) {
            case "ASSIGNED":
                return `${t("pma.assignedTo")} ${get(rawEvent, "sender.names", "")}`;
            case "TIME_END":
                return t("pma.expiredConversation");
            case "REMOVE_USER":
                return t("pma.endConversation");
            case "SWITCH_OPERATOR_FROM":
                return `${t("pma.transferedTo")} ${get(rawEvent, "message.newOperator.names", get(rawEvent, "bubble.newOperator.names", ""))}`;
            case "INDUCED_BY_OPERATOR":
                return t("pma.inducedByOperator");
            case "PREVIOUS_ASSIGNATION":
                return t("pma.previousAssignation");
            case "QUEUE_ASSIGNED":
                return `${t("pma.queueAssigned")} - ${get(rawEvent, "message.queue", get(rawEvent, "bubble.queue", t("pma.unknown")))}`;
            case "INDUCED_BY_ADMIN":
                return t("pma.inducedByAdmin");
            case "INDUCED_BY_SYSTEM":
                return t("pma.inducedBySystem");
            case "TICKET_ASSIGNATION":
                return t("pma.ticketAssignation");

            default:
                return get(rawEvent, "message.description", get(rawEvent, "bubble.description", "Sin Descripción"));
        }
    };

    const shouldRenderEvent = checkIfShouldRenderEvent();

    if (!shouldRenderEvent) {
        return null;
    }

    return (
        <div className="my-2 flex w-full items-center justify-center">
            <div className="mx-auto flex w-full max-w-90 items-center justify-center">
                <div className="mr-3 h-0.25 flex-1 bg-gray-850/10"></div>
                <div className="flex min-h-7 items-center justify-end rounded-lg border-default border-gray-100 border-opacity-25 bg-white px-4 py-1 text-center text-xs text-gray-450">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-4 w-4 text-primary-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="flex flex-1 justify-center text-center">{getMessage()}</p>
                    <span className="ml-4 block italic">{time}</span>
                </div>
                <div className="ml-3 h-0.25 flex-1 bg-gray-850/10"></div>
            </div>
        </div>
    );
};

export default EventBubble;
