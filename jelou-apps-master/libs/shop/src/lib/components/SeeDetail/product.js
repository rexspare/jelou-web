import get from "lodash/get";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import { useSelector } from "react-redux";
import Slider from "react-slick";

import { SidebarRigth } from "@apps/shared/common";
import { getMediaProducts } from "../../services/media";
import { NextArrow, PrevArrow } from "../Actions/ImagesCarousel";
import "../styles/carouselImg.css";

export default function DetailProduct({ open, setOpen, product }) {
    const { t } = useTranslation();
    const [mediaList, setMediaList] = React.useState([]);
    const [loadingImg, setLoadingImg] = React.useState(false);
    const [productId, setProductId] = React.useState(null);
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    const company = useSelector((state) => state.company);
    const app_id = get(company, "properties.shopCredentials.jelou_ecommerce.app_id", null);

    useEffect(() => {
        if (open && product.id) setProductId(product.id);
        if (open === false)
            window.setTimeout(() => {
                setMediaList([]);
                setProductId(null);
            }, 500);
    }, [open, product.id]);

    useEffect(() => {
        if (productId && app_id) {
            setLoadingImg(true);
            getMediaProducts({ productId, app_id })
                .then((imgList) => {
                    setMediaList(imgList);
                    setLoadingImg(false);
                })
                .catch((err) => {
                    setLoadingImg(false);
                    console.error(err);
                });
        }
    }, [productId, app_id]);

    const getCategoriesList = (categoriesArray) => {
        return categoriesArray.map((category) => category.name);
    };

    const settings = {
        infinite: true,
        lazyLoad: true,
        speed: 300,
        slidesToShow: 1,
        centerMode: true,
        centerPadding: 0,
        nextArrow: <NextArrow fill={"rgba(114, 124, 148, 0.5)"} />,
        prevArrow: <PrevArrow fill={"rgba(114, 124, 148, 0.5)"} />,
    };

    const getPriceTax = () => {
        if (!product?.has_tax || !product?.price) return "";
        return product.price * 0.12;
    };

    const getDicount = () => {
        if (!product?.discount || !product?.discount_type) return 0;
        if (product.discount_type === "percentage") {
            return (product.price * product.discount) / 100;
        }
        return product.discount;
    };

    const subtotal = () => product?.discount_value || product?.price;

    return (
        <SidebarRigth open={open} setOpen={setOpen} title={t("shop.detailView.titleProduct")}>
            <section className=" text-gray-375">
                <div className="mb-2 grid w-full place-content-center">
                    {loadingImg ? (
                        <div className="h-[20rem] w-[25rem]">
                            <Skeleton height="20rem" />
                        </div>
                    ) : mediaList.length > 0 ? (
                        <div className="w-[25rem]">
                            <Slider {...settings}>
                                {mediaList.map((img) => (
                                    <div className="slideActive" key={img.name}>
                                        <div className="flex h-[20rem] items-center justify-center">
                                            <img className="h-full rounded-12 object-cover" src={img.original_url} alt={img.name} />
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    ) : (
                        <div className="flex h-[20rem] w-[25rem] items-center justify-center">
                            <div className="flex h-[10rem] w-[10rem] items-center justify-center rounded-[1.125rem]" style={{ boxShadow: "0px 0px 10px rgba(166, 180, 208, 0.25)" }}>
                                <svg
                                    viewBox="0 0 100 100"
                                    style={{
                                        enableBackground: "new 0 0 100 100",
                                    }}
                                    xmlSpace="preserve"
                                >
                                    <path
                                        d="m89.96 15.15-50.5-7.44a4.791 4.791 0 0 0-5.43 4.03l-8.68 58.94a4.791 4.791 0 0 0 4.03 5.43l50.5 7.44c2.61.38 5.04-1.42 5.43-4.03L94 20.57a4.783 4.783 0 0 0-4.04-5.42zM78.43 64.64a2.275 2.275 0 0 1-2.59 1.92l-37.68-5.55a2.275 2.275 0 0 1-1.92-2.59l5.68-38.56a2.275 2.275 0 0 1 2.59-1.92l37.68 5.55c1.24.18 2.11 1.34 1.92 2.59l-5.68 38.56z"
                                        style={{
                                            fill: "#afafaf",
                                        }}
                                    />
                                    <path
                                        d="m40.32 54.83.85-5.77c.13-.89.6-1.69 1.31-2.25l8.81-6.89a2.39 2.39 0 0 1 3.53.67l4.13 7.08 18.13-10.85c1.08-.64 2.42.25 2.23 1.49l-3.2 21.74a2.15 2.15 0 0 1-2.48 1.82c-6.42-1.04-25.32-4.09-31.58-4.8a1.965 1.965 0 0 1-1.73-2.24z"
                                        style={{
                                            fill: "#bababa",
                                        }}
                                    />
                                    <path
                                        d="M26.63 38.61 8.97 43.75c-2.2.64-3.48 2.94-2.87 5.15l11.26 40.37c.64 2.3 3.08 3.6 5.35 2.86l28.47-9.35-23.75-3.15a5.591 5.591 0 0 1-4.82-6.18l4.02-34.84z"
                                        style={{
                                            fill: "#e2e2e2",
                                        }}
                                    />
                                </svg>
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-4 sm:px-6">
                    <div className="text-opacity-75">
                        {product?.discount && (
                            <p className="flex items-center gap-2 text-15 font-normal">
                                <span>
                                    <svg width={17} height={17} fill="none">
                                        <path
                                            d="M16.573 8.899c-.158.749-.708 1.207-1.247 1.676-.162.14-.31.297-.463.448-.21.209-.297.472-.296.762.004.394.03.785.032 1.18 0 .257 0 .519-.047.771-.143.776-.68 1.23-1.506 1.271-.348.017-.699-.019-1.049-.019-.307 0-.614.01-.917.034a.541.541 0 0 0-.29.125c-.217.184-.42.384-.623.583-.29.288-.55.612-.867.868-.66.535-1.395.526-2.05-.02-.305-.255-.56-.565-.838-.85-.143-.146-.284-.293-.428-.438-.216-.22-.49-.311-.789-.31-.49.006-.979.03-1.468.033a2.326 2.326 0 0 1-.498-.051c-.76-.162-1.2-.685-1.24-1.5-.017-.35.018-.7.018-1.05 0-.307-.01-.612-.034-.917a.54.54 0 0 0-.122-.29 10.72 10.72 0 0 0-.584-.623c-.288-.29-.612-.55-.868-.864-.53-.654-.533-1.37-.002-2.025.256-.316.577-.578.868-.864l.462-.452c.207-.205.29-.465.288-.747-.002-.394-.03-.786-.032-1.18 0-.263 0-.53.049-.788.147-.776.7-1.23 1.533-1.262.342-.013.689.02 1.033.02.296 0 .592-.007.885-.033a.605.605 0 0 0 .32-.132c.213-.179.415-.375.61-.574.227-.23.436-.479.664-.706a2.035 2.035 0 0 1 1.02-.552h.388c.388.083.729.263 1.011.54.234.23.445.484.676.718.2.201.407.399.624.583a.54.54 0 0 0 .29.123c.31.024.621.032.934.034.339 0 .68-.034 1.017-.017.832.041 1.372.488 1.52 1.258.048.256.048.525.048.787 0 .388-.03.774-.034 1.162-.004.301.087.572.307.789.149.147.296.297.454.437.537.468 1.088.924 1.245 1.676-.004.126-.004.256-.004.386ZM3.933 3.413c-.14.013-.34.023-.536.055-.19.03-.307.152-.345.34-.02.106-.041.213-.037.32.01.366.026.733.045 1.099.038.777-.141 1.476-.725 2.03-.12.114-.247.225-.37.338-.206.189-.423.368-.617.57-.403.413-.405.675.004 1.088.25.252.531.472.789.717.373.356.72.73.836 1.258.094.425.092.853.064 1.286-.022.358-.007.72.015 1.079.013.198.153.322.349.352.175.027.354.042.529.04.457-.006.915-.036 1.372-.036.402.002.786.104 1.098.365.275.23.531.484.787.738.187.187.349.398.539.58.437.426.693.428 1.124-.002.245-.242.458-.516.693-.766.358-.377.736-.729 1.27-.845a4.396 4.396 0 0 1 1.285-.063c.3.025.605.03.904.016.383-.021.524-.178.554-.56.01-.124.013-.248.01-.37-.012-.285-.04-.571-.046-.856-.011-.487.006-.973.256-1.412.217-.378.514-.687.848-.968a7 7 0 0 0 .73-.706c.253-.284.253-.505-.002-.79a8.92 8.92 0 0 0-.743-.718c-.477-.424-.929-.865-1.029-1.533a5.864 5.864 0 0 1-.058-.851c0-.377.042-.753.038-1.13-.006-.47-.17-.637-.639-.642-.382-.006-.764.03-1.146.04-.5.01-.995-.008-1.441-.27-.37-.217-.674-.512-.953-.84a6.993 6.993 0 0 0-.706-.73c-.277-.245-.503-.243-.78.003a5.937 5.937 0 0 0-.715.744c-.625.79-1.416 1.186-2.435 1.092-.252-.028-.505-.04-.815-.062Z"
                                            fill="#707C95"
                                            fillOpacity={0.7}
                                        />
                                        <path
                                            d="M11.433 6.151c-.071.12-.124.26-.22.358-.392.409-.796.804-1.197 1.203l-3.912 3.91c-.32.32-.8.195-.892-.245-.025-.117.036-.255.07-.38.01-.042.06-.074.094-.11 1.702-1.704 3.406-3.406 5.11-5.109.309-.309.774-.19.89.222.012.042.018.085.025.127a.36.36 0 0 0 .032.024ZM6.23 8.187a1.556 1.556 0 0 1-1.563-1.542 1.556 1.556 0 0 1 1.542-1.563 1.556 1.556 0 0 1 1.563 1.525c.01.868-.68 1.572-1.542 1.58Zm-.006-2.07a.52.52 0 0 0-.521.509c-.006.28.226.52.504.525.29.006.53-.228.53-.518 0-.28-.23-.514-.513-.515ZM10.364 12.326a1.554 1.554 0 0 1-.002-3.105 1.555 1.555 0 0 1 1.554 1.566 1.555 1.555 0 0 1-1.552 1.539Zm-.008-2.068a.52.52 0 0 0-.51.52.52.52 0 0 0 .531.514.523.523 0 0 0 .503-.527.52.52 0 0 0-.524-.507Z"
                                            fill="#707C95"
                                            fillOpacity={0.7}
                                        />
                                    </svg>
                                </span>
                                <span>
                                    {product.discount_type === "value" && "$"}
                                    {product?.discount ?? ""}
                                    {product.discount_type === "percentage" && "%"}
                                </span>
                            </p>
                        )}

                        {product?.price && (
                            <div className="">
                                <span className="mr-1 text-3xl font-bold text-primary-200"> $ {Number(subtotal() + getPriceTax()).toFixed(2)}</span>
                                <span className="text-15 font-normal text-gray-400 line-through">$ {Number(getPriceTax() + product.price).toFixed(2)}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-4 sm:px-6">
                    {product?.sku && (
                        <p className="text-15 font-normal text-opacity-70">
                            <span>{t("shop.detailView.sku")}</span> {product.sku}
                        </p>
                    )}

                    <h2 className="text-2xl font-bold text-opacity-70">{product?.name}</h2>
                    {product?.description && <p className="text-15 font-normal text-opacity-70">{product.description}</p>}
                    {product.categories?.length > 0 && (
                        <p className="text-15 font-bold text-opacity-70">{new Intl.ListFormat(lang, { type: "conjunction" }).format(getCategoriesList(product.categories))}</p>
                    )}
                    {product?.stock && (
                        <p className="text-15 font-normal text-opacity-75">
                            {product?.stock} <span className="text-13">Stock</span>
                        </p>
                    )}
                </div>

                <p className="my-4 w-full border-b-1 border-gray-100 border-opacity-25"></p>

                <aside className="space-y-2 px-4 text-15 font-bold text-gray-400 sm:px-6">
                    <h3 className="mb-2">{t("shop.detailPrice")}</h3>

                    <div className="flex justify-between">
                        <p>{t("shop.netPrice")}</p>
                        <p>$ {product?.price}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-opacity-70">{t("shop.table.discount")}</p>
                        <p className="text-opacity-70">$ {Number(getDicount()).toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-opacity-70">{t("shop.table.taxableAmount")}</p>
                        <p className="text-opacity-70">$ {Number(subtotal()).toFixed(2)}</p>
                    </div>
                    <p className="my-4 w-full border-b-1 border-gray-100 border-opacity-25"></p>
                    <div className="flex justify-between">
                        <p className="text-opacity-70">{t("shop.taxes")} 12%</p>
                        <p className="text-opacity-70">$ {Number(getPriceTax()).toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between text-primary-200">
                        <p>TOTAL</p>
                        <p>$ {Number(subtotal() + getPriceTax()).toFixed(2)}</p>
                    </div>
                </aside>
            </section>
        </SidebarRigth>
    );
}
