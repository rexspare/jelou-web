import React from "react";
import { withTranslation } from "react-i18next";

const Pagination = (props) => {
    const { t, previousPage, nextPage, actualPage, setActualPage, total, totalPages } = props;

    return (
        <div className="pagination sticky bottom-0 flex w-full items-center justify-between border-t-default !border-[#A6B4D040] bg-white pt-3">
            <div className="flex items-center text-sm sm:w-1/3">
                <button
                    onClick={() => {
                        setActualPage(actualPage - 1);
                        previousPage();
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
                        setActualPage(actualPage + 1);
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

export default withTranslation()(Pagination);
