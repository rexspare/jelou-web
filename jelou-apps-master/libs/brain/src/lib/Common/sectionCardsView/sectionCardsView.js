import isEmpty from "lodash/isEmpty";
import { useTranslation } from "react-i18next";

import { useTimeAgo } from "@apps/shared/hooks";
import EditDatasourceModal from "../../Components/Datasources/Datasources/editDatasourceModal";
import CreateOrEditDatastoreModal from "../../Components/Datastores/createOrEditDatastoreModal";
import SourceListViewModal from "../../Components/Sources";
import { DATASOURCE, DATASOURCE_STATUS, DATASTORE } from "../../constants";
import { useHandleElement } from "../../hooks/hooks";
import CardsLoading from "../cardsLoading";
import DeleteConfirmation from "../deleteConfirmationModal";
import EmptyData from "../emptyData";
import DetailsCard from "./DetailsCard";
import IconCard from "./IconCard";
import MultipleIcons from "./MultipleIcons";
import NameCard from "./nameCard";
import OptionsCard from "./optionsCard";

const DATASOURCE_STATUS_COLORS = {
    [DATASOURCE_STATUS.SYNCED]: ["bg-semantic-success-dark text-semantic-success-dark", "common.synced"],
    [DATASOURCE_STATUS.SYNCING]: ["bg-semantic-warning text-semantic-warning", "common.syncing"],
    [DATASOURCE_STATUS.PENDING]: ["bg-primary-200 text-primary-200", "common.pending"],
    [DATASOURCE_STATUS.FAILED]: ["bg-semantic-error text-semantic-error", "common.failed"],
};
function getPercentage(total, current) {
    if (current === 0) return 0;
    return Math.floor((current / total) * 100);
}

