import isEmpty from "lodash/isEmpty";

import CustomSort from "./CustomSortReport";
import { DownloadReportButton } from "./downloadReport";
import Filter from "./Filter";
import { useDateFilter } from "./Filter/DateRangePicker/useDate";

const TableContainer = (props) => {
    const { setRequestParams, onDownload, dataCards, downloading, filters, handleDelimChange, setDefaultPeriodDate, customSort } = props;
    const { dataRanges, dateValue, endDate, startDate, rangeSelected, onChange, dateChange, setRangeSelected } = useDateFilter({
        setSelected: setRequestParams,
    });

    const dateProps = {
        dataRanges,
        dateChange,
        dateValue,
        endDate,
        onChange,
        rangeSelected,
        setRangeSelected,
        startDate,
        setDefaultPeriodDate,
    };

    return (
        <div className="flex flex-col bg-transparent">
            <div className="relative flex h-full w-full flex-col overflow-hidden rounded-12 font-sans shadow-card">
                <div className="flex h-full w-full items-center justify-between gap-4 bg-white px-6 py-7 md:items-end">
                    <Filter dateProps={dateProps} filters={filters} setRequestParams={setRequestParams} />
                    <div className="flex items-center gap-4">
                        {/* <Tippy content={"Limpiar filtros"}>
                            <button onClick={handleCleanUpFilters} className="flex items-center justify-center rounded-full h-9 w-9 bg-green-960">
                                <svg width={14} height={20} fill="none">
                                    <path
                                        d="M10.627 19.092c-2.413-.617-4.696-1.48-6.76-2.888.56-1.02 1.117-2.027 1.672-3.034l-.03-.02-2.495 2.424a14.994 14.994 0 0 1-2.232-2.16l.16-.127c.71-.55 1.436-1.084 2.127-1.654a11.501 11.501 0 0 0 2.448-2.82l.13-.204c2.236 1.292 4.462 2.577 6.704 3.87-1.088 2.076-1.917 4.207-1.724 6.613ZM13.355 9.968c-.188.42-.378.93-.801 1.284-.228.19-.504.125-.759-.022-1.297-.752-2.597-1.501-3.896-2.25-.5-.288-1.001-.576-1.5-.866-.41-.239-.509-.611-.274-1.023.14-.245.279-.492.426-.733.213-.353.601-.46.96-.253 1.827 1.053 3.653 2.107 5.478 3.161.235.136.358.341.366.702ZM13.665 3.241c-.192-.12-.39-.23-.586-.34-.434-.25-.798-.152-1.049.283l-1.89 3.258c-.125.215-.24.435-.37.666.612.355 1.21.698 1.827 1.056.782-1.358 1.556-2.695 2.319-4.037.18-.314.06-.69-.251-.886ZM2.002 3.256c.25 1.366.895 2.178 1.998 2.487-1.089.33-1.757 1.144-1.998 2.513-.238-1.365-.895-2.17-2.002-2.51 1.114-.33 1.774-1.129 2.002-2.49ZM4.498 1.256c.215.806.688 1.294 1.502 1.505-.807.209-1.287.697-1.502 1.495-.213-.81-.695-1.29-1.498-1.493.798-.207 1.285-.679 1.498-1.507ZM1.99 2.256c-.16-.52-.475-.834-.99-.993.505-.17.834-.477.99-1.007.169.51.476.835 1.01 1.004-.534.157-.839.493-1.01.996Z"
                                        fill="#fff"
                                    />
                                </svg>
                            </button>
                        </Tippy> */}
                        <DownloadReportButton onDownload={onDownload} downloading={downloading} handleDelimChange={handleDelimChange} />
                        {customSort && <CustomSort setRequestParams={setRequestParams} />}
                    </div>
                </div>

                {!isEmpty(dataCards) && (
                    <section
                        className="grid grid-flow-row gap-4 bg-white px-6 pb-7"
                        style={{ gridTemplateColumns: "repeat(auto-fill, minMax(15rem, 1fr))" }}>
                        {dataCards.length > 0 &&
                            dataCards.map((card) => {
                                const { label, content } = card;
                                return (
                                    <article className="flex h-28 w-full flex-col justify-center rounded-12 border-1.5 border-gray-100 border-opacity-50 pl-12">
                                        <span className="text-3xl font-semibold text-primary-200">{content}</span>
                                        <span className="text-xs font-normal capitalize leading-5 text-gray-500">{label}</span>
                                    </article>
                                );
                            })}
                    </section>
                )}

                <div>{props.children}</div>
            </div>
        </div>
    );
};
export default TableContainer;
