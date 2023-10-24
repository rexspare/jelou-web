import { useSelector, useDispatch } from "react-redux";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import React from "react";
import Tippy from "@tippyjs/react";

import { restartCounter } from "@apps/redux/store";
import { ModalHeadless } from "@apps/pma/ui-shared";
import { useTranslation } from "react-i18next";

export function GenerateLinkModal({ isOpen, closeModal, linkGeneratedData, sendCustomText }) {
    const { t } = useTranslation();
    const { order_details, order, url } = linkGeneratedData || {};
    const [loadingSendMessage, setLoadingSendMessage] = React.useState(false);
    const currentRoom = useSelector((state) => state.currentRoom);
    const dispatch = useDispatch();

    const handleSendMessage = () => {
        const currentRoomId = get(currentRoom, "id", "");
        const senderId = get(currentRoom, "senderId", "");

        if (isEmpty(linkGeneratedData.url) || isEmpty(currentRoomId) || isEmpty(senderId)) {
            console.error("Missing data", { linkGeneratedData, currentRoomId, senderId });
            return;
        }

        setLoadingSendMessage(true);

        let message = {
            type: "TEXT",
            text: linkGeneratedData.url,
        };

        sendCustomText(message);
        dispatch(restartCounter());
        closeModal();
        setLoadingSendMessage(false);
    };

    return (
        <ModalHeadless closeModal={closeModal} isOpen={isOpen} title={t("pma.Envía tu pedido")} className="pb-4" classTitle="pl-6 pb-2">
            <section className="border-b-0.5 border-gray-100 border-opacity-25">
                <div className="mx-6 mb-4 flex h-9 items-center justify-between rounded-10 bg-gray-10 px-6 text-gray-400">
                    {linkGeneratedData === null ? (
                        <div className="flex w-full justify-end">
                            <svg className="h-5 w-5 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-75" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    ) : (
                        <>
                            <input
                                className="w-52 truncate bg-gray-10 text-13 font-normal text-gray-400"
                                readOnly
                                value={linkGeneratedData?.url ?? ""}
                            />
                            <Tippy content="copiar" placement="top">
                                <button onClick={() => navigator.clipboard.writeText(url)}>
                                    <svg width={13} height={17} fill="none">
                                        <path
                                            d="M4.445.092c.374-.062.767-.04 1.162-.049a99.236 99.236 0 0 1 2.93-.017c.949.005 1.962-.09 2.901.054.911.139 1.56.9 1.561 1.9.002 2.745 0 5.49 0 8.236 0 .846-.006 1.692-.002 2.538.005.949-.447 1.89-1.395 2.048-.397.066-.808.034-1.212.045-.09.003-.181 0-.287 0v.184c-.01 1.118-.76 1.92-1.803 1.92-2.142.002-4.32.12-6.457-.018-.283-.018-.57-.048-.835-.156-.642-.26-1.005-1.035-1.005-1.741C0 12.852 0 10.668.002 8.483c0-1.502-.006-3.003.004-4.505.006-.888.594-1.645 1.412-1.78.417-.068.849-.032 1.274-.042.064-.002.129 0 .207 0 0-.107-.002-.189 0-.27.021-.587.287-1.13.738-1.465a1.8 1.8 0 0 1 .808-.33ZM1.116 9.545v5.448c0 .475.243.753.675.754 2.175.003 4.35.002 6.525 0 .324 0 .558-.173.634-.466a1.37 1.37 0 0 0 .036-.342V4.16c0-.554-.237-.809-.75-.809H1.878c-.527 0-.763.252-.763.813v5.381Zm8.987 4.107h1.038c.503 0 .745-.26.745-.8V2.057c0-.553-.235-.802-.755-.802H7.946c-1.078 0-2.155-.002-3.232 0-.436.001-.682.262-.702.712-.007.156.041.192.18.192 1.36-.006 2.72-.008 4.079 0 .217.002.444.029.649.1.74.26 1.183.959 1.183 1.832v9.561Z"
                                            fill="#A6B4D0"
                                        />
                                    </svg>
                                </button>
                            </Tippy>
                        </>
                    )}
                </div>
            </section>
            <section className="border-b-0.5 border-gray-100 border-opacity-25">
                <h3 className="mx-6 mt-4 text-base font-bold text-gray-400 text-opacity-75">Resumen</h3>
                <div className="flex w-full flex-col gap-1 border-b-1 border-gray-100 border-opacity-25 px-6 py-8">
                    {order_details?.length > 0 &&
                        order_details.map((detail) => {
                            const { id, name, price, quantity } = detail;
                            return (
                                <div key={id} className="space-y-6">
                                    <div className="flex gap-7 text-gray-400 text-opacity-75">
                                        <p className="flex h-[1.15rem] w-5 items-center justify-center rounded-full bg-primary-200 text-13 font-bold text-white">
                                            {quantity}
                                        </p>
                                        <div className="flex w-full justify-between">
                                            <p className="w-40 text-15 font-normal">{name}</p>
                                            <p className="w-16 text-right text-15 font-bold text-opacity-100">$ {price}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </section>
            <section className="flex flex-col gap-4 border-b-0.5 border-gray-100 border-opacity-25 px-4 py-6 sm:px-6">
                <div className="flex justify-between text-15 font-semibold text-gray-400 text-opacity-75">
                    <span className="w-8">Subtotal</span>
                    <span className="text-right">$ {order?.subtotal ? Number(order?.subtotal).toFixed(2) : 0}</span>
                </div>
                <div className="flex justify-between text-15 font-semibold text-gray-400 text-opacity-75">
                    <span className="w-8">Impuestos</span>
                    <span className="text-right ">$ {order?.tax ? Number(order?.tax).toFixed(2) : 0}</span>
                </div>
                <div className="flex justify-between text-15 font-bold text-gray-400 text-opacity-100">
                    <span className="block w-8">Total</span>
                    <span className="block text-right">$ {order?.total ? Number(order?.total).toFixed(2) : 0}</span>
                </div>
            </section>
            <footer className="mt-6 flex justify-center px-6">
                <button
                    disabled={loadingSendMessage}
                    onClick={handleSendMessage}
                    className="w-full rounded-11 bg-primary-200 py-3 text-15 font-bold text-white">
                    {loadingSendMessage ? (
                        <div className="flex w-full justify-center">
                            <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    ) : (
                        "Enviar Carrito personalizado"
                    )}
                </button>
            </footer>
        </ModalHeadless>
    );
}
