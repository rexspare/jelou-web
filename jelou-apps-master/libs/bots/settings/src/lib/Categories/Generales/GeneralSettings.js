import { useState } from "react";
import { Input } from "@apps/shared/common";
import { DashboardServer } from "@apps/shared/modules";
import { BeatLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import { TooltipLabel } from "@apps/bots/ui-shared";
import get from "lodash/get";
import { useTranslation } from "react-i18next";

const GeneralSettings = (props) => {
    const { bot, botHeader, loadBotInfo, company } = props;
    const [loading, setLoading] = useState(false);
    const [cacheLimits, setCacheLimits] = useState({
        ...get(bot, "cacheLimits", {}),
    });
    const [properties, setProperties] = useState({ ...bot });
    const companyId = get(company, "id", "");

    useState(() => {
        setProperties({ ...bot });
        setCacheLimits(get(bot, "cacheLimits", {}));
    }, [props.bot]);

    const { t } = useTranslation();

    const notifyError = (error) => {
        toast.error(error, {
            position: toast.POSITION.BOTTOM_RIGHT,
        });
    };

    const notify = (msg) => {
        toast.success(msg, {
            position: toast.POSITION.BOTTOM_RIGHT,
        });
    };

    const handleChange = ({ target }) => {
        const { value, name } = target;

        if (name === "mergeBubbles") {
            setProperties({ ...properties, mergeBubbles: target.checked });
        }
        if (name === "option") {
            setCacheLimits({ ...cacheLimits, option: parseInt(value) * 60 });
        }
        if (name === "input") {
            setCacheLimits({ ...cacheLimits, input: parseInt(value) * 60 });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        const obj = {
            properties: { ...properties, cacheLimits: { ...cacheLimits } },
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
            <ToastContainer />
            <div className="inline-flex h-15 w-full items-center justify-between border-b-1 border-gray-45 px-10 py-5">
                <div className="inline-flex items-center align-middle">
                    <dd className="text-2xl font-medium leading-9 text-gray-400">{t("botsSettingsCategoriesGeneral.general")}</dd>
                </div>
            </div>
            <div className="p-10 pb-10">
                <div className=" w-full justify-between">
                    <div className="block">
                        <span className="mb-3 block items-center font-bold text-gray-400">
                            <div className="relative flex items-center pb-2">
                                <TooltipLabel message={t("botsSettingsCategoriesGeneral.tooltipMessageResponse")} />
                                {t("botsSettingsCategoriesGeneral.mergeBubbles")}
                            </div>
                            <div className="ml-8">
                                <input
                                    type="checkbox"
                                    className="mr-2 h-5 w-5 rounded-default border-1 border-gray-300 text-primary-200 checked:border-transparent checked:bg-primary-200 hover:checked:bg-primary-200 focus:ring-primary-200 focus:ring-opacity-25 focus:checked:bg-primary-200"
                                    id="mergeBubbles"
                                    defaultChecked={bot ? bot.mergeBubbles : false}
                                    onClick={handleChange}
                                    name="mergeBubbles"
                                    value="mergeBubbles"
                                />
                            </div>
                        </span>
                    </div>
                    <div className="block py-5">
                        <label htmlFor="duration">
                            <span className="mb-1 flex items-center pb-3 font-bold text-gray-400">
                                <TooltipLabel message={t("botsSettingsCategoriesGeneral.tooltipMessageMenu")} />
                                {t("botsSettingsCategoriesGeneral.optionDuration")}
                            </span>
                            <Input
                                className="input-login max-w-sm"
                                type="number"
                                required={true}
                                name="option"
                                placeholder={t("botsSettingsCategoriesGeneral.numberSeconds")}
                                onChange={handleChange}
                                defaultValue={bot ? (get(bot, "cacheLimits.option") ? parseInt(get(bot, "cacheLimits.option") / 60) : "") : ""}
                            />
                        </label>
                    </div>
                    <div className="block py-5">
                        <label htmlFor="duration">
                            <span className="mb-1 flex items-center pb-3 font-bold text-gray-400">
                                <TooltipLabel message={t("botsSettingsCategoriesGeneral.tooltipMaxTime")} />
                                {t("botsSettingsCategoriesGeneral.questionDuration")}
                            </span>
                            <Input
                                className="input-login max-w-sm"
                                type="number"
                                required={true}
                                name="input"
                                placeholder={t("botsSettingsCategoriesGeneral.numberSeconds")}
                                onChange={handleChange}
                                defaultValue={bot ? (get(bot, "cacheLimits.input") ? parseInt(get(bot, "cacheLimits.input") / 60) : "") : ""}
                            />
                        </label>
                    </div>
                </div>
                <div className="mt-10 inline-flex w-full text-center">
                    <button onClick={handleSubmit} className="button-primary w-32" disabled={loading}>
                        {loading ? <BeatLoader color={"white"} size={"0.625rem"} /> : `${t("botsSettingsCategoriesGeneral.save")}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GeneralSettings;
