import ReactDOM from "react-dom";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeftIcon, ChevronRightIcon, OpenBook, StarsIcon } from "@apps/shared/icons";

import { CloseIcon } from "@apps/shared/icons";
import { useOnClickOutside } from "@apps/shared/hooks";
import Tippy, { tippy } from "@tippyjs/react";

const RelatedArticlesModal = React.forwardRef((props, ref) => {
    const { onClose, articleData, articles, setArticle, page, setPage } = props;
    const { t } = useTranslation();
    const [total, setTotal] = useState();
    const { title, description } = articleData;

    const textRef = useRef(null);

    const copyToClipboard = () => {
        if (textRef.current) {
            const range = document.createRange();
            range.selectNode(textRef.current);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            document.execCommand("copy");
            window.getSelection().removeAllRanges();
        }
    };

    console.log("articles", articleData);
    const handleNext = () => {
        if (page < total) {
            const newPage = page + 1;
            setPage(newPage);
            setArticle(articles[newPage - 1]);
        }
    };

    const handlePrev = () => {
        if (page > 1) {
            const newPage = page - 1;
            setPage(newPage);
            setArticle(articles[newPage - 1]);
        }
    };

    useEffect(() => {
        setTotal(articles.length);
    }, [articles]);

    useOnClickOutside(ref, onClose);

    const handler = (e) => {
        if (e.keyCode === 27) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener("keyup", handler);
        return () => {
            document.removeEventListener("keyup", handler);
        };
    }, []);

    return ReactDOM.createPortal(
        <div className="fixed inset-x-0 top-0 z-[130] overflow-auto px-4 pt-8 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-0">
            <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 z-20 bg-gray-490/75" />
            </div>
            <div
                className={` flex h-[34rem] max-h-content-mobile w-88 transform flex-col  rounded-xl bg-white shadow-modal transition-all sm:max-h-content sm:min-w-350 `}>
                <header className="mb-5 flex h-[4rem] items-center justify-between rounded-t-xl bg-primary-600 px-8">
                    <div className="flex items-center gap-3">
                        <OpenBook width={"1.2rem"} />
                        <div className="max-w-56 md:max-w-128 truncate pr-3 text-base font-semibold  text-primary-200 md:text-xl">
                            {t("Artículos relacionados")}
                        </div>
                    </div>
                    <span onClick={() => onClose()}>
                        <CloseIcon className="cursor-pointer fill-current text-primary-200" width="1rem" height="1rem" />
                    </span>
                </header>
                <div className="flex w-full flex-1 flex-col justify-between gap-4  px-8 ">
                    <div className="flex h-[23rem] flex-col">
                        <h3 className="pb-2 font-semibold text-primary-200">{title}</h3>
                        <div ref={textRef} className="flex flex-1 overflow-y-auto text-gray-610">
                            {description}
                        </div>
                    </div>

                    <footer className="flex justify-between pt-4 pb-6">
                        <div className="flex items-center gap-3">
                            <button onClick={() => handlePrev()}>
                                <ChevronLeftIcon className=" w-4 text-gray-400 hover:text-primary-200" />
                            </button>
                            <span className="text-gray-400">
                                {page} / {total}
                            </span>
                            <button onClick={() => handleNext()}>
                                <ChevronRightIcon className="w-4 text-gray-400 hover:text-primary-200" width={"1.2rem"} />
                            </button>
                        </div>
                        <div className="flex gap-3">
                            <Tippy
                                theme="jelou"
                                content={t("Copiado")}
                                placement="top"
                                hideOnClick={false}
                                onShow={(instance) => {
                                    setTimeout(() => {
                                        instance.hide();
                                    }, 2000);
                                }}
                                trigger="click"
                                arrow={false}>
                                <button
                                    onClick={() => copyToClipboard()}
                                    className="rounded-xl border-default border-primary-200 py-2 px-3 text-sm font-semibold text-primary-200 hover:bg-primary-600">
                                    Copiar texto
                                </button>
                            </Tippy>
                            <button className="flex rounded-xl border-default bg-primary-200  py-2 px-3 text-sm font-semibold text-white">
                                <StarsIcon className="mr-2 w-4" />
                                <span>Generar respuesta</span>
                            </button>
                        </div>
                    </footer>
                </div>
            </div>
        </div>,
        document.getElementById("root")
    );
});

export default RelatedArticlesModal;
