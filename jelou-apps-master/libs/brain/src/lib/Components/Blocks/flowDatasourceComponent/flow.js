import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { toastMessage } from "@apps/shared/common";
import { MESSAGE_TYPES, TOAST_POSITION } from "@apps/shared/constants";
import { CheckCircleIconPrimary, EditButtonIcon, FlowIcon, LoadingSpinner, UpIconLarge } from "@apps/shared/icons";
import ConditionalTruncateTippy from "../../../Common/conditionalTruncateTippy";
import DeleteButton from "../../../Common/deleteButton";
import DeleteConfirmation from "../../../Common/deleteConfirmationModal";
import { ListBoxHeadless } from "../../../Modal/listBox";
import { CHANNEL_ICONS, COMPONENT_NAME, DATASOURCE, ITEM_TYPES, TRUNCATION_CHARACTER_LIMITS } from "../../../constants";
import { areObjectsEqual } from "../../../hooks/helpers";
import { useFlowsPerChannel, useUpdateDatasource } from "../../../services/brainAPI";

const Flow = ({ defaultFlowId, channelReferenceId, channelType, channelName, flowsQuantity, datastoreId, datasourceId, datasource, refetchDatasource }) => {
    const { t } = useTranslation();
    const datasourceValues = { name: datasource?.name, type: datasource?.type, metadata: datasource?.metadata };
    const [fetchFlows, setFetchFlows] = useState(false);
    const [enableSelect, setEnableSelect] = useState(false);
    const [selectedFlow, setSelectedFlow] = useState({ id: null, name: "" });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [options, setOptions] = useState([]);
    const [flowId, setFlowId] = useState(null);
    const [updatedDatasourceValues, setUpdatedDatasourceValues] = useState({
        name: datasource?.name,
        type: datasource?.type,
        metadata: datasource?.metadata,
    });

    const jwt = localStorage.getItem("jwt-master") ?? localStorage.getItem("jwt");

    const { data: flowsData, isLoading: loadingFlows } = useFlowsPerChannel({
        referenceId: channelReferenceId,
        fetchData: fetchFlows,
    });
    const { mutateAsync, isLoading: isUpdatingDatasource } = useUpdateDatasource({
        datastoreId,
        datasourceId,
        newDatasourceInfo: updatedDatasourceValues,
    });

    const handleGoToBuilder = () => {
        const url = `https://builder.jelou.ai/impersonate/${jwt}/${channelReferenceId}`;
        window.open(url, "_blank");
    };

    const handleDeleteFlow = () => {
        setShowDeleteModal(true);
        setUpdatedDatasourceValues((prevValues) => ({
            ...prevValues,
            metadata: {
                flows: {
                    ...prevValues.metadata?.flows,
                    [channelReferenceId]: undefined,
                },
            },
        }));
    };

    const closeDeleteModal = useCallback(() => setShowDeleteModal(false), []);

    const handleSelect = (value) => {
        setUpdatedDatasourceValues((prevValues) => ({
            ...prevValues,
            metadata: {
                flows: {
                    ...prevValues.metadata?.flows,
                    [channelReferenceId]: parseInt(value?.id),
                },
            },
        }));
        setSelectedFlow(value);
    };

    const handleUpdateDatasource = async () => {
        setEnableSelect(!enableSelect);
        if (!areObjectsEqual(datasourceValues, updatedDatasourceValues)) {
            await mutateAsync(
                {},
                {
                    onSuccess: () =>
                        toastMessage({
                            messagePart1: `${t("common.itemUpdated")} ${DATASOURCE.SINGULAR_LOWER}`,
                            messagePart2: datasourceValues.name,
                            type: MESSAGE_TYPES.SUCCESS,
                            position: TOAST_POSITION.TOP_RIGHT,
                        }),
                    onError: () =>
                        toastMessage({
                            messagePart1: `${t("common.itemNotUpdated")} ${DATASOURCE.SINGULAR_LOWER}`,
                            messagePart2: datasourceValues.name,
                            type: MESSAGE_TYPES.ERROR,
                            position: TOAST_POSITION.TOP_RIGHT,
                        }),
                }
            );
        }
    };

    useEffect(() => {
        const flows = get(flowsData, "data", []);
        let options;
        if (!isEmpty(flows)) {
            setFetchFlows(false);
            options = flows?.map((flow) => ({
                id: flow?.id,
                name: flow?.title,
                Icon: <FlowIcon showBackground={false} color="#727C94" />,
            }));
            const selectedFlow = flows.find((flow) => flow?.id === flowId);
            if (isEmpty(selectedFlow)) {
                setSelectedFlow({ id: null, name: t("common.channelWithoutFlows"), Icon: <FlowIcon showBackground={false} color="#727C94" /> });
            } else {
                setSelectedFlow({ id: selectedFlow.id, name: selectedFlow.title, Icon: <FlowIcon showBackground={false} color="#727C94" /> });
            }
        } else {
            options = [{ id: null, name: t("common.channelWithoutFlows"), Icon: <FlowIcon showBackground={false} color="#727C94" /> }];
        }
        setOptions(options);
    }, [flowsData, flowId]);

    useEffect(() => {
        if (!isUpdatingDatasource) {
            setFlowId(get(datasourceValues, `metadata.flows.${channelReferenceId}`, defaultFlowId));
        }
    }, [datasourceValues, isUpdatingDatasource, defaultFlowId]);

    useEffect(() => {
        if (channelReferenceId) {
            setFetchFlows(true);
        }
    }, [channelReferenceId, datasourceId]);

    return (
        <>
            <div className="text-sm text-gray-400">
                <div className="mb-5 flex flex-row items-center justify-between gap-24">
                    <ConditionalTruncateTippy
                        text={channelName}
                        charactersLimit={TRUNCATION_CHARACTER_LIMITS.TITLE}
                        textStyle={"text-base font-bold text-gray-610"}
                        componentType={"div"}
                        width={"w-full"}
                    />
                    {!(flowsQuantity === 1) && <DeleteButton onClick={handleDeleteFlow} buttonText={t("common.deleteFlow")} disabled={enableSelect} />}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="font-bold">{t("common.channel")}</div>
                    <div className="flex items-center justify-start gap-2">
                        <span>{CHANNEL_ICONS[toUpper(channelType)]}</span>
                        <span className="capitalize">{channelType}</span>
                    </div>
                    <div className="font-bold">{"Bot"}</div>
                    <ConditionalTruncateTippy text={channelName} charactersLimit={TRUNCATION_CHARACTER_LIMITS.SMALL_COLUMN} componentType={"div"} width={"w-full"} />
                </div>
                {loadingFlows ? (
                    <div className="my-6 flex h-14 w-full items-center justify-center rounded-xs border-1 border-neutral-200 py-2 px-4">
                        <LoadingSpinner />
                    </div>
                ) : enableSelect ? (
                    <div className="my-6 flex h-14 w-full items-center justify-between gap-4 pr-4">
                        <ListBoxHeadless value={selectedFlow} setValue={handleSelect} list={options} name={COMPONENT_NAME.METADATA} className="h-full" />
                        <button onClick={handleUpdateDatasource}>
                            <CheckCircleIconPrimary
                                className="rounded-full border-1 border-primary-200 hover:opacity-80"
                                width="2.5rem"
                                height="2.5rem"
                                fill="none"
                                stroke="#00B3C7"
                                fillCircle={"#fff"}
                            />
                        </button>
                    </div>
                ) : (
                    <div className="my-6 flex h-14 w-full items-center justify-between rounded-xs border-1 border-neutral-200 py-2 px-4">
                        <div className="flex items-center justify-start gap-2">
                            <FlowIcon color="#727C94" height="1.5rem" width="1.5rem" />
                            <span>{selectedFlow.name}</span>
                        </div>
                        <button onClick={() => setEnableSelect(!enableSelect)}>
                            <EditButtonIcon width="2.5rem" height="2.5rem" className="opacity-80" />
                        </button>
                    </div>
                )}
                <button
                    className="my-px flex w-auto items-center justify-start rounded-xl border-1 border-primary-200 bg-transparent px-5 py-2 text-primary-200 focus:outline-none"
                    onClick={handleGoToBuilder}
                >
                    <span className="font-bold">{t("common.builderFlows")}</span>
                    <UpIconLarge width="0.7rem" height="0.7rem" className="ml-4 rotate-90" />
                </button>
            </div>
            <DeleteConfirmation
                openModal={showDeleteModal}
                closeModal={closeDeleteModal}
                itemType={ITEM_TYPES.FLOW}
                itemName={selectedFlow?.name}
                datasourceValues={updatedDatasourceValues}
                revalidate={refetchDatasource}
            />
        </>
    );
};

export default Flow;
