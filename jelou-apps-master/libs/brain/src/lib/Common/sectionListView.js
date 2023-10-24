/** Renders the list of "Datastores" and "Datasources" */

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Tippy from "@tippyjs/react";
import isEmpty from "lodash/isEmpty";
import dayjs from "dayjs";
// import { CHANNELS } from "@apps/shared/constants";
import {
    DownIconLarge,
    UpIconLarge,
    EyeIcon,
    PencilIcon2,
    TrashIcon2 /*WhatsappColoredIcon,  CheckboxUnselectedIcon, CheckboxSelectedIcon, WhatsappChannel, FacebookChannel, TwitterChannel FacebookIcon, TwitterColoredIcon */
} from "@apps/shared/icons";
import {
    BRAIN_LOCATION,
    DATASTORE_TABLE_HEADERS,
    DATASOURCE_TABLE_HEADERS,
    DATASOURCE_STATUS,
    DATASOURCE,
    DATASTORE,
    TRUNCATION_CHARACTER_LIMITS,
} from "../constants";
import { useHandleElement } from "../hooks/hooks";
import EmptyData from "./emptyData";
import DeleteConfirmation from "./deleteConfirmationModal";
import CreateOrEditDatastoreModal from "../Components/Datastores/createOrEditDatastoreModal";
import EditDatasourceModal from "../Components/Datasources/Datasources/editDatasourceModal";
import SourceListViewModal from "../Components/Sources";
import ConditionalTruncateTippy from "./conditionalTruncateTippy";
import ButtonWithTippy from "./buttonWithTippy";

