import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import Tippy from "@tippyjs/react";

import { CloseIcon, LeftArrow, LoadingSpinner, PenIcon, SaveIcon, TrashIcon } from "@apps/shared/icons";
import { MESSAGE_TYPES, unitInMB } from "@apps/shared/constants";
import { renderMessage } from "@apps/shared/common";
import { useDataBases } from "../services/databases";
import FavoriteDatabase from "../Databases/Commponent/DatabaseCard/FavoriteDatabase";

export function useStructureList() {
    const [showDeleteDatabaseModal, setShowDeleteDatabaseModal] = useState(false);
    const [showSaveNameIcon, setShowSaveNameIcon] = useState(false);
    const [showEditDatabaseModal, setShowEditDatabaseModal] = useState({});
    const [databaseSelected, setDatabaseSelected] = useState(null);
    const [hasErrorInputName, setHasErrorInputName] = useState({});

    const [nameDatabase, setNameDatabase] = useState({});
    const [loadingNameDatabase, setLoadingNameDatabase] = useState(false);
    const [valueName, setValueName] = useState("");

    const { updateNameDatabase } = useDataBases();
    const { t } = useTranslation();

    const closeDeleteDatabaseModal = () => setShowDeleteDatabaseModal(false);
    const closeEditDatabaseModal = () => setShowEditDatabaseModal({});

    useEffect(() => {
        if (valueName.length >= 5) setShowSaveNameIcon(true);
        else setShowSaveNameIcon(false);
    }, [valueName]);

    const handleSaveName = useCallback(
        ({ databaseId, rowId = null } = {}) => {
            if (!showSaveNameIcon && valueName.length <= 4) {
                setHasErrorInputName(rowId ? { [rowId]: true } : true);
                renderMessage(t("datum.nameIsShort"), MESSAGE_TYPES.ERROR);
                window.setTimeout(() => {
                    setHasErrorInputName({});
                }, 3000);
                return;
            }

            setLoadingNameDatabase(true);

            updateNameDatabase({ databaseId, name: valueName })
                .then(({ message, databaseUpdated }) => {
                    renderMessage(message, MESSAGE_TYPES.SUCCESS);
                    setNameDatabase({ [databaseId]: databaseUpdated.name });
                })
                .catch((messageError) => {
                    setHasErrorInputName(rowId ? { [rowId]: true } : true);
                    renderMessage(String(messageError), MESSAGE_TYPES.ERROR);

                    window.setTimeout(() => {
                        setHasErrorInputName({});
                    }, 3000);
                })
                .finally(() => {
                    setLoadingNameDatabase(false);
                    closeEditDatabaseModal();
                    setValueName("");
                });
        },
        [showSaveNameIcon, valueName, updateNameDatabase]
    );

    const reportStructure = useMemo(
        () => [
            {
                Header: t("dataReport.name"),
                accessor: (row) => row.Report.name,
                Cell: ({ row: { original } }) => {
                    return <span className="font-bold">{original.Report.name}</span>;
                },
            },
            {
                Header: t("dataReport.createAt"),
                accessor: (row) => row.createdAt,
                Cell: ({ row: { original } }) => <div>{dayjs(original.createdAt).format("DD/MM/YYYY")}</div>,
            },
            {
                Header: t("dataReport.actions"),
                Cell: () => (
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold">{t("dataReport.enterReport")}</span>
                        <LeftArrow className="mt-1" width="10" height="8" />
                    </div>
                ),
            },
        ],
        []
    );

    const databasesStructure = useMemo(
        () => [
            {
                Header: t("dataReport.name"),
                accessor: (row) => row.name,
                Cell: ({ row }) => {
                    const { original } = row;

                    return (
                        <InputNameDatabase
                            databaseId={original.id}
                            rowId={row.id}
                            handleSaveName={handleSaveName}
                            isFavorite={original.isFavorite}
                            name={original.name}
                            nameDatabase={nameDatabase}
                            setValueName={setValueName}
                            showEditDatabaseModal={showEditDatabaseModal}
                            valueName={valueName}
                        />
                    );
                },
            },
            {
                Header: t("dataReport.createAt"),
                accessor: (row) => row.createdAt,
                Cell: ({ row: { original } }) => <span>{dayjs(original.createdAt).format("DD/MM/YYYY")}</span>,
            },
            {
                Header: t("datum.numberOfRecords"),
                accessor: (row) => row?.metadata?.rowsCount ?? 0,
                Cell: ({ row: { original } }) => {
                    return <span>{original?.metadata?.rowsCount ?? 0}</span>;
                },
            },
            {
                Header: t("datum.dataIncrement"),
                accessor: (row) => row?.metadata?.rowsIncrementPercentage ?? 0,
                Cell: ({ row: { original } }) => <span>{Number(original?.metadata?.rowsIncrementPercentage ?? 0).toFixed(2)}%</span>,
            },
            {
                Header: t("datum.dataWeight"),
                accessor: (row) => row?.metadata?.size ?? 0,
                Cell: ({ row: { original } }) => {
                    const { size = 0 } = original?.metadata || {};
                    return <span> {parseInt(size / unitInMB)} MB</span>;
                },
            },
            {
                Header: " ",
                Cell: ({ row }) => {
                    const { original } = row;

                    return (
                        <div className="flex items-center justify-center gap-4">
                            {showEditDatabaseModal[original.id] ? (
                                showSaveNameIcon ? (
                                    loadingNameDatabase ? (
                                        <LoadingSpinner />
                                    ) : (
                                        <Tippy arrow={false} theme="tomato" content="Guardar nombre" placement="top" touch={false}>
                                            <button
                                                onClick={(evt) => {
                                                    evt.stopPropagation();
                                                    handleSaveName({ databaseId: original.id, rowId: row.id });
                                                }}
                                                className="mt-1 cursor-pointer"
                                            >
                                                <SaveIcon fill="currentColor" />
                                            </button>
                                        </Tippy>
                                    )
                                ) : (
                                    <Tippy arrow={false} theme="tomato" content="Cancelar acción" placement="top" touch={false}>
                                        <button
                                            onClick={(evt) => {
                                                evt.stopPropagation();
                                                setShowEditDatabaseModal({});
                                            }}
                                        >
                                            <CloseIcon width="18" height="8" fill="currentColor" />
                                        </button>
                                    </Tippy>
                                )
                            ) : (
                                <Tippy arrow={false} theme="tomato" content="Cambiar nombre" placement="top" touch={false}>
                                    <button
                                        onClick={(evt) => {
                                            evt.stopPropagation();
                                            // setDatabaseSelected(original);
                                            setShowEditDatabaseModal({ [original.id]: true });
                                        }}
                                        className="cursor-pointer"
                                    >
                                        <PenIcon />
                                    </button>
                                </Tippy>
                            )}
                            <Tippy arrow={false} theme="tomato" content="Eliminar" placement="top" touch={false}>
                                <button
                                    onClick={(evt) => {
                                        evt.stopPropagation();
                                        setDatabaseSelected(original);
                                        setShowDeleteDatabaseModal(true);
                                    }}
                                    className="cursor-pointer"
                                >
                                    <TrashIcon fill="#727C94" />
                                </button>
                            </Tippy>
                            <Tippy arrow={false} theme="tomato" content={t("dataReport.enterDB")} placement="top" touch={false}>
                                <span className="text-primary-200 hover:text-primary-75">
                                    <LeftArrow fill="currentColor" width="10" height="8" />
                                </span>
                            </Tippy>
                        </div>
                    );
                },
            },
        ],
        [showEditDatabaseModal, showSaveNameIcon, valueName, hasErrorInputName, loadingNameDatabase]
    );

    return {
        closeDeleteDatabaseModal,
        closeEditDatabaseModal,
        databaseSelected,
        databasesStructure,
        hasErrorInputName,
        reportStructure,
        showDeleteDatabaseModal,
        showEditDatabaseModal,
    };
}

function InputNameDatabase({ databaseId, handleSaveName, isFavorite, name, nameDatabase, rowId, setValueName, showEditDatabaseModal, valueName }) {
    const handleNameChange = (evt) => {
        setValueName(evt.target.value);
    };

    return (
        <div className="flex items-center gap-3">
            <FavoriteDatabase databaseId={databaseId} initialFavorite={isFavorite} />
            {showEditDatabaseModal[databaseId] ? (
                <form onSubmit={(evt) => handleSaveName({ evt, databaseId, rowId })} onClick={(evt) => evt.stopPropagation()}>
                    <input
                        autoFocus
                        className="w-full border-none bg-transparent p-0 leading-3 focus:outline-none focus:ring-transparent"
                        onChange={handleNameChange}
                        placeholder={nameDatabase[databaseId] || name}
                        type="text"
                        value={valueName}
                    />
                </form>
            ) : (
                <span className="font-bold">{nameDatabase[databaseId] || name}</span>
            )}
        </div>
    );
}