const SectionCardsView = ({
    tableBodyData,
    data,
    displayDatasources,
    datastore,
    handleAddDatasource,
    handleCreateDatastore,
    isLoading,
    revalidateDatastore,
    refetchDatasources,
}) => {
    const {
        elementId,
        closeDeleteModal,
        closeEditDatastoreModal,
        closeEditDatasourceModal,
        closeSourceListViewModal,
        isEditingElement,
        handleDeleteElement,
        handleEditElement,
        handleViewElement,
        showDeleteModal,
        showEditDatastoreModal,
        showEditDatasourceModal,
        showSourceListViewModal,
    } = useHandleElement(displayDatasources);
    const { t } = useTranslation();
    const { getTimeAgo } = useTimeAgo();

    const getDetailsFromTypeDatastore = (datastore) => {
        if (!displayDatasources)
            return [
                { key: `No. ${DATASOURCE.PLURAL_CAPITALIZED}`, value: datastore?.knowledge_count },
                { key: t("common.type"), value: datastore.types, badgeTypes: true },
            ];
        else
            return [
                { key: t("Blocks"), value: datastore.chunks },
                { key: t("common.lastUpdate"), value: getTimeAgo(datastore.updated_at) },
            ];
    };

    if (isLoading) {
        return <CardsLoading />;
    }

    if (isEmpty(data)) {
        return (
            <div className="my-10 flex h-4/5 w-full items-center justify-center">
                <EmptyData
                    item={displayDatasources ? DATASOURCE.PLURAL_LOWER : DATASTORE.PLURAL_LOWER}
                    itemName={displayDatasources ? datastore.name : DATASTORE.PLURAL_CAPITALIZED}
                    onClick={displayDatasources ? handleAddDatasource : handleCreateDatastore}
                    isDatasource={displayDatasources}
                    buttonText={displayDatasources ? DATASOURCE.SINGULAR_LOWER : DATASTORE.SINGULAR_LOWER}
                />
            </div>
        );
    }

    return (
        <>
            <div
                className={`${
                    displayDatasources
                        ? "h-[calc(85vh-145px)] lg:h-[calc(85vh-145px)] xl:h-[calc(85vh-100px)] 2xl:h-[calc(85vh-145px)]"
                        : "h-[calc(85vh-45px)] lg:h-[calc(85vh-45px)] xl:h-[calc(85vh-10px)] 2xl:h-[calc(85vh-45px)]"
                } mb-14 grid grid-flow-row auto-rows-[13rem] grid-cols-[repeat(auto-fill,_minMax(18.125rem,_1fr))] justify-center gap-6 overflow-y-scroll p-6 xxl:auto-rows-[15rem]`}
            >
                {!isEmpty(tableBodyData) &&
                    tableBodyData.map((item, index) => {
                        const moreThanOneType = item?.channel_types?.length > 1;
                        const sync_status = item?.sync_status;
                        const [badgedColor, badgedText] = DATASOURCE_STATUS_COLORS[sync_status] || ["", ""];
                        const isSynced = sync_status === DATASOURCE_STATUS.SYNCED;
                        const porcentage = getPercentage(item.chunks, item.synced_chunks);

                        return (
                            <div key={`item-${index}`} className="relative">
                                <div
                                    className={`reltive z-0 flex max-h-[15rem] min-h-[13rem] flex-col justify-around rounded-12 border-1 border-neutral-200 pt-4 ${
                                        !displayDatasources ? "pb-4" : "pb-6"
                                    } px-5 hover:cursor-pointer hover:border-primary-200/15 hover:shadow-data-card 2xl:h-[15rem]`}
                                    onClick={() => handleViewElement(item)}>
                                    <div className="mb-3 flex items-start">
                                        {moreThanOneType ? (
                                            <MultipleIcons types={item?.channel_types} />
                                        ) : (
                                            <IconCard type={displayDatasources ? item?.type : item?.channel_types} />
                                        )}
                                        <div className="absolute top-0 right-0 mt-3 mr-1 flex items-center">
                                            <div
                                                className={`whitespace-nowrap rounded-md bg-opacity-[.16] py-0.75 px-3 text-sm font-bold ${
                                                    !isSynced ? "pb-2" : ""
                                                } ${badgedColor}`}>
                                                {t(badgedText)}
                                                {!isSynced && (
                                                    <div className="h-1 rounded-full bg-neutral-200">
                                                        <div
                                                            style={{
                                                                width: `${porcentage}%`,
                                                            }}
                                                            className={`h-1 rounded-full bg-current`}></div>
                                                    </div>
                                                )}
                                            </div>
                                            <OptionsCard
                                                items={[
                                                    { text: t("common.edit"), onClick: () => handleEditElement(item) },
                                                    { text: t("common.view"), onClick: () => handleViewElement(item) },
                                                    { text: t("common.delete"), onClick: () => handleDeleteElement(item.id) },
                                                ]}
                                            />
                                        </div>
                                    </div>
                                    <NameCard name={item?.name} />
                                    <DetailsCard items={getDetailsFromTypeDatastore(item)} justify={displayDatasources ? "between" : "start"} />
                                </div>
                            </div>
                        );
                    })}
            </div>
            <DeleteConfirmation
                revalidate={revalidateDatastore}
                openModal={showDeleteModal}
                closeModal={closeDeleteModal}
                itemType={displayDatasources ? DATASOURCE.SINGULAR_LOWER : DATASTORE.SINGULAR_LOWER}
                elementId={elementId}
            />
            <CreateOrEditDatastoreModal
                openModal={showEditDatastoreModal}
                closeModal={closeEditDatastoreModal}
                isEditing={isEditingElement}
                revalidate={revalidateDatastore}
            />
            <EditDatasourceModal openModal={showEditDatasourceModal} closeModal={closeEditDatasourceModal} refetchDatasources={refetchDatasources} />
            <SourceListViewModal openModal={showSourceListViewModal} closeModal={closeSourceListViewModal} />
        </>
    );
};

export default SectionCardsView;