const SectionListView = (props) => {
    const {
        displayDatasources,
        tableBodyData,
        sortBySearch,
        isLoading,
        handleAddItem,
        datastoreName,
    } = props;

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
    const location = useLocation().pathname;
    const [itemType, setItemType] = useState("");
    const [tableHeadRow, setTableHeadRow] = useState(displayDatasources
        ? [...DATASOURCE_TABLE_HEADERS]
        : [...DATASTORE_TABLE_HEADERS]
    );

    const handleSortArray = (headerItemValue) => {
        let updatedHeaderItem;
        const updatedTableHeadRow = tableHeadRow.map((header) => {
            if (!isEmpty(header)) {
                if (header.key === headerItemValue) {
                    header.isSort = !header.isSort;
                    updatedHeaderItem = header;
                } else {
                    header.isSort = false;
                }
            }
            return header;
        });
        setTableHeadRow(updatedTableHeadRow);
        sortBySearch(headerItemValue, !updatedHeaderItem.isSort);
    };

    useEffect(() => {
        setTableHeadRow(location === BRAIN_LOCATION
            ? [...DATASTORE_TABLE_HEADERS]
            : [...DATASOURCE_TABLE_HEADERS]
        );
        setItemType(displayDatasources
            ? DATASOURCE.PLURAL_LOWER
            : DATASTORE.PLURAL_LOWER
        );
    }, [location, displayDatasources]);

    if (isEmpty(tableBodyData)) {
        return (
            <div className="mt-10 flex justify-center items-center">
                <EmptyData
                    item={itemType}
                    itemName={datastoreName}
                    onClick={handleAddItem}
                    isDatasource={displayDatasources}/>
            </div>
        );
    }

    return (
        <>
            <div className={`${isEmpty(tableBodyData) ? "h-fit" : "mt-5 overflow-x-auto max-h-[30rem] h-[30rem]"}`}>
                <table className="table-fixed min-w-full text-left text-sm">
                    <thead className="border-b-1 border-neutral-200 sticky top-0 bg-white">
                        <tr>
                            {/* <th className="py-5 px-6 w-14"><CheckboxUnselectedIcon /></th> */}
                            {tableHeadRow.map((headerItem, headRowIndex) => {
                                return (
                                    <th key={`header-${headRowIndex}`}
                                        scope="col"
                                        className="pb-5 h-12 text-left font-bold text-gray-400">
                                        {!isEmpty(headerItem) &&
                                            <>
                                                <button className="flex items-center" onClick={(e) => handleSortArray(headerItem.key)}>
                                                    <div className="pl-5">{headerItem.label}</div>
                                                    {!headerItem.isSort
                                                        ?  <DownIconLarge width={16} height={9} className="text-gray-400 mx-2"/>
                                                        :  <UpIconLarge width={16} height={9} className="text-gray-400 mx-2"/>
                                                    }
                                                </button>
                                            </>
                                        }
                                    </th>
                                );
                            })}
                            <th scope="col" className="pb-5 h-12 text-left font-bold text-gray-400">
                                <div className="pl-5">{t("common.actions")}</div>
                            </th>
                        </tr>
                    </thead>
                    {!isEmpty(tableBodyData) &&
                        <tbody className="text-gray-400 overflow-y-auto">
                            {tableBodyData.map((tableData, bodyRowIndex) => {
                                return(
                                    <tr
                                    key={`${tableData?.name}-${bodyRowIndex}`}
                                    className={`${bodyRowIndex === tableBodyData?.length - 1 ? "" : "border-b-1 border-[#DCDEE4]"} h-14`}>
                                        {/* <td className="px-6 py-3 w-14"><CheckboxUnselectedIcon /></td> */}
                                        <td className="px-6 py-2 w-72 h-14">
                                            <ConditionalTruncateTippy
                                                text={tableData?.name}
                                                charactersLimit={TRUNCATION_CHARACTER_LIMITS.COLUMN}
                                                componentType={"div"}
                                                placement={"top"}
                                            />
                                        </td>
                                        <td className="px-6 py-2 w-52">
                                            {displayDatasources
                                                ? (
                                                    <div className="flex gap-x-3">
                                                        <span>
                                                            {
                                                                tableData?.type === DATASOURCE_TYPES.TEXT
                                                                ? t("common.text")
                                                                : tableData?.type === DATASOURCE_TYPES.FILE
                                                                ? t("common.file")
                                                                : tableData?.type === DATASOURCE_TYPES.WORKFLOW
                                                                ? t("common.flow")
                                                                : tableData?.type === DATASOURCE_TYPES.WEBPAGE
                                                                ? t("common.webpage")
                                                                : tableData?.type
                                                            }
                                                        </span>
                                                    </div>
                                                ) : tableData?.knowledge_count
                                            }
                                        </td>
                                        <td className="px-6 py-2">
                                            {displayDatasources
                                                ? <div>{isEmpty(tableData?.size) ? "-" : tableData.size}</div>
                                                : <div className="flex gap-x-1">
                                                    {isEmpty(tableData?.types) ? "-"
                                                    : tableData.types.length > 2  ? (
                                                        <>
                                                            {tableData.types.slice(0, 2).map((type, index) => {
                                                                return (
                                                                    <div key={`type-${type}-${index}`} className="h-fit flex items-center rounded-lg bg-primary-200 bg-opacity-[.16]">
                                                                        <span className="px-4 py-1 font-bold text-primary-200">
                                                                            {
                                                                                type === DATASOURCE_TYPES.TEXT
                                                                                ? t("common.text")
                                                                                : type === DATASOURCE_TYPES.FILE
                                                                                ? t("common.file")
                                                                                : type === DATASOURCE_TYPES.WORKFLOW
                                                                                ? t("common.flow")
                                                                                : type === DATASOURCE_TYPES.WEBPAGE
                                                                                ? t("common.webpage")
                                                                                : type
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                );
                                                            })}
                                                            <Tippy
                                                                theme="light"
                                                                placement="right"
                                                                touch={false}
                                                                content={tableData.types.slice(2).map((type, index) => (
                                                                    <div className="text-gray-400" key={index}>
                                                                        {
                                                                            type === DATASOURCE_TYPES.TEXT
                                                                            ? t("common.text")
                                                                            : type === DATASOURCE_TYPES.FILE
                                                                            ? t("common.file")
                                                                            : type === DATASOURCE_TYPES.WORKFLOW
                                                                            ? t("common.flow")
                                                                            : type === DATASOURCE_TYPES.WEBPAGE
                                                                            ? t("common.webpage")
                                                                            : type
                                                                        }
                                                                    </div>
                                                            ))}>
                                                                <div className="h-7 flex items-center rounded-lg bg-primary-200 bg-opacity-[.16]">
                                                                    <span className="px-4 py-1 font-bold text-primary-200">
                                                                        +{tableData.types.length - 2}
                                                                    </span>
                                                                </div>
                                                            </Tippy>
                                                        </>
                                                    ) : (
                                                        tableData.types.map((type, index) => {
                                                            return (
                                                                <div key={`type-${type}-${index}`} className="h-7 flex items-center rounded-lg bg-primary-200 bg-opacity-[.16]">
                                                                    <span className="px-4 py-1 font-bold text-primary-200">
                                                                        {
                                                                            type === DATASOURCE_TYPES.TEXT
                                                                            ? t("common.text")
                                                                            : type === DATASOURCE_TYPES.FILE
                                                                            ? t("common.file")
                                                                            : type === DATASOURCE_TYPES.WORKFLOW
                                                                            ? t("common.flow")
                                                                            : type === DATASOURCE_TYPES.WEBPAGE
                                                                            ? t("common.webpage")
                                                                            : type
                                                                        }
                                                                    </span>
                                                                </div>
                                                            );
                                                        })
                                                    )}
                                                </div>
                                            }
                                        </td>
                                        <td className="px-6 py-3">
                                            {displayDatasources &&
                                                /* ? */ <div className={`px-4 py-1.5 h-7 font-bold whitespace-nowrap inline-flex items-center rounded-md bg-opacity-[.16] ${tableData?.sync_status === DATASOURCE_STATUS.SYNCED ? "text-semantic-success-dark bg-semantic-success-dark" : tableData?.sync_status === DATASOURCE_STATUS.SYNCING ? "text-semantic-warning bg-semantic-warning" : tableData?.sync_status === DATASOURCE_STATUS.PENDING ? "text-primary-200 bg-primary-200" : tableData?.sync_status === DATASOURCE_STATUS.FAILED ? "text-semantic-error bg-semantic-error" : ""}`}>
                                                    {
                                                        tableData?.sync_status === DATASOURCE_STATUS.SYNCED
                                                        ? t("common.synced")
                                                        : tableData?.sync_status === DATASOURCE_STATUS.SYNCING
                                                        ? t("common.syncing")
                                                        : tableData?.sync_status === DATASOURCE_STATUS.PENDING
                                                        ? t("common.pending")
                                                        : tableData?.sync_status === DATASOURCE_STATUS.FAILED
                                                        ? t("common.failed")
                                                        : tableData?.sync_status
                                                    }
                                                </div>
            /*                                         : <div className="flex gap-x-1">
                                                    {tableData?.channel?.map((channel, index) => {
                                                        return (
                                                        <div key={`channel-${channel}-${index}`}>
                                                            {channel.toLowerCase() === CHANNELS.WHATSAPP ? (
                                                            <WhatsappChannel />
                                                            ) : channel.toLowerCase() === CHANNELS.TWITTER ? (
                                                            <TwitterChannel width="63px" height="26px"/>
                                                            ) : channel.toLowerCase() === CHANNELS.FACEBOOK ? (
                                                            <FacebookChannel width="60px" height="26px"/>
                                                            ) : channel.toLowerCase() === CHANNELS.WIDGET ? (
                                                            <div>Widget</div>
                                                            ) : null}
                                                        </div>
                                                        );
                                                    })}
                                                </div> */
                                            }
                                        </td>
                                        {displayDatasources &&
                                            <td className="px-6 py-3">{dayjs(tableData?.updated_at).format("DD/MM/YYYY hh:mm:ss")}</td>
                                        }
                                        <td className="px-6 my-4 w-32">
                                            <div className="flex gap-x-7 w-full">
                                                <ButtonWithTippy
                                                    onClick={() => handleEditElement(tableData)}
                                                    icon={<PencilIcon2 className="fill-current text-gray-400 hover:text-primary-200" fillOpacity="1"/>}
                                                    tooltipContent={t("common.edit")}
                                                />
                                                <ButtonWithTippy
                                                    onClick={() => handleViewElement(tableData)}
                                                    icon={<EyeIcon className="fill-current text-gray-400 hover:text-primary-200" fillOpacity="1"/>}
                                                    tooltipContent={t("common.view")}
                                                />
                                                <ButtonWithTippy
                                                    onClick={() => handleDeleteElement(tableData.id)}
                                                    icon={<TrashIcon2 className="text-semantic-error hover:text-primary-200"/>}
                                                    tooltipContent={t("common.delete")}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    }
                </table>
            </div>
            <DeleteConfirmation
                openModal={showDeleteModal}
                closeModal={closeDeleteModal}
                itemType={displayDatasources ? DATASOURCE.SINGULAR_LOWER : DATASTORE.SINGULAR_LOWER}
                elementId={elementId}/>
            <CreateOrEditDatastoreModal
                openModal={showEditDatastoreModal}
                closeModal={closeEditDatastoreModal}
                isEditing={isEditingElement}/>
            <EditDatasourceModal
                openModal={showEditDatasourceModal}
            />
            <SourceListViewModal
                openModal={showSourceListViewModal}
                closeModal={closeSourceListViewModal}/>
        </>
    );
};

export default SectionListView;
