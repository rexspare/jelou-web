import React from "react";
import { withTranslation } from "react-i18next";
// PaginationMassArchive;

const PaginationMassArchive = (props) => {
    const { t, previousPage, nextPage, actualPage, setActualPage, total, totalPages, onGetPosts } = props;

    return (
        <div className="pagination sticky bottom-0 flex w-full items-center justify-between border-t-default !border-[#A6B4D040] bg-white pt-3">
            <div className="flex items-center text-sm sm:w-1/3">
                <button
                    onClick={() => {
                        let pageMinus = actualPage - 1;
                        setActualPage(pageMinus);
                        previousPage();
                        onGetPosts(pageMinus);
                    }}
                    className="bg-inactive-200 mr-2 cursor-pointer rounded-full p-2 disabled:cursor-not-allowed disabled:opacity-25"
                    disabled={actualPage === 1}>
                    {"<"}
                </button>
                <span className="text-gray-400">
                    {actualPage} {t("pma.de")} {totalPages}
                </span>
                <button
                    onClick={() => {
                        nextPage();
                        let pagePlus = actualPage + 1;
                        setActualPage(pagePlus);
                        onGetPosts(pagePlus);
                    }}
                    className="bg-inactive-200 mr-2 cursor-pointer rounded-full p-2 disabled:cursor-not-allowed disabled:opacity-25"
                    disabled={actualPage === totalPages}>
                    {">"}
                </button>
            </div>
            <div className="mr-4 hidden sm:flex sm:justify-end">
                <p className="text-sm leading-5 text-gray-400">
                    <span className="mr-1 font-medium">{total}</span>
                    {t("pma.resultados")}
                </p>
            </div>
        </div>
    );
};

export default withTranslation()(PaginationMassArchive);
