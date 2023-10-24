import { useRef } from "react";
import { useTranslation } from "react-i18next";
import Tippy from "@tippyjs/react";

import { DateFilter } from "./Date";
import { INTERNAL_FILTERS_TYPES } from "../../../constants";
import { SelectFilter } from "./Select";
import { TextFilter } from "./Text";

export function Filters({ filters = [], resetPagination } = {}) {
    const { t } = useTranslation();

    const cleaner = useRef([]);

    const handleClearAllFilters = () => {
        cleaner.current.forEach((clean) => clean());
    };

    const hasTextFiler = filters.some((filter) => filter.type === INTERNAL_FILTERS_TYPES.SEARCH);

    return (
        <div className="grid grid-cols-[auto_3rem] gap-9 rounded-t-20 bg-white">
            <section className="grid grid-flow-row grid-cols-[repeat(auto-fill,_minMax(16rem,_1fr))] gap-9 py-4 pl-5">
                {filters &&
                    filters.length > 0 &&
                    filters.map((filter, index) => {
                        const { type, enabled = true } = filter || {};

                        if (enabled === false) return null;

                        switch (type) {
                            case INTERNAL_FILTERS_TYPES.OPTIONS:
                                return <SelectFilter resetPagination={resetPagination} cleaner={cleaner} filter={filter} key={filter.name + index} />;
                            case INTERNAL_FILTERS_TYPES.DATE:
                                return <DateFilter resetPagination={resetPagination} cleaner={cleaner} filter={filter} key={filters.name + index} />;
                            case INTERNAL_FILTERS_TYPES.SEARCH:
                                return <TextFilter resetPagination={resetPagination} cleaner={cleaner} filter={filter} key={filter.name + index} />;
                            default:
                                return null;
                        }
                    })}

                {hasTextFiler === false && <TextFilter resetPagination={resetPagination} cleaner={cleaner} filter={{}} />}
            </section>

            {filters && filters.length > 0 && (
                <div className="flex items-center">
                    <Tippy arrow={false} className="tippyInfoColors" content={t("shop.clearFilters")} placement="top" touch={false}>
                        <button onClick={handleClearAllFilters} className="flex items-center justify-center rounded-full h-9 w-9 bg-green-960">
                            <svg width={14} height={20} fill="none">
                                <path
                                    d="M10.844 19.483c-2.412-.617-4.695-1.48-6.76-2.889l1.673-3.033-.03-.02-2.495 2.424A15.004 15.004 0 0 1 1 13.805l.16-.127c.71-.55 1.435-1.084 2.127-1.654a11.5 11.5 0 0 0 2.448-2.82L5.865 9c2.236 1.291 4.462 2.577 6.704 3.87-1.088 2.076-1.917 4.207-1.725 6.613ZM13.5 10.41c-.188.42-.378.93-.802 1.284-.227.19-.504.125-.758-.022-1.298-.752-2.597-1.5-3.896-2.25-.5-.288-1.002-.576-1.5-.866-.411-.239-.51-.611-.274-1.023.14-.245.278-.492.425-.733.214-.353.602-.46.96-.253C9.483 7.6 11.31 8.654 13.134 9.71c.236.135.359.34.367.701ZM13.665 3.241c-.192-.12-.39-.23-.586-.341-.433-.249-.798-.15-1.049.284l-1.89 3.257c-.125.216-.24.436-.37.667.612.355 1.21.698 1.827 1.056.782-1.358 1.556-2.695 2.319-4.037.18-.314.06-.69-.251-.886ZM2.002 3.256c.25 1.366.895 2.178 1.998 2.487-1.089.33-1.757 1.144-1.998 2.513-.238-1.365-.895-2.17-2.002-2.51 1.114-.33 1.774-1.129 2.002-2.49ZM4.498 1.256c.215.805.688 1.293 1.502 1.505-.807.209-1.287.697-1.502 1.495-.213-.81-.695-1.29-1.498-1.493.798-.207 1.285-.68 1.498-1.507ZM1.99 2.256c-.16-.52-.475-.834-.99-.994.505-.169.834-.476.99-1.006.169.51.476.835 1.01 1.004-.534.157-.839.493-1.01.996Z"
                                    fill="#fff"
                                />
                            </svg>
                        </button>
                    </Tippy>
                </div>
            )}
        </div>
    );
}
