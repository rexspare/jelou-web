import dayjs from "dayjs";
import "dayjs/locale/es";

import { RenderPreviewMessage } from "@apps/diffusion/ui-shared";
import { SlideOver } from "@apps/shared/common";
import { ssToHMSUnformatedd } from "@apps/shared/utils";
import get from "lodash/get";
import has from "lodash/has";
import isEmpty from "lodash/isEmpty";
import toLower from "lodash/toLower";
import toUpper from "lodash/toUpper";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BeatLoader } from "react-spinners";

const CampaignPreview = (props) => {
    const {
        template,
        selectedHsm,
        renderBeatLoader,
        campaignToPreview,
        onClose,
        isOpen,
        // configurations,
        flows,
        loadingHsm,
    } = props;
    const name = get(props.template, "name", "");
    const status = get(props.template, "status", "");

    const createdAt = get(campaignToPreview, "createdAt", "");
    const scheduledAt = get(campaignToPreview, "scheduledAt", "");
    const haveSavedConfiguration = !isEmpty(get(campaignToPreview, "metadata.actions.campaignConfigurationId", ""));
    const haveNewConfiguration =
        has(campaignToPreview, "metadata.actions.setFlow") || (has(campaignToPreview, "metadata.actions.setState") && !haveSavedConfiguration);
    const haveExtraParams = !isEmpty(get(campaignToPreview, "metadata.actions.setStoreParams", ""));
    const haveButtonPayloads = has(campaignToPreview, "metadata.buttonPayloads") && !isEmpty(get(campaignToPreview, "metadata.buttonPayloads", ""));

    // const configuration = configurations.find((config) => config.id === get(campaignToPreview, "metadata.actions.campaignConfigurationId", ""));
    const [isPreviewImageUploaded, setIsPreviewImageUploaded] = useState(false);
    const { t } = useTranslation();

    const statusColor = {
        CANCELLED: "bg-[#FFF3CE] text-[#D39C00]",
        COMPLETED: "bg-green-20 text-green-960",
        SUCCESSFUL: "bg-[#DEF1EE] text-[#209F8B]",
        SCHEDULED: "bg-[#D9F4F7] text-[#00B3C7]",
        REJECTED: "bg-red-1040 text-red-1030",
        PENDING: "bg-[#E4E8EE] text-gray-400",
        IN_PROGRESS: "bg-gray-10 text-gray-400",
    };

    const Badge = (value) => {
        return (
            <div>
                <span className={`rounded-xl px-3 py-1 text-sm font-bold capitalize ${statusColor[value]}`}>{t(`hsm.${toLower(value)}`)}</span>
            </div>
        );
    };

    const renderType = (type) => {
        switch (toUpper(type)) {
            case "OPTIONS":
                return "Opciones";
            case "INPUT":
                return "Pregunta";
            default:
                return "Flujo";
        }
    };

    const renderConfiguration = () => {
        const { metadata } = campaignToPreview;
        const options = get(metadata, "actions.setState.options", []);
        let type;
        let buttonFlowIds;
        // const buttonFlowIds = ["19530", "19530"];
        if (haveButtonPayloads) {
            buttonFlowIds = get(metadata, "buttonPayloads", []).map((button) => button.flowId);
            type = "BUTTON";
        } else {
            type = get(metadata, "actions.setFlow.type");
        }

        const returnConfigurationName = !isEmpty(get(campaignToPreview, "metadata.actions.campaignConfigurationName")) && (
            <div className="flex">
                <div className="min-w-50 text-sm font-semibold text-gray-400">{t("tables.Nombre")}</div>
                <div className="pl-2 text-sm text-gray-400 text-opacity-75">
                    {get(campaignToPreview, "metadata.actions.campaignConfigurationName", "--")}
                </div>
            </div>
        );

        const returnTypeAnswer = (
            <div className="flex">
                <div className="min-w-50 text-sm font-semibold text-gray-400">{t("templateViewer.Tipo de respuesta")}</div>
                <div className="pl-2 text-sm text-gray-400 text-opacity-75">{renderType(get(metadata, "actions.setState.type", ""))}</div>
            </div>
        );

        const returnDuration = has(metadata, "actions.setState.ttl") && (
            <div className="flex">
                <div className="min-w-50 text-sm font-semibold text-gray-400">{t("selectCampaign.duration")}</div>
                <div className="pl-2 text-sm text-gray-400 text-opacity-75">{ssToHMSUnformatedd(get(metadata, "actions.setState.ttl", []))}</div>
            </div>
        );

        switch (toUpper(type)) {
            case "OPTIONS": // type => options
                return (
                    <>
                        {returnConfigurationName}
                        {returnTypeAnswer}
                        <div className="flex">
                            <div className="min-w-50 text-sm font-semibold text-gray-400">{t("templateViewer.options")}</div>
                            <div className="pl-2 text-sm font-semibold text-gray-400 text-opacity-75">{t("templateViewer.flow")}</div>
                        </div>

                        {options.map((option) => (
                            <div className="flex">
                                <div className="min-w-50 pl-2 text-sm text-gray-400">{option.title}</div>
                                <div className="pl-2 text-sm text-gray-400 text-opacity-75">
                                    {flows.find((flow) => flow.id === Number(option.flowId)).title}
                                </div>
                            </div>
                        ))}
                        {returnDuration}
                    </>
                );
            case "INPUT": // type => question
                return (
                    <>
                        {returnConfigurationName}
                        {returnTypeAnswer}
                        <div className="flex">
                            <div className="min-w-50 text-sm font-semibold text-gray-400">{t("templateViewer.Pregunta")}</div>
                            <div className="pl-2 text-sm text-gray-400 text-opacity-75">
                                {get(campaignToPreview, "metadata.actions.setState.inputId", "-")} {" - "}
                                {flows.find((flow) => flow.id === Number(get(campaignToPreview, "metadata.actions.setState.flowId", "")))?.title ??
                                    "-"}
                            </div>
                        </div>
                        {returnDuration}
                    </>
                );
            case "BUTTON": // type => Buttons
                return (
                    <div className="flex">
                        <div className="min-w-50 text-sm font-semibold text-gray-400">{t("hsm.QUICK_REPLY")}</div>

                        <div className="flex flex-col space-y-4">
                            {buttonFlowIds.map((buttonFlowId) => (
                                <div className=" pl-2 text-sm text-gray-400 text-opacity-75">
                                    {flows.find((flow) => flow.id === Number(buttonFlowId))?.title ?? "-"}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default: {
                // type => flow
                const flow = flows.find((flow) => flow.id === Number(get(campaignToPreview, "metadata.actions.setFlow.id", "")));
                return (
                    <>
                        {returnConfigurationName}
                        {returnTypeAnswer}
                        <div className="flex">
                            <div className="min-w-50 text-sm font-semibold text-gray-400">{t("templateViewer.Nombre del Flujo")}</div>
                            <div className="pl-2 text-sm text-gray-400 text-opacity-75">{get(flow, "title", " - ")}</div>
                        </div>
                        {returnDuration}
                    </>
                );
            }
        }
    };

    const handleUploadImage = () => {
        setIsPreviewImageUploaded(true);
    };

    return (
        <SlideOver isOpen={isOpen} title={name} closeModal={onClose}>
            <div className="px-6 pb-4">
                {loadingHsm ? (
                    <div className="flex min-h-18 items-center justify-center">
                        <BeatLoader color="#00B3C7" size={10} />
                    </div>
                ) : (
                    <>
                        {template ? <div className="mb-4">{Badge(status)}</div> : "--"}
                        {selectedHsm && (
                            <RenderPreviewMessage
                                renderBeatLoader={renderBeatLoader}
                                paramsNew={[]}
                                inputNames={{}}
                                template={selectedHsm}
                                mediaUrl={get(campaignToPreview, "metadata.mediaUrl", get(selectedHsm, "mediaUrl", ""))}
                                isPreviewImageUploaded={isPreviewImageUploaded}
                                handleUploadImage={handleUploadImage}
                            />
                        )}
                    </>
                )}

                <div className="mt-4 divide-y-1 divide-gray-200">
                    <div className="flex pt-2">
                        <div className="text-sm font-semibold text-gray-400">{t("hsm.template")} </div>
                        <div className="pl-4 text-sm font-bold text-primary-200">{get(template, "metadata.elementName")} </div>
                    </div>
                    <div className="mt-4 pb-4">
                        <div className="my-4 text-sm font-semibold text-gray-400">{t("templateViewer.Detalles de la campaña")}</div>
                        <div className="flex">
                            <div className="min-w-50 text-sm font-semibold text-gray-400">{t("tables.No. Destinatarios")}</div>
                            <div className="pl-2 text-sm text-gray-400 text-opacity-75">{get(template, "rowCount", "")} </div>
                        </div>
                        <div className="flex">
                            <div className="min-w-50 text-sm font-semibold text-gray-400">Bot</div>
                            <div className="pl-2 text-sm text-gray-400 text-opacity-75">{get(template, "bot.name", "")} </div>
                        </div>
                        <div className="flex">
                            <div className="min-w-50 text-sm font-semibold text-gray-400">{t("tables.Fecha de envío")}</div>
                            <div className="pl-2 text-sm text-gray-400 text-opacity-75">
                                {!isEmpty(scheduledAt) ? dayjs(scheduledAt).format("DD-MM-YYYY HH:mm") : dayjs(createdAt).format("DD-MM-YYYY HH:mm")}
                            </div>
                        </div>
                        <div className="flex">
                            <div className="min-w-50 text-sm font-semibold text-gray-400">{t("tables.Fecha de creación")}</div>
                            <div className="pl-2 text-sm text-gray-400 text-opacity-75">{dayjs(createdAt).format("DD-MM-YYYY HH:mm")}</div>
                        </div>
                        <div className="flex">
                            <div className="min-w-50 text-sm font-semibold text-gray-400">{t("common.Enviada por")}</div>
                            <div className="pl-2 text-sm text-gray-400 text-opacity-75">{get(campaignToPreview, "sendBy.names", "-")}</div>
                        </div>
                        <div className="flex">
                            <div className="min-w-50 text-sm font-semibold text-gray-400"></div>
                            <div className="pl-2 text-sm text-gray-400 text-opacity-75">{get(campaignToPreview, "sendBy.email", "-")}</div>
                        </div>
                    </div>
                </div>
                <div className="mt-4 border-t-1 border-gray-200">
                    <div className="my-4 text-sm font-semibold text-gray-400">{t("templateViewer.Configuración de la campaña")}</div>
                    {haveSavedConfiguration || haveNewConfiguration || haveButtonPayloads ? (
                        renderConfiguration()
                    ) : (
                        <div className="pt-2 text-center text-sm font-light text-gray-400"> - {t("tables.No Aplica")} - </div>
                    )}
                </div>

                <div className="mt-4 border-t-1 border-gray-200">
                    <div className="my-4 text-sm font-semibold text-gray-400">{t("templateViewer.Parámetros Adicionales")}</div>
                    {haveExtraParams ? (
                        Object.keys(get(campaignToPreview, "metadata.actions.setStoreParams", {})).map((key) => {
                            return (
                                <div className="flex">
                                    <div className="min-w-50 text-sm font-semibold text-gray-400">{key}</div>
                                    <div className="pl-2 text-sm text-gray-400 text-opacity-75">
                                        {get(campaignToPreview, "metadata.actions.setStoreParams", {})[key]}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="pt-2 text-center text-sm font-light text-gray-400"> - {t("tables.No Aplica")} - </div>
                    )}
                </div>
            </div>
        </SlideOver>
    );
};

export default CampaignPreview;
