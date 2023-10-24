import get from "lodash/get";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const ViewWebhook = (props) => {
    const { webhook = {}, setSection, setSelectedWebhook, setOpenModalDeleteWebhook, webhookEvents = [] } = props;
    const { t } = useTranslation();
    const { subscriptions } = webhook;
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    const classNameValue = "h-34 w-full truncate flex-1 rounded-lg border-transparent bg-[#f3f8fe] p-2 px-5 text-13 lg:text-15 text-gray-400";

    return (
        <div className="flex w-full flex-col space-y-6 py-10 px-6 lg:px-12">
            <div className="flex flex-col space-y-3">
                <span className="text-sm text-gray-400/75 lg:text-base">{t("datum.Nombre del Webhook")}</span>
                <span className={classNameValue}>{webhook?.name}</span>
            </div>
            <div className="flex flex-col space-y-3">
                <span className="text-sm text-gray-400/75 lg:text-base">{t("datum.Base de datos")}</span>
                <span className={classNameValue}>{webhook.database?.name}</span>
            </div>
            <div className="flex flex-col space-y-3">
                <span className="text-sm text-gray-400/75 lg:text-base">URL</span>
                <span className={classNameValue}>{webhook?.url}</span>
            </div>
            <div className="flex flex-col space-y-5">
                <span className="text-base text-primary-200">{t("datum.Que eventos desea subscribirse?")}</span>
                <div className="ml-8 flex flex-col space-y-3">
                    {webhookEvents.map((webhookEvent, idx) => {
                        const { id, displayNames, name } = webhookEvent;
                        const isSubscribed = subscriptions.includes(id);
                        if (!isSubscribed) return null;
                        return (
                            <div key={idx} className="flex items-center font-medium text-gray-400/75">
                                <label className="text-sm lg:text-base">
                                    <input
                                        readOnly
                                        name="events"
                                        type="checkbox"
                                        id={id}
                                        className="mr-3 h-4 w-4 appearance-none rounded-[0.1875rem] border-2 border-gray-100 checked:border-primary-200 checked:bg-primary-200 hover:checked:bg-primary-200 lg:h-5 lg:w-5"
                                        checked
                                    />
                                    {get(displayNames, `${lang}`, name)}
                                </label>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="flex justify-end py-7">
                <button
                    className="w-24 rounded-20 border-1 border-transparent bg-gray-10 p-2 !text-13 font-bold text-gray-400 focus:outline-none lg:w-32 lg:!text-base"
                    onClick={() => {
                        setSection("edit_webhook");
                        setSelectedWebhook(webhook);
                    }}>
                    {t("monitoring.Editar")}
                </button>
                <button
                    className="ml-4 w-24 rounded-20 border-1 border-transparent bg-primary-200 p-2 !text-13 font-bold text-white outline-none lg:w-32 lg:!text-base"
                    onClick={() => setOpenModalDeleteWebhook(true)}>
                    {t("monitoring.Eliminar")}
                </button>
            </div>
        </div>
    );
};

export default ViewWebhook;
