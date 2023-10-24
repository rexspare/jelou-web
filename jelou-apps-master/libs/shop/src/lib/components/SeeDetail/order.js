/* This example requires Tailwind CSS v2.0+ */
import { SidebarRigth } from "@apps/shared/common";
import { useTranslation } from "react-i18next";
import { styleStatusTable } from "../styles/table";

export default function DetailOrder({ open, setOpen, order }) {
    const { t } = useTranslation();
    const { client = {}, details = [], error_code } = order || {};
    let quantityTotal = 0;
    details?.map((detail) => (quantityTotal += detail.quantity));

    const BREAKDOWN_PRICE = [
        {
            label: t("shop.table.taxableAmount"),
            value: order?.formatted_subtotal ?? "-",
        },
        {
            label: t("shop.table.tax"),
            value: order?.formatted_tax ?? "-",
        },
        {
            label: t("shop.table.total"),
            value: order?.formatted_total ?? "-",
        },
        {
            label: "Comisión bancaria",
            value: order?.formatted_bank_fee ?? "-",
        },
        {
            label: "Comisión transaccional",
            value: order?.formatted_transaction_fee ?? "-",
        },
        {
            label: "Comisión Jelou",
            value: order?.formatted_jelou_fee ?? "-",
        },
        {
            label: "Conciliación",
            value: order?.formatted_conciliation ?? "-",
        },
    ];

    return (
        <SidebarRigth open={open} setOpen={setOpen} title={t("shop.detailView.titleOrders")}>
            <section className="px-4 sm:px-6">
                <div className="text-opacity-75">
                    <h2 className="mb-2 text-xl font-bold capitalize">
                        {client?.names ?? ""} {client?.surname ?? ""}
                    </h2>
                    <p className="text-15 font-normal">{client?.phone ?? ""}</p>
                    <p className="my-2 text-15 font-normal">{client?.email ?? ""}</p>
                    <p className="text-15 font-normal">
                        {client?.address ?? ""}
                        <br />
                        {client?.country ?? ""}
                    </p>
                </div>

                <div>
                    <h3 className="mt-7 text-15 font-bold text-opacity-70">{t("shop.detailView.orderNO") + order?.id ?? ""}</h3>
                    <p className="text-15 font-normal">
                        {quantityTotal} {t("shop.detailView.product")}
                    </p>
                    <p className={`mt-3 mb-7 h-8 w-28 rounded-xl px-4 py-1 text-center font-bold ${styleStatusTable[order?.status]}`}>
                        {t(`shop.status.${order?.status}`)}
                    </p>

                    {error_code && (
                        <p className="mb-7">
                            <span className="text-15 font-bold text-opacity-70">Mensaje de error: </span>
                            <span>{t(`shop.ordersErrors.${error_code}`)}</span>
                        </p>
                    )}
                </div>
            </section>

            <section>
                <h3 className="w-full border-t-1 border-b-1 border-gray-100 border-opacity-25 px-4 py-4 text-base font-bold text-gray-400 text-opacity-75 sm:px-6">
                    {t("shop.detailView.summary")}
                </h3>
                <div className="w-full border-b-1 border-gray-100 border-opacity-25 py-8 pl-6 pr-4">
                    <div className="max-h-[10.5rem] space-y-6 overflow-y-scroll">
                        {details?.length > 0 &&
                            details.map((detail, i) => {
                                const { name, quantity, price } = detail;
                                return (
                                    <div key={i}>
                                        <div className="flex gap-4 pb-2 text-gray-400 text-opacity-75">
                                            <div className="grid place-content-center">
                                                <p className="whitespace-nowrap rounded-full bg-primary-200 px-2 text-white">{quantity}</p>
                                            </div>
                                            <div className="flex w-full justify-between">
                                                <p className="w-64 whitespace-normal break-all text-15 font-normal">{name}</p>
                                                <p className="mr-1 w-16 whitespace-nowrap text-right text-15 font-bold text-opacity-100">$ {price}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </section>
            <section className="flex flex-col gap-4 px-4 pt-6 sm:px-6">
                {BREAKDOWN_PRICE.map(({ label, value }) => (
                    <div className="flex justify-between text-15 font-semibold text-gray-400 text-opacity-75">
                        <span className="">{label}</span>
                        <span className="w-16 whitespace-nowrap text-right">{value}</span>
                    </div>
                ))}
            </section>
        </SidebarRigth>
    );
}
