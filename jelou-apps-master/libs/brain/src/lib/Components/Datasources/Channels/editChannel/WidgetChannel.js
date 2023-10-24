import { useEffect, useState } from "react";
import { VerticalTab } from "@apps/shared/common";
import WidgetPrincipalData from "./widgetPrincipalData";
import WidgetPreview from "./widgetPreview";
import { useTranslation } from "react-i18next";
import GeneralAspectsWidget from "./GeneralAspectsWidget";
import StartButtonWidget from "./StartButtonWidget";
import WelcomeBubbleWidget from "./WelcomeBubbleWidget";
import MenuHomeOptionsWidget from "./MenuHomeOptionsWidget";
import { INTEGRATION_WIDGET_CODE } from "../../../../constants";
import { useFlowsPerChannel } from "../../../../services/brainAPI";
import { get, isEmpty } from "lodash";
import IntegrationsWidget from "./Widget/Integrations/IntegrationsWidget";

const WidgetChannel = (props) => {
    const {
        channelSelected,
        showPrincipalData,
        showSecondTab,
        showThirdTab,
        onChangeName,
        enableEdition,
        handleOnClick,
        setShowDeleteModal,
        openDeleteModal,
        closeDeleteModal,
        selectedWidget = {},
        setSelectedWidget,
        setChannelSelected,
    } = props;
    const { t } = useTranslation();

    const handleOpenDeleteModal = () => {
        setShowDeleteModal(true);
    };

    const {
        metadata: { widget_api_key = "" },
    } = channelSelected;

    const obj = INTEGRATION_WIDGET_CODE(widget_api_key);

    const copyContent = async (obj) => {
        try {
            await navigator.clipboard.writeText(obj);
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    };

    const [onHover, setOnHover] = useState(false);

    const setHover = () => {
        setOnHover(true);
    };

    const setHoverFalse = () => {
        setOnHover(false);
    };

    const tabOptions = [
        { id: 1, name: t("brain.Aspectos generales") },
        { id: 2, name: t("brain.Boton del chat") },
        { id: 3, name: t("brain.Burbuja de bienvenida") },
        { id: 4, name: t("brain.Opciones del menu en home") },
    ];
    const [selectedWidgetTab, setSelectedWidgetTab] = useState(tabOptions[0]);

    useEffect(() => {
        localStorage.setItem("widgetProperties", JSON.stringify({ ...selectedWidget, viewBubble: selectedWidgetTab.id === 3 }));
    }, [selectedWidget, selectedWidgetTab]);

    const { bodyPanel = {}, headerPanel = {}, startButton = {}, theme = {}, tooltipPanel = {}, topMenu = {}, homeMenu = {} } = selectedWidget;

    const {
        data: flowsData,
        isLoading: loadingFlow,
        isRefetching: refetchingFlow,
        refetch: refetchFlow,
    } = useFlowsPerChannel({
        referenceId: channelSelected?.reference_id,
        fetchData: true,
        refetchInterval: 0,
        refetchOnWindowFocus: false,
    });

    const [flowOptions, setFlowOptions] = useState([]);

    useEffect(() => {
        const flows = get(flowsData, "data", []);
        let options;
        if (!isEmpty(flows)) {
            options = flows?.map((flow) => ({ value: flow?.id, label: flow?.title }));
            // options.unshift({ value: 0, label: t("common.flowSelect") });
        } else {
            // options = [{ value: 0, label: t("common.channelWithoutFlows") }];
        }
        setFlowOptions(options);
    }, [flowsData]);

    const showOptions = (selectedWidgetTab) => {
        switch (selectedWidgetTab.id) {
            case 1:
                return <GeneralAspectsWidget setSelectedWidget={setSelectedWidget} headerPanel={headerPanel} theme={theme} bodyPanel={bodyPanel} />;
            case 2:
                return <StartButtonWidget setSelectedWidget={setSelectedWidget} startButton={startButton} theme={theme} />;
            case 3:
                return <WelcomeBubbleWidget setSelectedWidget={setSelectedWidget} tooltipPanel={tooltipPanel} />;
            case 4:
                return (
                    <MenuHomeOptionsWidget
                        setSelectedWidget={setSelectedWidget}
                        homeMenu={homeMenu}
                        channelSelected={channelSelected}
                        loadingFlow={loadingFlow}
                        refetchingFlow={refetchingFlow}
                        refetchFlow={refetchFlow}
                        flowOptions={flowOptions}
                        setChannelSelected={setChannelSelected}
                    />
                );
            default:
                break;
        }
    };

    return (
        <>
            {showPrincipalData && (
                <WidgetPrincipalData
                    onChangeName={onChangeName}
                    channelSelected={channelSelected}
                    enableEdition={enableEdition}
                    handleOnClick={handleOnClick}
                    handleOpenDeleteModal={handleOpenDeleteModal}
                    openDeleteModal={openDeleteModal}
                    closeDeleteModal={closeDeleteModal}
                />
            )}
            {showSecondTab && (
                <div className="flex flex-1 p-0">
                    <VerticalTab selectedWidgetTab={selectedWidgetTab} tabOptions={tabOptions} setOptionSelected={setSelectedWidgetTab} background="bg-teal-5" shadow="none" width="w-auto" opacity={false} />
                    {showOptions(selectedWidgetTab)}
                    <WidgetPreview widgetProperties={selectedWidget} selectedWidgetTab={selectedWidgetTab} />
                </div>
            )}
            {showThirdTab && <IntegrationsWidget setHover={setHover} setHoverFalse={setHoverFalse} onHover={onHover} copyContent={copyContent} obj={obj} apiKey={widget_api_key} />}
        </>
    );
};

export default WidgetChannel;
