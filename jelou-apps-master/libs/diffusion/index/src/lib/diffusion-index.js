import Campaigns from "@apps/diffusion/campaigns";
import Monitoring from "@apps/diffusion/campaigns-monitoring";
import DiffusionAllHsmReports from "@apps/diffusion/hsm-all-reports";
import HsmReport from "@apps/diffusion/hsm-reports";
import Templates from "@apps/diffusion/templates";
import { Header } from "@apps/shared/common";
import isNil from "lodash/isNil";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { getBots } from "@apps/redux/store";
import dayjs from "dayjs";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

const DiffusionIndex = (props) => {
    const { permissionsList, setShowPage404 } = props;
    const allowedPermission = props.allowedPermission === "hsm:view_hsm_ui" ? true : false;
    const { tab, campaignId } = useParams();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const reportPermission = !!permissionsList.find((data) => data === "hsm:view_report");
    const templatePermission = !!permissionsList.find((data) => data === "hsm:view_template");
    const campaignPermission = !!permissionsList.find((data) => data === "hsm:send_campaign");
    const templatePermissionArr = permissionsList.filter((data) => data.endsWith("template"));
    const bots = useSelector((state) => state.bots);
    const [botsHsm, setBotsHsm] = useState([]);
    const company = useSelector((state) => state.company);
    const companyId = get(company, "id");
    const initialFiltersReports = {
        bot: [],
        date: [],
        status: [],
        template: [],
        campaign: [],
        destination: [],
    };
    const [filterOptions, setFilterOptions] = useState({
        ...initialFiltersReports,
        date: [new Date(dayjs().startOf("day")), new Date(dayjs().endOf("day"))],
    });

    const TEMPLATE_MODEL = {
        displayName: "",
        elementName: "",
        template: "",
        paramsNumber: null,
        language: "",
    };

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [template, setTemplate] = useState(TEMPLATE_MODEL);
    const [paramsNew, setParamsNew] = useState([]);
    const [buttonsHsm, setButtonsHsm] = useState([{ text: "", type: "" }]);

    const [steps, setSteps] = useState([
        {
            name: t("campaigns.name"),
            description: t("campaigns.nameDescription"),
            status: "current",
            number: "1",
            inputData: "",
        },
        {
            name: t("campaigns.templateHSM"),
            description: t("campaigns.templateDescription"),
            status: "upcoming",
            number: "2",
            inputData: "",
        },
        {
            name: t("campaigns.receipts"),
            description: t("campaigns.receiptsDescription"),
            status: "upcoming",
            number: "3",
            inputData: "",
        },
        {
            name: t("campaigns.setting"),
            description: t("campaigns.settingDescription"),
            status: "upcoming",
            number: "4",
            inputData: "",
        },
        {
            name: t("campaigns.sentCampign"),
            description: t("campaigns.sentCampaignDescription"),
            status: "upcoming",
            number: "5",
            inputData: "",
        },
        {
            name: t("campaigns.final"),
            description: t("campaigns.finalDescription"),
            status: "upcoming",
            number: "6",
            inputData: "",
        },
    ]);

    const urlSearch = useLocation();
    const pathname = get(urlSearch, "pathname", "");

    useEffect(() => {
        //clean state if not belong a create campaign
        if (pathname !== "/hsm/create_campaign") {
            setSteps([
                {
                    name: t("campaigns.name"),
                    description: t("campaigns.nameDescription"),
                    status: "current",
                    number: "1",
                    inputData: "",
                },
                {
                    name: t("campaigns.templateHSM"),
                    description: t("campaigns.templateDescription"),
                    status: "upcoming",
                    number: "2",
                    inputData: "",
                },
                {
                    name: t("campaigns.receipts"),
                    description: t("campaigns.receiptsDescription"),
                    status: "upcoming",
                    number: "3",
                    inputData: "",
                },
                {
                    name: t("campaigns.setting"),
                    description: t("campaigns.settingDescription"),
                    status: "upcoming",
                    number: "4",
                    inputData: "",
                },
                {
                    name: t("campaigns.sentCampign"),
                    description: t("campaigns.sentCampaignDescription"),
                    status: "upcoming",
                    number: "5",
                    inputData: "",
                },
                {
                    name: t("campaigns.final"),
                    description: t("campaigns.finalDescription"),
                    status: "upcoming",
                    number: "6",
                    inputData: "",
                },
            ]);
        }
    }, [pathname]);

    const openCreateTemplateModal = () => {
        setButtonsHsm([{ text: "", type: "" }]);
        setIsCreateModalOpen(true);
        setTemplate(TEMPLATE_MODEL);
        setParamsNew([]);
    };

    useEffect(() => {
        if (isEmpty(bots) && !isEmpty(company)) {
            const params = {
                companyId,
                shouldPaginate: false,
            };
            dispatch(getBots(params));
        }
        if (!isEmpty(bots) && isEmpty(botsHsm)) {
            const hsmBots = bots.filter((bot) => toUpper(bot.type) === "WHATSAPP");
            setBotsHsm(hsmBots);
        }
    }, [bots, company]);

    const settings = [
        {
            name: t("campaigns.sentNow"),
            description: t("campaigns.sentNowDescription"),
            opcion: 1,
        },
        {
            name: t("campaigns.schedule"),
            description: t("campaigns.scheduleDescription"),
            opcion: 2,
        },
    ];

    const tabs = [
        {
            key: "campaigns",
            name: t("hsm.campaigns"),
            allowedPermission: templatePermission,
        },
        {
            key: "reports",
            name: t("hsm.reports"),
            allowedPermission: reportPermission,
        },
        {
            key: "templates",
            name: t("hsm.templates"),
            allowedPermission: templatePermission,
        },
    ];

    const switchTab = (tab) => {
        switch (toUpper(tab)) {
            case "CAMPAIGNS":
                return <Monitoring allowedPermission={templatePermission} templatePermissionArr={templatePermissionArr} bots={botsHsm} bot={botsHsm[0]} />;
            case "TEMPLATES":
                return (
                    <Templates
                        allowedPermission={templatePermission}
                        templatePermissionArr={templatePermissionArr}
                        bots={botsHsm}
                        bot={botsHsm[0]}
                        isCreateModalOpen={isCreateModalOpen}
                        setIsCreateModalOpen={setIsCreateModalOpen}
                        template={template}
                        setTemplate={setTemplate}
                        paramsNew={paramsNew}
                        setParamsNew={setParamsNew}
                        setButtonsHsm={setButtonsHsm}
                        buttonsHsm={buttonsHsm}
                    />
                );
            case "REPORTS":
                return (
                    <DiffusionAllHsmReports
                        allowedPermission={reportPermission}
                        initialFiltersReports={initialFiltersReports}
                        filterOptions={filterOptions}
                        setFilterOptions={setFilterOptions}
                        bots={botsHsm}
                    />
                );
            case "CREATE_CAMPAIGN":
                return <Campaigns allowedPermission={campaignPermission} steps={steps} setSteps={setSteps} settings={settings} />;
            default:
                return setShowPage404(true);
        }
    };
    const navigate = useNavigate();

    return (
        <div className="bg-app-body flex max-h-screen min-h-screen w-full flex-col px-5 mid:px-10 lg:px-12">
            {allowedPermission && (
                <>
                    <Header title={t("hsm.menuName")} tab={tab} tabs={tabs} showChildren={tab === "campaigns" || tab === "templates"}>
                        <div className="pl-3">
                            {(tab === "campaigns" || tab === "templates") && (
                                <button
                                    type="submit"
                                    onClick={tab === "campaigns" ? () => navigate("/hsm/create_campaign") : tab === "templates" ? () => openCreateTemplateModal() : null}
                                    className="button-gradient"
                                >
                                    <span className="pr-2">+</span>
                                    {t("bots.createBot")}
                                </button>
                            )}
                        </div>
                    </Header>
                    <div className="main-content mb-10 w-full overflow-y-auto rounded-1 bg-white shadow-sm">
                        {isNil(campaignId) ? (
                            switchTab(tab)
                        ) : (
                            <HsmReport
                                allowedPermission={reportPermission}
                                initialFiltersReports={initialFiltersReports}
                                filterOptions={filterOptions}
                                setFilterOptions={setFilterOptions}
                                bots={botsHsm}
                            />
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default DiffusionIndex;
