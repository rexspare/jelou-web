import capitalize from "lodash/capitalize";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setDatasource, setSource } from "@apps/redux/store";
import { setDatastore } from "@apps/redux/store";
import { BlockSkeleton } from "@apps/shared/common";
import { DownIcon, SourceIcon } from "@apps/shared/icons";
import ConditionalTruncateTippy from "../../Common/conditionalTruncateTippy";
import EmptyData from "../../Common/emptyData";
import { Modal } from "../../Modal";
import ModalHeader from "../../Modal/modalHeader";
import { DATASOURCE_STATUS, DATASTORE, SOURCE, TESTER_KEYS, TRUNCATION_CHARACTER_LIMITS } from "../../constants";
import { useOneDatastore } from "../../module/Brains/Infrastructure/queryBrains";
import { useOneBlock, useBlocks } from "../../services/brainAPI";
import Block from "../Blocks/genericDatasourceComponent/block";

export const ModalBlock = ({ openBlockModal, closeModal, modalBlock, displayBlocks = true, handleGoToBlock }) => {
    const datastore = useSelector((state) => state.datastore);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { sourceInfo = {}, blockId, datasource } = modalBlock;
    const { name: title, sync_status: datasourceStatus, id: sourceId } = sourceInfo;
    const [selectedBlockIndex, setSelectedBlockIndex] = useState(null);
    const [editableBlockIndex, setEditableBlockIndex] = useState(null);
    const [blocks, setBlocks] = useState([]);
    const excludedKeys = [TESTER_KEYS.DATASTORE_ID, TESTER_KEYS.DATASOURCE, TESTER_KEYS.SOURCE_INFO, TESTER_KEYS.BLOCK_ID, TESTER_KEYS.TYPE_FLOW];

    const { data: datastoreInfo } = useOneDatastore();

    const { data: blockData, isFetching } = useOneBlock({ sourceId, fetchData: openBlockModal, blockId });
    const { refetch } = useBlocks({ sourceId, fetchData: displayBlocks });

    const getStatusClassName = (status) => {
        switch (status) {
            case DATASOURCE_STATUS.SYNCED:
                return "bg-semantic-success-dark text-semantic-success-dark";
            case DATASOURCE_STATUS.FAILED:
                return "bg-semantic-error text-semantic-error";
            case DATASOURCE_STATUS.SYNCING:
                return "bg-semantic-warning text-semantic-warning";
            case DATASOURCE_STATUS.PENDING:
                return "bg-primary-200 text-primary-200";
            default:
                return "";
        }
    };

    useEffect(() => {
        if (!isEmpty(datastore)) {
            localStorage.setItem(DATASTORE.SINGULAR_LOWER, JSON.stringify(datastore));
        } else {
            if (!isEmpty(datastoreInfo)) {
                localStorage.setItem(DATASTORE.SINGULAR_LOWER, JSON.stringify(datastoreInfo));
                dispatch(setDatastore(datastoreInfo));
            }
        }
    }, [datastore, datastoreInfo]);

    useEffect(() => {
        if (!isFetching) {
            const blocks = get(blockData, "data", []);
            const isArray = Array.isArray(blocks);
            if (!isEmpty(blocks)) {
                isArray ? setBlocks(blocks) : setBlocks([blocks]);
            }
        }
        if (openBlockModal) {
            dispatch(setSource(sourceInfo));
            dispatch(setDatasource(datasource));
        }
    }, [isFetching, blockData]);

    return (
        <Modal closeModal={() => null} openModal={openBlockModal} className="w-full max-w-3xl transform rounded-xl bg-white text-left align-middle shadow-xl transition-all" classNameActivate="">
            <div className="mb-1 h-full flex-row">
                <ModalHeader title={capitalize(t("common.informationSource"))} closeModal={closeModal} icon={<SourceIcon stroke="currentColor" className="mr-3" />} />
                <section className="flex h-auto w-full flex-col space-y-4 overflow-y-scroll p-6 pb-1">
                    <div className="flex items-center justify-between gap-x-4">
                        <ConditionalTruncateTippy text={title} charactersLimit={TRUNCATION_CHARACTER_LIMITS.HEADER} textStyle={"text-xl font-bold text-primary-200"} width={"w-86"} />
                        <button
                            className="flex w-36 items-center justify-center rounded-full border-1 border-primary-200 p-1 font-semibold text-primary-200 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={() => handleGoToBlock(modalBlock)}
                            disabled={isEmpty(blocks)}
                        >
                            {`${t("common.goToThe")} ${t(SOURCE.SINGULAR_LOWER)}`} <DownIcon width="1.625rem" height="1.625rem" className="rotate-270" fill="currentColor" />
                        </button>
                    </div>
                    <div className="my-4 grid grid-cols-1 gap-1">
                        {Object.keys(modalBlock).map((key) => {
                            if (!excludedKeys.includes(key)) {
                                return (
                                    <div key={key} className="flex flex-row justify-between text-gray-400">
                                        <div className="font-semibold capitalize">{`${t(key)}:`}</div>
                                        {key === TESTER_KEYS.SOURCE ? (
                                            <div className="capitalize">{t(modalBlock[key])}</div>
                                        ) : key === TESTER_KEYS.SCORE ? (
                                            <div className="font-light">{modalBlock[key].toFixed(2)}</div>
                                        ) : (
                                            <div className="truncate">{modalBlock[key]}</div>
                                        )}
                                    </div>
                                );
                            }
                            return null;
                        })}
                        <div className="flex flex-row justify-between text-gray-400">
                            <span className="font-semibold capitalize">{`${t("common.status")}:`}</span>
                            {displayBlocks && (
                                <div className={`h-8 w-32 items-center rounded-lg bg-opacity-[.16] px-3 py-1 text-center font-bold ${getStatusClassName(datasourceStatus)}`}>
                                    {datasourceStatus === DATASOURCE_STATUS.SYNCED
                                        ? t("common.synced")
                                        : datasourceStatus === DATASOURCE_STATUS.SYNCING
                                        ? t("common.syncing")
                                        : datasourceStatus === DATASOURCE_STATUS.PENDING
                                        ? t("common.pending")
                                        : datasourceStatus === DATASOURCE_STATUS.FAILED
                                        ? t("common.failed")
                                        : datasourceStatus}
                                </div>
                            )}
                        </div>
                    </div>

                    {isFetching ? (
                        <BlockSkeleton />
                    ) : isEmpty(blocks) ? (
                        <div className="flex items-center justify-center py-8">
                            <EmptyData imageWidth={"200px"} imageHeight={"200px"} textClassName={"my-4 text-sm text-gray-400"} showButton={false} message={t("common.couldNotFindSource")} />
                        </div>
                    ) : (
                        blocks.map((block, idx) => {
                            const isSelected = idx === selectedBlockIndex;
                            const isEditable = idx === editableBlockIndex;
                            return (
                                <Block
                                    key={`block-${idx}`}
                                    index={idx}
                                    renderedBlock={block}
                                    isBlockSelected={isSelected || false}
                                    isBlockEditable={isEditable || false}
                                    sourceId={sourceId}
                                    blocksQuantity={blocks?.length}
                                    setSelectedBlockIndex={setSelectedBlockIndex}
                                    editableBlockIndex={editableBlockIndex}
                                    setEditableBlockIndex={setEditableBlockIndex}
                                    isModal={true}
                                    isLastBlock={idx === blocks.length - 1}
                                    closeModal={closeModal}
                                    refetch={refetch}
                                />
                            );
                        })
                    )}
                </section>
            </div>
        </Modal>
    );
};

export default ModalBlock;
