import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import Slider from "react-slick";
import get from "lodash/get";
import { useSelector } from "react-redux";

import "../styles/carouselImg.css";
import { ImageModal } from "../Modal/ModalImgaes";
import { DownIcon } from "@apps/shared/icons";
import { getMediaProducts } from "../../services/media";

export default function ImageCarousel({ closeModal, isShow, product, setShowUpdateModal }) {
    const [indexImg, setIndexImg] = useState(0);
    const [loadingImg, setLoadingImg] = useState(false);
    const [mediaList, setMediaList] = useState([]);
    const [productId, setProductId] = useState(null);

    const company = useSelector((state) => state.company);

    const handleOnClose = () => {
        closeModal(false);
        setIndexImg(0);
    };

    useEffect(() => {
        if (isShow && product.id) setProductId(product.id);
        if (isShow === false) window.setTimeout(() => setProductId(null), 500);
    }, [isShow, product.id]);

    useEffect(() => {
        const app_id = get(company, "properties.shopCredentials.jelou_ecommerce.app_id", null);
        if (!productId || !app_id) return;

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

        return () => {
            setMediaList([]);
            setIndexImg(0);
        };
    }, [productId]);

    const slideShow = mediaList.length <= 3 ? 1 : 3;

    const settings = {
        infinite: true,
        lazyLoad: true,
        speed: 300,
        slidesToShow: slideShow,
        centerMode: true,
        centerPadding: 0,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        beforeChange: (current, next) => setIndexImg(next),
    };

    return (
        <ImageModal
            className={mediaList.length === 1 ? "w-[25rem]" : mediaList.length <= 3 ? "w-[30rem]" : "w-[70rem]"}
            closeModal={handleOnClose}
            isShow={isShow}>
            <div>
                {loadingImg ? (
                    <div className="h-[25rem] w-[30rem]">
                        <Skeleton height="25rem" />
                    </div>
                ) : mediaList.length > 0 ? (
                    <Slider {...settings}>
                        {mediaList.map((img, index) => (
                            <div className={index === indexImg ? "slideShop activeSilde" : "slideShop"} key={index}>
                                <div className="flex items-center p-8 m-4 bg-white rounded-1">
                                    <img className="w-full" src={img.original_url} alt={img.name} />
                                </div>
                            </div>
                        ))}
                    </Slider>
                ) : (
                    <div className="flex h-[25rem] w-[30rem] flex-col items-center justify-center rounded-1 bg-white p-4">
                        <div
                            className="flex h-[10rem] w-[10rem] items-center justify-center rounded-[1.125rem]"
                            style={{ boxShadow: "0px 0px 10px rgba(166, 180, 208, 0.25)" }}>
                            <svg
                                viewBox="0 0 100 100"
                                style={{
                                    enableBackground: "new 0 0 100 100",
                                }}
                                xmlSpace="preserve">
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
                        <p className="mt-4 text-2xl font-bold text-gray-400">Este producto no tiene imágenes</p>
                        <button
                            onClick={() => {
                                handleOnClose();
                                setTimeout(() => {
                                    setShowUpdateModal(true);
                                }, 300);
                            }}
                            className="px-8 py-2 my-4 font-bold text-white rounded-20 bg-primary-200 text-15">
                            Agregar imagen
                        </button>
                    </div>
                )}
            </div>
        </ImageModal>
    );
}

export const NextArrow = ({ onClick, fill }) => {
    return (
        <button onClick={onClick}>
            <DownIcon className="text-3xl transform -rotate-90" width="3rem" fill={fill || "#fff"} />
        </button>
    );
};

export const PrevArrow = ({ onClick, fill }) => {
    return (
        <button onClick={onClick}>
            <DownIcon className="text-3xl transform rotate-90" width="3rem" fill={fill || "#fff"} />
        </button>
    );
};
