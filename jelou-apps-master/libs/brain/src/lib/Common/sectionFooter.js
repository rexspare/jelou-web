import { LeftIconLarge, RightIconLarge } from "@apps/shared/icons";
import { useTranslation } from "react-i18next";

const SectionFooter = (props) => {
    const { itemsPerPage, setItemsPerPage, totalItems, pageNumber, setPageNumber, showList } = props;
    const { t } = useTranslation();

    const startRange = (pageNumber - 1) * itemsPerPage + 1;
    const endRange = Math.min(pageNumber * itemsPerPage, totalItems);

    const handlePageLimitChange = (event) => {
        event.preventDefault();
        setItemsPerPage(parseInt(event.target.value));
    };

    const handleShowNextPage = () => {
        setPageNumber(pageNumber + 1);
    };

    const handleShowPrevPage = () => {
        setPageNumber(pageNumber - 1);
    };

    return (
        <div className="absolute bottom-0 flex h-16 w-full items-center justify-end gap-x-4 rounded-b-lg border-t-1 border-neutral-200 bg-white pr-8">
            <div className="flex h-9 items-center gap-x-3 py-2.5 px-5">
                <button className="disabled:cursor-not-allowed" onClick={handleShowPrevPage} disabled={pageNumber === 1}>
                    <LeftIconLarge className="text-gray-400" />
                </button>
                <span className="text-xs font-normal text-gray-400">
                    <span className="text-xs font-normal text-gray-400">
                        {startRange === endRange
                            ? `${startRange} ${t("common.of")} ${totalItems}`
                            : `${startRange}-${endRange} ${t("common.of")} ${totalItems}`}
                    </span>
                </span>
                <button className="disabled:cursor-not-allowed" onClick={handleShowNextPage} disabled={pageNumber >= totalItems / itemsPerPage}>
                    <RightIconLarge className="text-gray-400" />
                </button>
            </div>
            <select
                className="flex h-9 w-auto appearance-none items-center gap-x-5 rounded-md border-0 bg-[#EFF1F4] py-2.5 pl-5 pr-7 text-xs font-normal text-gray-400"
                value={itemsPerPage}
                onChange={handlePageLimitChange}>
                {[10, 20, 50].map((rowsPerPage) => {
                    return (
                        <option key={rowsPerPage} value={rowsPerPage}>
                            {`${rowsPerPage} ${showList ? t("common.rows") : t("common.cards")}`}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};

export default SectionFooter;
