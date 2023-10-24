import { useState, useEffect } from "react";
import { Input } from "@apps/shared/common";
import { DashboardServer } from "@apps/shared/modules";
import { BeatLoader } from "react-spinners";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { toast } from "react-toastify";
import { TooltipLabel } from "@apps/bots/ui-shared";
import { useTranslation } from "react-i18next";
import CreatableSelect from "react-select/creatable";

const customStyles = {
    control: (base, state) => ({
        ...base,
        border: state.isFocused ? 0 : 0,
        backgroundColor: "unset",
        // This line disable the blue border
        boxShadow: state.isFocused ? 0 : 0,
        "&:hover": {
            border: state.isFocused ? 0 : 0,
        },
    }),
    multiValue: (styles, { data }) => {
        return {
            ...styles,
            backgroundColor: "#f2f8ff",
            borderRadius: "0.938rem",
        };
    },
    multiValueLabel: (styles, { data }) => ({
        ...styles,
        color: "grey",
    }),
};

const Messages = (props) => {
    const { bot, botHeader, loadBotInfo, company } = props;
    const [loading, setLoading] = useState(false);
    const [sessionExpiredMessages, setSessionExpiredMessages] = useState(get(bot, "sessionExpiredMessages", {}));
    const [whatsapp_messages, setWhatsapp_messages] = useState(get(bot, "whatsapp_messages", {}));
    const [cancelExpressionsMessage, setCancelExpressionsMessage] = useState(get(bot, "cancelExpressionsMessage", ""));
    const [options, setOptions] = useState([]);
    const companyId = get(company, "id", "");
    const { t } = useTranslation();

    useEffect(() => {
        if (bot.cancelExpressions) {
            const tags = bot.cancelExpressions.split(",");
            tags.map((exp) => setOptions((old) => [...old, { label: exp, name: exp }]));
        }
    }, []);

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

    const notify = (msg) => {
        toast.success(
            <div className="relative flex flex-1 items-center justify-between">
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

    const handleChange = ({ target }) => {
        const { value, name } = target;

        if (name === "exitMessage" || name === "menuMessage" || name === "leaveMenuMessage" || name === "noValidOptionMessage") {
            setWhatsapp_messages({ ...whatsapp_messages, [name]: value });
        }
        if (name === "input" || name === "option") {
            setSessionExpiredMessages({ ...sessionExpiredMessages, [name]: value });
        }

        if (name === "cancelExpressionsMessage") {
            setCancelExpressionsMessage(value);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);

        let cancelExpressions = "";
        options.map((opt, key) => (cancelExpressions = `${cancelExpressions}${key !== options.lenght && key !== 0 ? "," : ""}${opt.label}`));
        const obj = {
            properties: {
                ...bot,
                cancelExpressions,
                sessionExpiredMessages,
                whatsapp_messages,
                cancelExpressionsMessage: cancelExpressionsMessage,
            },
        };
        try {
            await DashboardServer.patch(`companies/${companyId}/bots/${botHeader.id}`, obj);
            notify(t("botsSettingsCategoriesGeneral.changesSaves"));
            loadBotInfo();
            setLoading(false);
        } catch (error) {
            notifyError(t("botsSettingsCategoriesGeneral.changesNotSaves"));
            setLoading(false);
        }
    };

    return (
        <div className="relative flex-1 overflow-hidden bg-white">
            <div className="inline-flex h-15 w-full items-center justify-between border-b-1 border-gray-45 px-10 py-5">
                <div className="inline-flex items-center align-middle">
                    <dd className="text-2xl font-medium leading-9 text-gray-400">{t("msgSettings.msgSettings")}</dd>
                </div>
            </div>
            <div className="w-full px-10 pb-5 pt-5 lg:grid lg:grid-cols-2 lg:gap-4">
                <div className="block py-5">
                    <label htmlFor="questionExpired">
                        <span className="flex items-center pb-3 font-bold text-gray-400">
                            <TooltipLabel message={t("msgSettings.questionExpiredToolTip")} />
                            {t("msgSettings.questionExpired")}
                        </span>
                        <Input
                            className="input-login max-w-sm"
                            type="text"
                            required={true}
                            name="input"
                            //placeholder={t("msgSettings.numberSeconds")}
                            onChange={handleChange}
                            defaultValue={sessionExpiredMessages ? sessionExpiredMessages.input : ""}
                        />
                    </label>
                </div>
                <div className="block py-5">
                    <label htmlFor="optionExpired">
                        <span className="mb-1 flex items-center pb-3 font-bold text-gray-400">
                            <TooltipLabel message={t("msgSettings.optionExpiredToolTip")} />
                            {t("msgSettings.optionExpired")}
                        </span>
                        <Input
                            className="input-login max-w-sm"
                            type="text"
                            required={true}
                            name="option"
                            //placeholder={t("msgSettings.numberSeconds")}
                            onChange={handleChange}
                            defaultValue={sessionExpiredMessages ? sessionExpiredMessages.option : ""}
                        />
                    </label>
                </div>
                <div className="block py-5">
                    <label htmlFor="exitMessage">
                        <span className="mb-1 flex items-center pb-3 font-bold text-gray-400">
                            <TooltipLabel message={t("msgSettings.exitMessageToolTip")} />
                            {t("msgSettings.exitMessage")}
                        </span>
                        <Input
                            className="input-login max-w-sm"
                            type="text"
                            required={true}
                            name="exitMessage"
                            //placeholder={t("msgSettings.numberSeconds")}
                            onChange={handleChange}
                            defaultValue={whatsapp_messages ? whatsapp_messages.exitMessage : ""}
                        />
                    </label>
                </div>
                <div className="block py-5">
                    <label htmlFor="menuMessage">
                        <span className="mb-1 flex items-center pb-3 font-bold text-gray-400">
                            <TooltipLabel message={t("msgSettings.menuMessageToolTip")} />
                            {t("msgSettings.menuMessage")}
                        </span>
                        <Input
                            className="input-login max-w-sm"
                            type="text"
                            required={true}
                            name="menuMessage"
                            //placeholder={t("msgSettings.numberSeconds")}
                            onChange={handleChange}
                            defaultValue={whatsapp_messages ? whatsapp_messages.menuMessage : ""}
                        />
                    </label>
                </div>
                <div className="block py-5">
                    <label htmlFor="leaveMenuMsg">
                        <span className="mb-1 flex items-center pb-3 font-bold text-gray-400">
                            <TooltipLabel message={t("msgSettings.leaveMenuMsgToolTip")} />
                            {t("msgSettings.leaveMenuMsg")}
                        </span>
                        <Input
                            className="input-login max-w-sm"
                            type="text"
                            required={true}
                            name="leaveMenuMessage"
                            //placeholder={t("msgSettings.numberSeconds")}
                            onChange={handleChange}
                            defaultValue={whatsapp_messages ? whatsapp_messages.leaveMenuMessage : ""}
                        />
                    </label>
                </div>
                <div className="block py-5">
                    <label htmlFor="noValidOptionMessage">
                        <span className="mb-1 flex items-center pb-3 font-bold text-gray-400">
                            <TooltipLabel message={t("msgSettings.noValidOptionMessageToolTip")} />
                            {t("msgSettings.noValidOptionMessage")}
                        </span>
                        <Input
                            className="input-login max-w-sm"
                            type="text"
                            required={true}
                            name="noValidOptionMessage"
                            //placeholder={t("msgSettings.numberSeconds")}
                            onChange={handleChange}
                            defaultValue={whatsapp_messages ? whatsapp_messages.noValidOptionMessage : ""}
                        />
                    </label>
                </div>
            </div>
            <div className="w-full px-10 pb-10">
                <div className="pb-4">
                    <div className="mb-3 flex items-center text-sm font-bold text-gray-400">
                        <TooltipLabel message={t("botsSettingsCategoriesDeskhelpTabsAlert.cancelExpressionMsgTooltip")} />
                        {t("botsSettingsCategoriesDeskhelpTabsAlert.cancelExpressionMsg")}
                    </div>
                    <textarea
                        id="cancelExpressionsMessage"
                        className="textArea w-full rounded-lg border-2 border-solid border-gray-39 p-2"
                        name="cancelExpressionsMessage"
                        rows="3"
                        defaultValue={!isEmpty(cancelExpressionsMessage) ? cancelExpressionsMessage : ""}
                        onChange={handleChange}
                        cols="60"></textarea>
                </div>
                <div className="py-4">
                    <div className="mb-3 flex items-center text-sm font-bold text-gray-400">
                        <TooltipLabel message={t("botsSettingsCategoriesDeskhelpTabsAlert.vocablosDeSalidaToolTip")} />
                        {t("botsSettingsCategoriesDeskhelpTabsAlert.vocablosDeSalida")}
                    </div>
                    <div className="textArea rounded-lg border-2 border-solid border-gray-39 p-2">
                        <CreatableSelect
                            isClearable
                            value={options}
                            isMulti
                            styles={customStyles}
                            placeholder={t("botsSettingsCategoriesSidebarElement.addValues")}
                            onChange={(options) => {
                                setOptions(options);
                            }}
                        />
                    </div>
                </div>
                <div className="mt-10">
                    <button onClick={handleSubmit} className="button-primary w-32" disabled={loading}>
                        {loading ? <BeatLoader color={"white"} size={"0.625rem"} /> : `${t("botsSettingsCategoriesGeneral.save")}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Messages;
