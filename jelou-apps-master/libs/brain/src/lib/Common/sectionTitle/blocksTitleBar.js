import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import { DATASOURCE_STATUS, ITEM_TYPES, TRUNCATION_CHARACTER_LIMITS } from "../../constants";
import DeleteConfirmation from "./../deleteConfirmationModal";
import DeleteButton from "./../deleteButton";
import ConditionalTruncateTippy from "../conditionalTruncateTippy";

const BlocksTitleBar = (props) => {
    const {
        title,
        datasourceStatus,
        hasBlocks, hasFlows,
        totalSources,
        isDatasourceTypeFlow,
        isSkill,
        isLoading,
    } = props;
    const { t } = useTranslation();
    const datasource = useSelector((state) => state.datasource);
    const [showDeleteSourceModal, setShowDeleteSourceModal] = useState(false);

    const handleDeleteSource = () => setShowDeleteSourceModal(true);
    const closeDeleteSourceModal = useCallback(() => setShowDeleteSourceModal(false), []);

    if (isLoading) {
        return (
            <SkeletonTheme color="#e7e7e7" highlightColor="#44444412">
                <div className="w-full mb-5 flex flex-row items-center justify-between">
                    <Skeleton />
                </div>
            </SkeletonTheme>
        );
    }

    return (
        <div className="flex justify-between p-6">
            <div className="flex items-center gap-x-4">
                <ConditionalTruncateTippy
                    text={title}
                    charactersLimit={TRUNCATION_CHARACTER_LIMITS.HEADER}
                    textStyle={"text-xl font-bold text-primary-200"}
                />
                <div
                    className={`h-8 w-32 items-center rounded-lg bg-opacity-[.16] px-3 py-1 text-center font-bold ${
                        datasourceStatus === DATASOURCE_STATUS.SYNCED
                            ? "bg-semantic-success-dark text-semantic-success-dark"
                            : datasourceStatus === DATASOURCE_STATUS.FAILED
                            ? "bg-semantic-error text-semantic-error"
                            : datasourceStatus === DATASOURCE_STATUS.SYNCING
                            ? "bg-semantic-warning text-semantic-warning"
                            : datasourceStatus === DATASOURCE_STATUS.PENDING
                            ? "bg-primary-200 text-primary-200"
                            : ""
                    }`}>
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
            </div>
            {(hasBlocks || hasFlows || isSkill) &&
                <DeleteButton
                    onClick={handleDeleteSource}
                    buttonText={t("common.deleteAll")}
                />
            }
            <DeleteConfirmation
                openModal={showDeleteSourceModal}
                closeModal={closeDeleteSourceModal}
                itemType={(isDatasourceTypeFlow || isSkill) ? ITEM_TYPES.DATASOURCE : ITEM_TYPES.SOURCE}
                elementId={datasource?.id}
                isSource={!(isDatasourceTypeFlow || isSkill)}
                totalSources={totalSources}
                deleteDatasourceFromFlows={hasFlows || isSkill}
            />
        </div>
    );
};

export default BlocksTitleBar;
