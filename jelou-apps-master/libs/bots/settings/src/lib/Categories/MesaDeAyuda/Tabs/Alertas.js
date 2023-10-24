/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { DashboardServer } from "@apps/shared/modules";
import { toast } from "react-toastify";
import get from "lodash/get";
import { TooltipLabel } from "@apps/bots/ui-shared";
import { useTranslation } from "react-i18next";

const AlertsForm = (props) => {
    const { bot, botHeader, loadBotInfo } = props;
    const ov = get(bot, "operatorView", {});
    const [properties] = useState({ ...bot });
    const [operatorView] = useState({ ...ov });
    const [messagesToUser, setMessagesToUser] = useState(get(ov, "messagesToUser", {}));
    const [notificationsToOperator, setNotificationsToOperator] = useState(get(ov, "notificationsToOperator", {}));
    const [loading, setLoading] = useState(false);
    const companyID = get(localStorage, "company", "");

    const { t } = useTranslation();

    const notify = (msg) => {
        toast.success(
            <div className="relative flex items-center justify-between">
                <div className="flex">
                    <svg
                        className="-mt-px ml-4 mr-2"
                        width="1.563rem"
                        height="1.563rem"
                        viewBox="0 0 25 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M18.0256 8.53367C18.4071 8.91514 18.4071 9.5335 18.0256 9.91478L11.4742 16.4663C11.0928 16.8476 10.4746 16.8476 10.0931 16.4663L6.97441 13.3474C6.59294 12.9662 6.59294 12.3478 6.97441 11.9665C7.35569 11.585 7.97405 11.585 8.35533 11.9665L10.7836 14.3948L16.6445 8.53367C17.0259 8.15239 17.6443 8.15239 18.0256 8.53367ZM25 12.5C25 19.4094 19.4084 25 12.5 25C5.59063 25 0 19.4084 0 12.5C0 5.59063 5.59158 0 12.5 0C19.4094 0 25 5.59158 25 12.5ZM23.0469 12.5C23.0469 6.67019 18.329 1.95312 12.5 1.95312C6.67019 1.95312 1.95312 6.67095 1.95312 12.5C1.95312 18.3298 6.67095 23.0469 12.5 23.0469C18.3298 23.0469 23.0469 18.329 23.0469 12.5Z"
                            fill="#0CA010"
                        />
                    </svg>
                    <div className="text-15">{msg}</div>
                </div>

                <div className="flex  pl-10">
                    <svg width="1.125rem" height="1.125rem" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10.6491 9.00013L17.6579 1.99094C18.114 1.53502 18.114 0.797859 17.6579 0.341939C17.202 -0.11398 16.4649 -0.11398 16.0089 0.341939L8.99989 7.35114L1.99106 0.341939C1.53493 -0.11398 0.798002 -0.11398 0.342092 0.341939C-0.114031 0.797859 -0.114031 1.53502 0.342092 1.99094L7.35093 9.00013L0.342092 16.0093C-0.114031 16.4653 -0.114031 17.2024 0.342092 17.6583C0.5693 17.8858 0.868044 18 1.16657 18C1.4651 18 1.76363 17.8858 1.99106 17.6583L8.99989 10.6491L16.0089 17.6583C16.2364 17.8858 16.5349 18 16.8334 18C17.132 18 17.4305 17.8858 17.6579 17.6583C18.114 17.2024 18.114 16.4653 17.6579 16.0093L10.6491 9.00013Z"
                            fill="#596859"
                        />
                    </svg>
                </div>
            </div>,
            {
                position: toast.POSITION.BOTTOM_RIGHT,
            }
        );
    };

    const notifyError = (error) => {
        toast.error(
            <div className="relative flex items-center justify-between">
                <div className="flex">
                    <div className="text-15">{error}</div>
                </div>

                <div className="flex  pl-10">
                    <svg width="1.125rem" height="1.125rem" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10.6491 9.00013L17.6579 1.99094C18.114 1.53502 18.114 0.797859 17.6579 0.341939C17.202 -0.11398 16.4649 -0.11398 16.0089 0.341939L8.99989 7.35114L1.99106 0.341939C1.53493 -0.11398 0.798002 -0.11398 0.342092 0.341939C-0.114031 0.797859 -0.114031 1.53502 0.342092 1.99094L7.35093 9.00013L0.342092 16.0093C-0.114031 16.4653 -0.114031 17.2024 0.342092 17.6583C0.5693 17.8858 0.868044 18 1.16657 18C1.4651 18 1.76363 17.8858 1.99106 17.6583L8.99989 10.6491L16.0089 17.6583C16.2364 17.8858 16.5349 18 16.8334 18C17.132 18 17.4305 17.8858 17.6579 17.6583C18.114 17.2024 18.114 16.4653 17.6579 16.0093L10.6491 9.00013Z"
                            fill="#e53e3e"
                        />
                    </svg>
                </div>
            </div>,
            {
                position: toast.POSITION.BOTTOM_RIGHT,
            }
        );
    };

    const handleChange = ({ target }) => {
        const { value, name } = target;
        if (name === "end") {
            setMessagesToUser({ ...messagesToUser, end: value });
        }

        if (name === "wait") {
            setMessagesToUser({ ...messagesToUser, wait: value });
        }

        if (name === "operatorCloseSession") {
            setMessagesToUser({ ...messagesToUser, operatorCloseSession: value });
        }

        if (name === "notificationsToOperatorWait") {
            setNotificationsToOperator({ ...notificationsToOperator, wait: value });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const obj = {
            properties: {
                ...properties,
                operatorView: {
                    ...operatorView,
                    states: ["end", "wait"],
                    messagesToUser,
                    notificationsToOperator,
                },
            },
        };
        try {
            await DashboardServer.patch(`companies/${companyID}/bots/${botHeader.id}`, obj);
            notify(t("botsSettingsCategoriesDeskhelpTabsAlert.changesSaves"));
            loadBotInfo();
            setLoading(false);
        } catch (error) {
            notifyError(t("botsSettingsCategoriesDeskhelpTabsAlert.changesNotSaves"));
            setLoading(false);
        }
    };

    return (
        <div className="p-10 pb-10">
            <div className="flex ">
                <div className="block">
                    <div className="pb-4">
                        <div className="mb-3 flex items-center text-sm font-bold text-gray-400">
                            <TooltipLabel message={t("botsSettingsCategoriesDeskhelpTabsAlert.tooltipDefaultMessage")} />
                            {t("botsSettingsCategoriesDeskhelpTabsAlert.expiredSession")}
                        </div>
                        <textarea
                            id="end"
                            className=" textArea rounded-lg border-2 border-solid border-gray-39 p-2"
                            name="end"
                            rows="3"
                            defaultValue={ov ? (ov.messagesToUser ? ov.messagesToUser.end : "") : ""}
                            onChange={handleChange}
                            cols="60"></textarea>
                    </div>
                    <div className="pb-4">
                        <div className="mb-3 flex items-center text-sm font-bold text-gray-400">
                            <TooltipLabel message={t("botsSettingsCategoriesDeskhelpTabsAlert.tooltipStablishMessage")} />
                            {t("botsSettingsCategoriesDeskhelpTabsAlert.waitingSession")}
                        </div>
                        <textarea
                            id="wait"
                            className="textArea rounded-lg border-2 border-solid border-gray-39 p-2"
                            name="wait"
                            rows="3"
                            defaultValue={ov ? (ov.messagesToUser ? ov.messagesToUser.wait : "") : ""}
                            onChange={handleChange}
                            cols="60"></textarea>
                    </div>
                    <div className="pb-4">
                        <div className="mb-3 flex items-center text-sm font-bold text-gray-400">
                            <TooltipLabel message={t("botsSettingsCategoriesDeskhelpTabsAlert.tooltipStablishFinish")} />
                            {t("botsSettingsCategoriesDeskhelpTabsAlert.closeOperator")}
                        </div>
                        <textarea
                            id="operatorCloseSession"
                            className="textArea rounded-lg border-2 border-solid border-gray-39 p-2"
                            name="operatorCloseSession"
                            rows="3"
                            defaultValue={ov ? (ov.messagesToUser ? ov.messagesToUser.operatorCloseSession : "") : ""}
                            onChange={handleChange}
                            cols="60"></textarea>
                    </div>
                    <div className="pb-4">
                        <div className="mb-3 flex items-center text-sm font-bold text-gray-400">
                            <TooltipLabel message={t("botsSettingsCategoriesDeskhelpTabsAlert.tooltipOperatorWait")} />
                            {t("botsSettingsCategoriesDeskhelpTabsAlert.operatorWait")}
                        </div>
                        <textarea
                            id="notificationsToOperatorWait"
                            className="textArea rounded-lg border-2 border-solid border-gray-39 p-2"
                            name="notificationsToOperatorWait"
                            rows="3"
                            defaultValue={get(notificationsToOperator, "wait", "")}
                            onChange={handleChange}
                            cols="60"></textarea>
                    </div>
                </div>
            </div>
            <div className="mt-8 inline-flex w-full text-center">
                <button type="submit" className="button-primary w-32" disabled={loading} onClick={handleSubmit}>
                    {loading ? <BeatLoader color={"white"} size={"0.625rem"} /> : `${t("botsSettingsCategoriesDeskhelpTabsAlert.save")}`}
                </button>
            </div>
        </div>
    );
};
export default AlertsForm;
