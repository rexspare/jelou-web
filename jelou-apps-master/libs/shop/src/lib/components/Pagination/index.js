import { DownIcon } from "@apps/shared/icons";
import { useTranslation } from "react-i18next";

export function Pagination({ dataForPage, setCurrentPage, setPerPage }) {
    const { t } = useTranslation();
    const isNotAllowedPreviusPage = dataForPage?.current_page === 1;
    const isNotAllowedNextPage = dataForPage?.current_page === dataForPage?.last_page;

    const nextPage = () => {
        !isNotAllowedNextPage && setCurrentPage((previusState) => previusState + 1);
    };

    const previusPage = () => {
        !isNotAllowedPreviusPage && setCurrentPage((previusState) => previusState - 1);
    };
    return (
        <footer className="ml-5 mr-3 flex items-center justify-between py-4 text-gray-400">
            <div className="flex items-center">
                <button onClick={previusPage}>
                    <DownIcon
                        className={`ml-1 rotate-90 transform ${isNotAllowedPreviusPage ? "cursor-not-allowed" : "cursor-pointer"}`}
                        width="0.938rem"
                        fill="#707C95"
                    />
                </button>
                {dataForPage?.from} - {dataForPage?.to} {t("shop.pagination.separator")} {dataForPage?.total}
                <button onClick={nextPage}>
                    <DownIcon
                        className={`ml-1 -rotate-90 transform ${isNotAllowedNextPage ? "cursor-not-allowed" : "cursor-pointer"}`}
                        width="0.938rem"
                        fill="#707C95"
                    />
                </button>
            </div>

            <select
                className="appearance-none border-none text-sm outline-none ring-transparent focus:ring-transparent"
                defaultValue={dataForPage?.per_page}
                onChange={(e) => {
                    setPerPage(Number(e.target.value));
                }}>
                {[10, 20, 30, 40, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                        {pageSize} {t("clients.rows")}
                    </option>
                ))}
            </select>
        </footer>
    );
}
