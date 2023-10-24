import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Tippy from "@tippyjs/react";

import { DataPic, EyesIcon, PencilIcon, TrashIcon } from "@apps/shared/icons";
import { RENDER_TYPE_COLUMN, TYPES_COLUMN } from "../../constants";
import Table from "../../Reports/Table/Components/Table";

import DeleteDataModal from "../Commponent/Modals/DeleteData";
import SeeData from "../Commponent/Modals/SeeData";
import UpdateModal from "../Commponent/Modals/UpdateData";

export function TablaDB({ loading, currentPage, setPage, setLimit, paginationData, rowOfTable, oneDataBase }) {
    const { t } = useTranslation();
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [openSeeModal, setSeeModal] = useState(false);
    const [rowSeletec, setRowSeletec] = useState(null);

    const permissions = useSelector((state) => state.permissions);
    const databasePermissionUpdate = permissions.find((permission) => permission === "datum:update_rows");
    const databasePermissionDelete = permissions.find((permission) => permission === "datum:delete_rows");

    const handleShowDeleteDataModal = (row) => {
        setRowSeletec(row);
        setOpenDeleteModal(true);
    };

    const handleOpenUpdateModal = (row) => {
        setRowSeletec(row);
        setOpenUpdateModal(true);
    };

    const hendleOpenSeeModal = (row) => {
        setRowSeletec(row);
        setSeeModal(true);
    };

    const getColumns = useCallback(() => {
        if (!oneDataBase) return [];
        const columns = oneDataBase.columns.map((column) => ({
            Header: column.name,
            accessor: column.key,
            Cell: ({ row: { original } }) => {
                if (!original[column.key] && typeof original[column.key] !== TYPES_COLUMN.boolean) return <span> - </span>;

                const render = RENDER_TYPE_COLUMN[column.type];
                return render ? render(original[column.key]) : <span>{original[column.key]}</span>;
            },
        }));

        return [
            ...columns,
            {
                Header: t("AdminFilters.actions"),
                Cell: ({ row: { original } }) => {
                    return (
                        <div className="flex items-center space-x-3">
                            {databasePermissionUpdate && (
                                <Tippy arrow={false} theme="tomato" content={t("plugins.Editar")} placement="top" touch={false}>
                                    <button onClick={() => handleOpenUpdateModal(original)}>
                                        <PencilIcon
                                            className="fill-current text-gray-375 hover:text-primary-200"
                                            width="1.1875rem"
                                            height="1.125rem"
                                            fillOpacity="0.75"
                                        />
                                    </button>
                                </Tippy>
                            )}
                            <Tippy arrow={false} theme="tomato" content={t("datum.see")} placement="top" touch={false}>
                                <button onClick={() => hendleOpenSeeModal(original)} className="text-gray-375 hover:text-primary-200">
                                    <EyesIcon className="fill-current text-gray-375 hover:text-primary-200" width="1.4375rem" height="0.9375rem" />
                                </button>
                            </Tippy>
                            {databasePermissionDelete && (
                                <Tippy arrow={false} theme="tomato" content={t("dataReport.delete")} placement="top" touch={false}>
                                    <button onClick={() => handleShowDeleteDataModal(original)}>
                                        <TrashIcon
                                            className="fill-current text-gray-375 hover:text-primary-200"
                                            width="1rem"
                                            height="1.125rem"
                                            fillOpacity="0.75"
                                        />
                                    </button>
                                </Tippy>
                            )}
                        </div>
                    );
                },
            },
        ];
    }, [oneDataBase]);

    const columnsData = useMemo(() => getColumns(), []);

    if (rowOfTable.length === 0 && loading === false) {
        return (
            <section className="grid h-table place-content-center gap-6 rounded-b-20 bg-white">
                <DataPic width="30rem" />
                <div className="grid gap-3">
                    <p className="text-center text-2xl font-semibold text-gray-500">{t("datum.You have not created records yet")}</p>
                </div>
            </section>
        );
    }

    return (
        <>
            {openDeleteModal && (
                <DeleteDataModal
                    closeModal={() => setOpenDeleteModal(false)}
                    databaseId={oneDataBase.id}
                    isShow={openDeleteModal}
                    rowToDelete={rowSeletec}
                />
            )}

            {openUpdateModal && (
                <UpdateModal
                    closeModal={() => setOpenUpdateModal(false)}
                    oneDataBase={oneDataBase}
                    isShow={openUpdateModal}
                    rowSeletec={rowSeletec}
                />
            )}

            {openSeeModal && (
                <SeeData oneDataBase={oneDataBase} rowSeletec={rowSeletec} closeModal={() => setSeeModal(false)} isShow={openSeeModal} />
            )}

            <Table
                columns={columnsData}
                data={rowOfTable}
                database
                loading={loading}
                paginationData={paginationData}
                setLimit={setLimit}
                setPage={setPage}
                currentPage={currentPage}
            />
        </>
    );
}
