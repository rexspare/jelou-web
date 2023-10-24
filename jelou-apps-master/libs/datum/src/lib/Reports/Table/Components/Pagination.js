import { useTranslation } from "react-i18next";

export function Pagination({ paginationData = {}, currentPage: pageLimit, setCurrentPage, setPerPage }) {
    const { limit = 0, total: totalResults = 0, totalPages: maxPage = 0 } = paginationData;
    const { t } = useTranslation();

    return (
        <div className="sticky bottom-0 flex items-center justify-between w-full px-4 py-3 bg-white border-gray-400 border-opacity-25 rounded-b-xl border-t-1 sm:px-6">
            <div className="flex items-center sm:w-1/3">
                <button
                    disabled={pageLimit === 1}
                    className="p-2 mr-2 cursor-pointer disabled:cursor-not-allowed"
                    onClick={() => setCurrentPage(pageLimit - 1)}>
                    <div className="w-6 h-6 text-gray-375">{"<"}</div>
                </button>
                <div className="relative text-xs text-gray-375">
                    {" "}
                    {pageLimit} {t("monitoring.of")} {maxPage}
                </div>
                <button disabled={pageLimit === maxPage} className="p-2 disabled:cursor-not-allowed" onClick={() => setCurrentPage(pageLimit + 1)}>
                    <div className="w-6 h-6 text-gray-375"> {">"}</div>
                </button>
            </div>
            <div className="flex justify-center space-x-1 text-gray-400 text-13 sm:w-1/3">
                <span className="font-semibold text-primary-200">{totalResults}</span>
                <span>{t("clients.results")}</span>
            </div>
            <div className="flex justify-end text-gray-400 sm:w-1/3">
                <div className="flex sm:w-1/5">
                    <select
                        className="flex justify-between mr-10 text-sm leading-5 text-gray-500 border-transparent appearance-none cursor-pointer"
                        value={limit}
                        onChange={(e) => {
                            setPerPage(Number(e.target.value));
                        }}>
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize} {t("filas")}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
