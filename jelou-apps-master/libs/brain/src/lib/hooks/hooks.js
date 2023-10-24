import isEmpty from "lodash/isEmpty";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setDatasource, setDatastore } from "@apps/redux/store";
import { DATASOURCE_TYPES, ITEM_TYPES } from "../constants";

/** Receives an array of objects and orders it according to the
 * indicated array key (fsortBy), ascending or descending */

export const useSortByField = ({ arrayToSort, sortBy, isAscending = true }) => {
    return arrayToSort.sort((a, b) => {
        const valueA = a[sortBy];
        const valueB = b[sortBy];
        if (valueA < valueB) return isAscending ? -1 : 1;
        if (valueA > valueB) return isAscending ? 1 : -1;
        return 0;
    });
};

/** Receives a string and if it finds URLs, it replaces them with a text + a link,
 * which when clicked opens a new page with that URL */

export const useReplaceURLWithLink = (text) => {
    const { t } = useTranslation();
    const urlRegex = /((?:https?|ftp):\/\/[\w/\-?=%.#áéíóúäëïöüñÁÉÍÓÚÄËÏÖÜÑ]+(?::\d+)?(?:\/[\w/\-&?=%.#áéíóúäëïöüñÁÉÍÓÚÄËÏÖÜÑ]*)?)/gi;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
        if (part && part.match(urlRegex)) {
            const decodedPart = decodeURIComponent(part);

            const handleClick = () => {
                window.open(decodedPart, "_blank");
            };

            return (
                <span onClick={handleClick} key={index} className="text-blue-500 underline" style={{ cursor: "pointer" }}>
                    {t("common.clickHere")}
                </span>
            );
        } else {
            return part;
        }
    });
};

export const useHandleElement = (displayDatasources) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const datastore = useSelector((state) => state.datastore);
    const [elementId, setElementId] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditDatastoreModal, setShowEditDatastoreModal] = useState(false);
    const [showEditDatasourceModal, setShowEditDatasourceModal] = useState(false);
    const [showSourceListViewModal, setShowSourceListViewModal] = useState(false);
    const [isEditingElement, setIsEditingElement] = useState(false);

    const handleViewElement = (item) => {
        const isItemValid = !isEmpty(item);
        if (isItemValid) {
            let itemType = "";
            if (displayDatasources) {
                itemType = ITEM_TYPES.DATASOURCE;
                dispatch(setDatasource(item));
                if (item.type === DATASOURCE_TYPES.WORKFLOW || item.type === DATASOURCE_TYPES.SKILL) {
                    navigate(`/brain/${datastore.id}/${item.id}`);
                } else {
                    if (item.sources_count === 1) {
                        navigate(`/brain/${datastore.id}/${item.id}`);
                    }
                    setShowSourceListViewModal(true);
                }
            } else {
                itemType = ITEM_TYPES.DATASTORE;
                dispatch(setDatastore(item));
                navigate(`/brain/${item.id}`);
            }
            localStorage.setItem(itemType, JSON.stringify(item));
        }
    };

    const handleDeleteElement = (id) => {
        setElementId(id);
        setShowDeleteModal(true);
    };

    const handleEditElement = (item) => {
        const isItemValid = !isEmpty(item);
        if (isItemValid) {
            let itemType = "";
            if (displayDatasources) {
                itemType = ITEM_TYPES.DATASOURCE;
                dispatch(setDatasource(item));
                setShowEditDatasourceModal(true);
            } else {
                itemType = ITEM_TYPES.DATASTORE;
                dispatch(setDatastore(item));
                setShowEditDatastoreModal(true);
            }
            localStorage.setItem(itemType, JSON.stringify(item));
            setIsEditingElement(true);
        }
    };

    const closeDeleteModal = useCallback(() => setShowDeleteModal(false), []);
    const closeEditDatastoreModal = useCallback(() => setShowEditDatastoreModal(false), []);
    const closeEditDatasourceModal = useCallback(() => setShowEditDatasourceModal(false), []);
    const closeSourceListViewModal = useCallback(() => setShowSourceListViewModal(false), []);

    return {
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
    };
};
