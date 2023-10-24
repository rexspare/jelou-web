import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import get from "lodash/get";

import { toastMessage } from "@apps/shared/common";
import { CloseIcon1, LoadingSpinner, TrashIcon2 } from "@apps/shared/icons";
import { MESSAGE_TYPES, TOAST_POSITION } from "@apps/shared/constants";
import { ITEM_TYPES } from "../constants";
import { Modal } from "../Modal";
import { useDeleteBlock, useDeleteDatasource, useDeleteDatastore, useDeleteSource, useUpdateDatasource } from "../services/brainAPI";

const DeleteConfirmation = ({
    revalidate,
    openModal,
    closeModal,
    itemType,
    itemName = "",
    elementId,
    isSource,
    totalSources,
    deleteDatasourceFromFlows = false,
    datasourceValues = {},
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const datasource = useSelector((state) => state.datasource);
    const datastore = useSelector((state) => state.datastore);
    const source = useSelector((state) => state.source);
    const datastoreId = get(datastore, "id", "");
    const datasourceId = get(datasource, "id", "");
    const sourceId = get(source, "id", "");
    const [deleteDatasourceFromBlocks, setDeleteDatasourceFromBlocks] = useState(false);
    const [item, setItem] = useState("");

    const datastoreMutation = useDeleteDatastore({ datastoreId: elementId });
    const datasourceMutation = useDeleteDatasource({
        datastoreId,
        datasourceId: deleteDatasourceFromBlocks ? datasourceId : elementId,
    });
    const sourceMutation = useDeleteSource({ datasourceId, sourceId });
    const blockMutation = useDeleteBlock({ sourceId, blockId: elementId });
    const flowMutation = useUpdateDatasource({ datastoreId, datasourceId, newDatasourceInfo: datasourceValues });

    const handleDeleteItem = async () => {
        let deletedItem = "";
        try {
            if (itemType === ITEM_TYPES.DATASTORE) {
                deletedItem = ITEM_TYPES.DATASTORE;
                await datastoreMutation.mutateAsync();
                revalidate();
            } else if (itemType === ITEM_TYPES.DATASOURCE) {
                deletedItem = ITEM_TYPES.DATASOURCE;
                await datasourceMutation.mutateAsync();
                if (deleteDatasourceFromFlows) {
                  navigate(`/brain/${datastoreId}`);
                }
            } else if (itemType === ITEM_TYPES.SOURCE) {
                deletedItem = t(ITEM_TYPES.SOURCE);
                if (deleteDatasourceFromBlocks) {
                    await datasourceMutation.mutateAsync();
                } else {
                    await sourceMutation.mutateAsync();
                }
                navigate(`/brain/${datastoreId}/knowledge`);
            } else if (itemType === ITEM_TYPES.BLOCK) {
              deletedItem = t(ITEM_TYPES.BLOCK);
                if(datasource.chunks===1){
                  await datasourceMutation.mutateAsync();
                }else{
                  await blockMutation.mutateAsync();
                }
                revalidate();
            } else if (itemType === ITEM_TYPES.FLOW) {
                deletedItem = t(ITEM_TYPES.FLOW);
                await flowMutation.mutateAsync();
                revalidate();
            }
            toastMessage({
                messagePart1: `${t("common.itemDeleted")} ${deletedItem}`,
                messagePart2: itemName,
                type: MESSAGE_TYPES.SUCCESS,
                position: TOAST_POSITION.TOP_RIGHT,
            });
        } catch (error) {
            toastMessage({
                messagePart1: `${t("common.itemNotDeleted")} ${deletedItem}`,
                messagePart2: itemName,
                type: MESSAGE_TYPES.ERROR,
                position: TOAST_POSITION.TOP_RIGHT,
            });
        }
        setDeleteDatasourceFromBlocks(false);
        closeModal();
    };

    useEffect(() => {
        if (itemType === ITEM_TYPES.DATASTORE) {
            setItem(itemType);
        } else {
            setItem(t(itemType));
        }
    }, [itemType]);

    useEffect(() => {
        if (totalSources === 1) {
            setDeleteDatasourceFromBlocks(true);
        }else if(datasource.chunks===1){
          setDeleteDatasourceFromBlocks(true);
        }
    }, [totalSources]);

    return (
        <Modal
            closeModal={() => null}
            openModal={openModal}
            className="h-min w-auto rounded-20 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)]"
            classNameActivate="">
            <div className="w-[395px] justify-start">
                <header className="right-0 top-0 flex items-center justify-between bg-semantic-error-light px-10 py-5">
                    <div className="flex items-center gap-x-4 text-semantic-error">
                        <TrashIcon2 />
                        <div className="text-xl font-semibold">{`${t("common.delete")} ${item}`}</div>
                    </div>
                    <button onClick={closeModal}>
                        <CloseIcon1 className="fill-current text-semantic-error" />
                    </button>
                </header>
                <section className="space-y-6 px-10 pt-10 pb-12">
                    <div>
                        {`${isSource ? t("brain.feminineDeleteQuestion") : t("brain.deleteQuestion")}
                        ${item}?`}
                    </div>
                    <div>
                        {`${isSource ? t("brain.feminineDeleteInformation1") : t("brain.deleteInformation1")}
                        ${item}
                        ${isSource ? t("brain.feminineDeleteInformation2") : t("brain.deleteInformation2")}`}
                    </div>
                    <div className="flex justify-between gap-x-5">
                        <button type="reset" onClick={closeModal} className="max-w-28 flex h-9 w-full items-center justify-center whitespace-nowrap rounded-3xl bg-gray-10 px-5 py-2 font-bold text-gray-400">
                            {t("common.cancel")}
                        </button>
                        <button
                            type="button"
                            disabled={
                                datastoreMutation.isLoading ||
                                datasourceMutation.isLoading ||
                                blockMutation.isLoading ||
                                sourceMutation.isLoading ||
                                flowMutation.isLoading
                            }
                            onClick={handleDeleteItem}
                            className="max-w-46 flex h-9 w-full items-center justify-center whitespace-nowrap rounded-3xl bg-semantic-error px-5 py-2 font-bold text-white hover:opacity-80">
                            {datastoreMutation.isLoading ||
                            datasourceMutation.isLoading ||
                            blockMutation.isLoading ||
                            sourceMutation.isLoading ||
                            flowMutation.isLoading ? (
                                <LoadingSpinner />
                            ) : isSource ? (
                                t("common.feminineYesDelete")
                            ) : (
                                t("common.yesDelete")
                            )}
                        </button>
                    </div>
                </section>
            </div>
        </Modal>
    );
};

export default DeleteConfirmation;
