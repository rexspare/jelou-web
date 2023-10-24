import Tippy from "@tippyjs/react";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { EyesIcon, PencilIcon, ShoppingCarCancel, TrashIcon } from "@apps/shared/icons";
import { styleStatusTable } from "../components/styles/table";
import { STATUS_ORDERS } from "../constants";
import { STRUCTURE_ACTIONS } from "./constants.structureCols";

/** @typedef {import('./types.structure').useEstructureColumnsProps} useEstructureColumnsProps */
/** @typedef {import('./types.structure').actionsTypes} actionsTypes */
/**
 *
 * @param {useEstructureColumnsProps} props
 * @returns estructura de columnas para la tabla
 */
export function useEstructureColumns({ setData, setShow }) {
    const { t } = useTranslation();
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    const permissions = useSelector((state) => state.permissions);
    const updateProductPermissions = permissions.some((permission) => permission === "ecommerce:update_product");
    const deleteProductPermissions = permissions.some((permission) => permission === "ecommerce:delete_product");
    const cancelOrdenPermission = permissions.some((permission) => permission === "ecommerce:cancel_order");
    const deleteCategoryPermissions = permissions.some((permission) => permission === "ecommerce:delete_category");

    // const updateSubscriptionsPermissions = permissions.some((permission) => permission === "ecommerce:update_subscription");
    // const deleteSubscriptionsPermissions = permissions.some((permission) => permission === "ecommerce:delete_subscription");

    /**
     * @param {object} rowSelected
     * @param {actionsTypes} action
     */
    const handleSelectedRow = (rowSelected, action) => () => {
        setData(rowSelected, action);
        setShow(true);
    };

    const productColumns = useMemo(
        () => [
            {
                Header: t("shop.table.name"),
                accessor: (row) => row.name ?? "-",
                Cell: ({ row: { original } }) => (
                    <span title={original.name} className="truncate">
                        {original.name}
                    </span>
                ),
            },
            {
                Header: t("shop.table.sku"),
                accessor: (row) => row.sku ?? "-",
            },
            {
                Header: t("shop.table.price"),
                accessor: (row) => row.price ?? "-",
                Cell: ({ row: { original } }) => <span>$ {original.price ?? "-"}</span>,
            },
            {
                Header: t("shop.table.hasTax"),
                accessor: (row) => row.has_tax,
                Cell: ({ row: { original } }) => <div>{original.has_tax ? t("shop.table.yes") : t("shop.table.no")}</div>,
            },
            {
                Header: t("shop.table.discount"),
                accessor: (row) => row.discount ?? "-",
                Cell: ({ row: { original } }) => {
                    return (
                        <div className="whitespace-nowrap">
                            <span>{original.discount_type === "value" && "$ "}</span>
                            <span>{original.discount ?? "-"}</span>
                            <span>{original.discount_type === "percentage" && " %"}</span>
                        </div>
                    );
                },
            },
            {
                Header: t("shop.table.stock"),
                accessor: (row) => row.stock ?? "-",
            },
            // {
            //     Header: t("shop.table.image"),
            //     // accessor: (row) => (row.media.length > 0 ? row.media[0].url : ""),
            //     Cell: ({ row: { original } }) => (
            //         <button
            //             onClick={handleSelectedRow(original, STRUCTURE_ACTIONS.SEE_IMG_PRODUCT)}
            //             className="flex items-center gap-3 truncate cursor-pointer text-primary-200">
            //             <ExitIcon />
            //             <span className="leading-loose">{t("shop.table.seeImage")}</span>
            //         </button>
            //     ),
            // },
            {
                Header: t("shop.table.category"),
                accessor: (row) => {
                    if (!row.categories) return "sin categoría";
                    const categories = row.categories.map((category) => category.name);
                    return new Intl.ListFormat(lang, { type: "conjunction" }).format(categories);
                },
                Cell: ({ row: { original } }) => {
                    const categories = original.categories.map((category) => category.name);
                    return <span className="truncate">{new Intl.ListFormat(lang, { type: "conjunction" }).format(categories)}</span>;
                },
            },
            {
                Header: t("tables.Acciones"),
                Cell: ({ row: { original } }) => {
                    return (
                        <div className="flex gap-3">
                            {updateProductPermissions && (
                                <Tippy arrow={false} theme="tomato" content={t("common.edit")} placement={"top"} touch={false}>
                                    <button onClick={handleSelectedRow(original, STRUCTURE_ACTIONS.UPDATE_PRODUCT)} className="text-gray-400 hover:text-primary-200">
                                        <PencilIcon width="1.1875rem" height="1.125rem" fill="currentColor" fillOpacity="0.75" />
                                    </button>
                                </Tippy>
                            )}
                            <Tippy arrow={false} theme="tomato" content={t("common.view")} placement={"top"} touch={false}>
                                <button onClick={handleSelectedRow(original, STRUCTURE_ACTIONS.SEE_PRODUCT)} className="text-gray-400 hover:text-primary-200">
                                    <EyesIcon className="fill-current text-gray-400 hover:text-primary-200" width="1.4375rem" height="0.9375rem" />
                                </button>
                            </Tippy>
                            {deleteProductPermissions && (
                                <Tippy arrow={false} theme="tomato" content={t("common.delete")} placement={"top"} touch={false}>
                                    <button onClick={handleSelectedRow(original, STRUCTURE_ACTIONS.DELETE_PRODUCT)} className="text-gray-400 hover:text-primary-200">
                                        <TrashIcon width="1rem" height="1.125rem" fill="currentColor" />
                                    </button>
                                </Tippy>
                            )}
                        </div>
                    );
                },
            },
        ],
        [permissions, lang, t]
    );

    const orderColumns = useMemo(
        () => [
            {
                Header: t("shop.client.names"),
                accessor: (row) => row.client?.names ?? "-",
                Cell: ({ row: { original } }) => {
                    return <p className="grid h-12 items-center">{original.client?.names ?? "-"}</p>;
                },
            },
            {
                Header: t("shop.table.numOrder"),
                accessor: (row) => row?.id ?? "-",
            },
            {
                Header: t("shop.client.email"),
                accessor: (row) => row.client?.email ?? "-",
            },
            {
                Header: t("shop.table.taxableAmount"),
                accessor: (row) => row?.formatted_subtotal ?? "-",
            },
            {
                Header: t("shop.table.tax"),
                accessor: (row) => row?.formatted_tax ?? "-",
            },
            {
                Header: t("shop.table.total"),
                accessor: (row) => row?.formatted_total ?? "-",
            },
            {
                Header: t("shop.table.Conciliación"),
                accessor: (row) => row?.formatted_conciliation ?? "-",
            },
            {
                Header: t("shop.table.cardType"),
                accessor: (row) => row?.card_type ?? "-",
                Cell: ({ row: { original } }) => <span>{original?.card_type || "-"}</span>,
            },
            {
                Header: t("shop.table.deferredTime"),
                accessor: (row) => row?.installments ?? "-",
                Cell: ({ row: { original } }) => <span>{original?.installments || "-"}</span>,
            },
            {
                Header: t("shop.table.status"),
                accessor: (row) => row?.status ?? "sin estado",
                Cell: ({ row: { original } }) => {
                    return <p className={`rounded-xl text-center font-bold ${styleStatusTable[original?.status]}`}>{t(`shop.status.${original?.status}`) || "sin estado"}</p>;
                },
            },
            {
                Header: t("shop.table.createdAt"),
                accessor: (row) => row?.created_at ?? "-",
                Cell: ({ row: { original } }) => <span>{dayjs(original?.created_at).format("DD/MM/YYYY") || "-"}</span>,
            },
            {
                Header: t("tables.Acciones"),
                Cell: ({ row: { original } }) => {
                    const disabled = original.status === STATUS_ORDERS.CANCELED;
                    return (
                        <div className="flex justify-end gap-2 pr-4">
                            <Tippy arrow={false} theme="tomato" content={t("common.view")} placement={"top"} touch={false}>
                                <button onClick={handleSelectedRow(original, STRUCTURE_ACTIONS.SEE_ORDER)} className="text-gray-400 hover:text-primary-200">
                                    <EyesIcon className="fill-current text-gray-400 hover:text-primary-200" width="1.4375rem" height="0.9375rem" />
                                </button>
                            </Tippy>
                            {cancelOrdenPermission && (
                                <Tippy arrow={false} theme="tomato" content={t("common.cancel")} placement={"top"} touch={false}>
                                    <button disabled={disabled} onClick={handleSelectedRow(original, STRUCTURE_ACTIONS.CANCEL_ORDER)} className="disabled:cursor-not-allowed">
                                        <ShoppingCarCancel
                                            fillCar={disabled ? "#A83927" : "#949DAF"}
                                            // fillContentX={disabled ? "" : null}
                                            fillX={disabled ? "#A83927" : "#E54D3B"}
                                        />
                                    </button>
                                </Tippy>
                            )}
                        </div>
                    );
                },
            },
        ],
        [permissions, lang, t]
    );

    const categoriesColumns = useMemo(
        () => [
            {
                Header: t("shop.client.names"),
                accessor: (row) => row.name,
                Cell: ({ row: { original } }) => {
                    return <p className="grid h-12 items-center">{original?.name ?? "-"}</p>;
                },
            },
            {
                Header: t("shop.table.description"),
                accessor: (row) => row.description ?? "-",
                Cell: ({ row: { original } }) => {
                    return <span className="truncate">{original?.description || "-"}</span>;
                },
            },
            {
                Header: t("shop.table.Cantidad de productos"),
                accessor: (row) => row.products_count ?? "-",
            },
            {
                Header: t("HSMTableFilter.date"),
                accessor: (row) => row.created_at ?? "-",
                Cell: ({ row: { original } }) => <span>{dayjs(original.created_at).format("DD/MM/YYYY") || "-"}</span>,
            },
            {
                Header: t("dataReport.actions"),
                Cell: ({ row: { original } }) => {
                    return (
                        <div className="flex items-center justify-start pr-4">
                            {deleteCategoryPermissions && (
                                <Tippy arrow={false} theme="tomato" content={t("common.delete")} placement={"top"} touch={false}>
                                    <button onClick={handleSelectedRow(original, STRUCTURE_ACTIONS.DELETE_CATEGORY)} className="text-gray-400 hover:text-primary-200">
                                        <TrashIcon width="1rem" height="1.125rem" fill="currentColor" />
                                    </button>
                                </Tippy>
                            )}
                        </div>
                    );
                },
            },
        ],
        [permissions, lang, t]
    );

    const subscriptionsColumns = useMemo(
        () => [
            {
                Header: t("shop.plans.table.name"),
                accessor: (row) => row.name,
                Cell: ({ row: { original } }) => {
                    return <p className="grid h-12 items-center">{original?.name ?? "-"}</p>;
                },
            },
            {
                Header: t("shop.plans.table.description"),
                accessor: (row) => row.description ?? "-",
                Cell: ({ row: { original } }) => {
                    return <span className="truncate">{original?.description || "-"}</span>;
                },
            },
            {
                Header: t("shop.plans.table.price"),
                accessor: (row) => row.price ?? "-",
            },
            {
                Header: t("shop.plans.table.currency"),
                accessor: (row) => row.currency ?? "-",
            },
            {
                Header: t("shop.plans.table.period"),
                accessor: (row) => row.invoice_period ?? "-",
            },
            {
                Header: t("shop.plans.table.interval"),
                accessor: (row) => t(`shop.plans.interval.${row.invoice_interval}`) ?? "-",
            },
            {
                Header: t("shop.plans.table.created"),
                accessor: (row) => row.created_at ?? "-",
                Cell: ({ row: { original } }) => <span>{dayjs(original.created_at).format("DD/MM/YYYY") || "-"}</span>,
            },
            {
                Header: t("dataReport.actions"),
                Cell: ({ row: { original } }) => {
                    return (
                        <div className="flex items-center justify-start pr-4">
                            {deleteCategoryPermissions && (
                                <Tippy arrow={false} theme="tomato" content={t("shop.plans.delete.tippy")} placement={"top"} touch={false}>
                                    <button onClick={handleSelectedRow(original, STRUCTURE_ACTIONS.DELETE_SUBSCRIPTION)} className="text-gray-400 hover:text-primary-200">
                                        <TrashIcon width="1rem" height="1.125rem" fill="currentColor" />
                                    </button>
                                </Tippy>
                            )}
                        </div>
                    );
                },
            },
        ],
        [permissions, lang, t]
    );

    return { productColumns, orderColumns, categoriesColumns, subscriptionsColumns };
}
