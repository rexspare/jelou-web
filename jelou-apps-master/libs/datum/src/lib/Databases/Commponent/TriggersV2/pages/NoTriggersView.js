import { TRIGGER_VIEW } from "../constants";
import { useTranslation } from "react-i18next";
import { WebhookInitIcon } from "@apps/shared/icons";

const NoTriggersView = ({ setTriggersView }) => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col items-center justify-center gap-10">
            <WebhookInitIcon width="28rem" height="22rem" />
            <button
                onClick={() => setTriggersView(TRIGGER_VIEW.CREATE_TRIGGER)}
                className="flex h-12 cursor-pointer items-center space-x-2 whitespace-nowrap rounded-lg border-transparent bg-primary-40 py-8 px-16 text-2xl text-primary-200 outline-none mid:px-5">
                <span className="hidden mid:flex">{t("datum.triggers.noTriggersText")}</span>
            </button>
        </div>
    );
};

export default NoTriggersView;
