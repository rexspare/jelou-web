import { useEffect, useState } from "react";
import { DashboardServer } from "@apps/shared/modules";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import get from "lodash/get";
import merge from "lodash/merge";
import { v4 as uuid } from "uuid";
import { useTranslation } from "react-i18next";

/* Components */
import Element from "./Element";
import isEmpty from "lodash/isEmpty";
import { useSelector } from "react-redux";

const SidebarSettings = (props) => {
    const { bot, type, botHeader, setActiveTeam, setTab, loadTeams, loadBotInfo } = props;
    const operatorView = get(bot, "operatorView", {});
    const [loading, setLoading] = useState(false);
    const [elements, setElements] = useState([]);
    const company = useSelector((state) => state.company);
    const companyId = get(company, "id");
    const { t } = useTranslation();

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

    const notifyError = (error) => {
        toast.error(
            <div className="relative flex items-center justify-between">
                <div className="flex">
                    <div className="text-15">{error}</div>
                </div>

                <div className="flex  pl-10">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
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

    useEffect(() => {
        const sidebarSettings = get(bot, "sidebar_settings", []);
        setElements(sidebarSettings);
    }, [bot]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const sidebarSettings = elements;
        let sender = {};

        try {
            if (type === "bot") {
                sender = { ...bot, sidebar_settings: sidebarSettings };
                await DashboardServer.patch(`companies/${companyId}/bots/${botHeader.id}`, {
                    properties: sender,
                });

                loadBotInfo();
            } else {
                sender = {
                    properties: {
                        sidebar_settings: sidebarSettings,
                        operatorView: { ...operatorView },
                    },
                };
                const res = await DashboardServer.patch(`/companies/${companyId}/teams/${bot.id}`, sender, {
                    params: { onlyUpdateProperty: "sidebar_settings" },
                });
                loadTeams();
                setActiveTeam(get(res, "data.data", {}));
                setTab("sidebar");
            }
            notify(t("changes.saved"));
            setLoading(false);
        } catch (error) {
            notifyError(t("changes.unsaved"));
            setLoading(false);
        }
    };

    const handleAddElement = () => {
        const id = uuid();
        setElements([...elements, { id }]);
    };

    const handleElementChange = (element) => {
        setElements(
            elements.map((item) => {
                if (item.id === element.id) {
                    return merge(item, element);
                }
                return item;
            })
        );
    };

    const handleElementDelete = (elementId) => {
        setElements((elements) => elements.filter((item) => item.id !== elementId));
    };

    return (
        <div className="relative max-h-modal flex-1 overflow-y-auto bg-white">
            <div className="mr-2 pb-10">
                <div className="mb-12 w-full">
                    {elements.map((element) => (
                        <Element
                            element={element}
                            key={element.id}
                            handleElementChange={handleElementChange}
                            handleElementDelete={handleElementDelete}
                        />
                    ))}
                </div>
                <div className="flex w-full max-w-lg items-end justify-between text-center">
                    <button
                        onClick={handleAddElement}
                        className="mr-8 flex w-32 items-center rounded-20 border-1 border-primary-200 border-transparent p-2 font-bold text-primary-200 outline-none focus:outline-none">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            className="mr-2 h-6 w-6 text-primary-200"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        {t("botsSettingsCategoriesSidebarSetting.add")}
                    </button>
                    {!isEmpty(bot) && (
                        <button onClick={handleSubmit} className="button-primary w-32" disabled={loading}>
                            {loading ? <BeatLoader color={"white"} size={"0.625rem"} /> : `${t("botsSettingsCategoriesSidebarSetting.save")}`}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SidebarSettings;
