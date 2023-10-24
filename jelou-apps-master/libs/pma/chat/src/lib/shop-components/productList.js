import React, { useCallback, useEffect } from "react";
import throttle from "lodash/throttle";

import { plusCounter, restCounter, showCounter } from "@apps/redux/store";
import { useNearScreen } from "@apps/shared/hooks";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

export function ProductList({ loadintProducts, productList, setPage }) {
    const { t } = useTranslation();

    const { elementOfObserver, isNearScreen } = useNearScreen({ once: false });

    const nextPage = useCallback(
        throttle(() => setPage((preStatePage) => preStatePage + 1), 1000),
        []
    );

    useEffect(() => {
        if (isNearScreen) nextPage();
    }, [isNearScreen]);

    const counterProductList = useSelector((state) => state.shoppingCartCounter);
    const dispatch = useDispatch();

    const handleShowCounter = (productId) => {
        dispatch(showCounter(productId));
    };

    const handleRestCounter = (productId) => {
        dispatch(restCounter(productId));
    };

    const handlePlusCounter = (productId) => {
        dispatch(plusCounter(productId));
    };

    return (
        <section className="h-full min-h-full overflow-y-scroll pb-[20rem]">
            {loadintProducts ? (
                <div className="h-[200%]">
                    <div className="my-8 flex h-8 w-full items-center justify-center">
                        <svg className="h-5 w-5 animate-spin text-primary-200" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                </div>
            ) : productList.length > 0 ? (
                productList.map((product) => {
                    const productForCount = counterProductList.find((item) => item.id === product.id);
                    return (
                        <article
                            key={product.id}
                            className="grid h-26 items-center gap-4 border-t-2 border-gray-100 border-opacity-25 pl-3"
                            style={{ gridTemplateColumns: "4rem 1fr" }}>
                            {product?.media.length > 0 ? (
                                <div className="w-16 rounded-12 shadow-normal">
                                    <img
                                        className="aspect-[1/1] rounded-12 object-contain"
                                        src={product?.media[0]?.original_url}
                                        alt={product.name}
                                    />
                                </div>
                            ) : (
                                <div className="grid place-content-center">
                                    <svg width={50} height={71} fill="none">
                                        <path
                                            d="M35.449.615H2.654A2.658 2.658 0 0 0 0 3.27v64.67a2.658 2.658 0 0 0 2.654 2.655H47.33a2.658 2.658 0 0 0 2.653-2.654V15.06L35.45.615Z"
                                            fill="#727C94"
                                            fillOpacity={0.1}
                                        />
                                        <path
                                            opacity={0.17}
                                            d="M36.369 12.753a2.966 2.966 0 0 0 2.97 2.97h10.645v-.679L36.37 1.294v11.459Z"
                                            fill="#333"
                                        />
                                        <path d="M35.45 12.074a2.967 2.967 0 0 0 2.97 2.97H50L35.45.599v11.475Z" fill="#727C94" fillOpacity={0.6} />
                                        <path
                                            d="M17.263 33.567v-1.2h1.36v1.2h-1.36Zm0 6.15v-5.4h1.36v5.4h-1.36Zm9.359 0v-3.19c0-.356-.085-.633-.255-.83-.167-.2-.399-.3-.695-.3a.895.895 0 0 0-.825.505 1.225 1.225 0 0 0-.115.545l-.57-.38c0-.37.087-.696.26-.98.177-.283.412-.503.705-.66.297-.16.625-.24.985-.24.617 0 1.082.184 1.395.55.316.364.475.84.475 1.43v3.55h-1.36Zm-6.51 0v-5.4h1.2v1.79h.17v3.61h-1.37Zm3.26 0v-3.19c0-.356-.085-.633-.255-.83-.167-.2-.399-.3-.695-.3a.869.869 0 0 0-.685.295c-.17.194-.255.445-.255.755l-.57-.4c0-.353.088-.67.265-.95.177-.28.413-.501.71-.665.3-.163.635-.245 1.005-.245.423 0 .77.09 1.04.27.273.18.475.42.605.72s.195.63.195.99v3.55h-1.36Zm8.22 2.55c-.307 0-.598-.05-.875-.15a2.49 2.49 0 0 1-.745-.41 2.2 2.2 0 0 1-.53-.61l1.26-.61c.087.16.21.282.37.365.163.084.34.125.53.125.203 0 .395-.035.575-.105a.948.948 0 0 0 .43-.305.72.72 0 0 0 .155-.5v-1.57h.17v-4.18h1.19v5.77a3.315 3.315 0 0 1-.08.73c-.087.33-.248.602-.485.815a2.2 2.2 0 0 1-.86.475c-.34.107-.708.16-1.105.16Zm-.12-2.4c-.497 0-.932-.125-1.305-.375a2.541 2.541 0 0 1-.875-1.02 3.316 3.316 0 0 1-.31-1.455c0-.55.105-1.038.315-1.465a2.5 2.5 0 0 1 .895-1.015c.383-.246.833-.37 1.35-.37.513 0 .945.125 1.295.375s.615.59.795 1.02c.18.43.27.915.27 1.455s-.092 1.025-.275 1.455c-.18.43-.45.77-.81 1.02-.36.25-.808.375-1.345.375Zm.22-1.21c.303 0 .545-.068.725-.205.183-.136.315-.328.395-.575.08-.246.12-.533.12-.86 0-.326-.04-.613-.12-.86a1.153 1.153 0 0 0-.385-.575c-.173-.136-.402-.205-.685-.205-.303 0-.553.075-.75.225a1.295 1.295 0 0 0-.43.595c-.093.247-.14.52-.14.82 0 .304.045.58.135.83.09.247.228.444.415.59.187.147.427.22.72.22Z"
                                            fill="#727C94"
                                            fillOpacity={0.59}
                                        />
                                    </svg>
                                </div>
                            )}
                            <div>
                                <h3 className="w-44 truncate text-15 font-bold text-gray-400">{product.name}</h3>
                                <p className="text-xl font-semibold text-primary-200">$ {product.price}</p>

                                <div className="flex w-full justify-end pr-4">
                                    {productForCount?.show ? (
                                        <div className="flex h-6 items-center gap-3 rounded-30 px-2 shadow-box">
                                            <button className="text-gray-400/65" onClick={() => handleRestCounter(product.id)}>
                                                -
                                            </button>
                                            <span className="text-gray-400"> {productForCount?.qty}</span>
                                            <button className="text-gray-400/65" onClick={() => handlePlusCounter(product.id)}>
                                                +
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleShowCounter(product.id)}
                                            className="h-6 w-6 rounded-full bg-primary-200 text-sm  font-bold text-white">
                                            +
                                        </button>
                                    )}
                                </div>
                            </div>
                        </article>
                    );
                })
            ) : (
                <p className="w-full text-center font-bold text-gray-400">{t("pma.No tiene productos")}</p>
            )}
            <div ref={elementOfObserver}></div>
        </section>
    );
}
