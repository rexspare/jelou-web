import { ComboboxSelect, DateRangePicker, Input, TextFilter } from "@apps/shared/common";
import { LoadingSpinner } from "@apps/shared/icons";
import dayjs from "dayjs";
import get from "lodash/get";
import orderBy from "lodash/orderBy";
import { useEffect, useState } from "react";
import styles from "./filter-mass-post-m.module.css";

export function FilterMassPostM(props) {
    const {
        t,
        filters,
        selectedOptions,
        setSelectedOptions,
        chooseArchiveType,
        chooseHashtag,
        setChooseHashtag,
        loadingData,
        onGetPosts,
        handlePageActual,
        setChooseArchiveType,
        setBotId,
        setChooseAsgmtType,
        camposObligatorios,
    } = props;
    const [ifDateChange, setifDateChange] = useState(true);
    const dayActual = new Date(dayjs());

    const dateChange = (range) => {
        setifDateChange(false);
        let [startDate, endDate] = range;
        setSelectedOptions({ ...selectedOptions, date: [startDate, endDate] });
    };

    const clearDate = () => {
        setSelectedOptions({ ...selectedOptions, date: [] });
    };

    const clearFilter = (filter) => {
        setSelectedOptions({ ...selectedOptions, [filter]: [] });
        if (filter === "AsgmtType") {
            setChooseAsgmtType(null);
            return;
        }
        if (filter === "bots") {
            setBotId(null);
            return;
        }
        if (filter === "ArchType") {
            setChooseArchiveType(null);
            setChooseHashtag(false);
            return;
        }
    };

    useEffect(() => {
        setChooseHashtag(get(chooseArchiveType, "type", "") === "1");
    }, [chooseArchiveType]);

    useEffect(() => {
        if (ifDateChange) {
            setSelectedOptions({ ...selectedOptions, date: [dayActual, dayActual] });
            setifDateChange(true);
        }
    }, [ifDateChange]);

    return (
        <div className="flex flex-col justify-center px-5 py-4 " style={{ width: "84%" }}>
            <div className="absolute top-[15%] w-[36%]">
                {filters.map((filter) => (
                    <div key={filter.id} className="p-0">
                        <div className={``}>
                            {get(filter, "type", "") === "Date" ? (
                                <div
                                    className={
                                        camposObligatorios.date
                                            ? styles.dateObl + " " + styles.dateDefault + " p-4"
                                            : styles.dateFilter + " " + styles.dateDefault + " p-4"
                                    }>
                                    <h4 className="p-2 text-lg font-bold">{t("MassAchivePost.titleDate")}</h4>
                                    <div className="flex items-center justify-center text-center">
                                        <DateRangePicker
                                            dateValue={selectedOptions.date}
                                            // icon={filter.icon}
                                            dateChange={dateChange}
                                            clearDate={clearDate}
                                            right={true}
                                            placeholder={true}
                                        />
                                        {camposObligatorios.date && <span className="text-red-950">*</span>}
                                    </div>
                                </div>
                            ) : get(filter, "type", "") === "Input" ? (
                                <div>
                                    {chooseHashtag && (
                                        <div className={styles.bgInput + " p-4"}>
                                            <h4 className="p-2 text-lg font-bold">{t("MassAchivePost.titleHash")}</h4>
                                            <input
                                                value={filter.value}
                                                placeholder={filter.placeholder}
                                                label={filter.placeholder}
                                                onChange={filter.onChange}
                                                name={filter.name}
                                                background={"#fff"}
                                                id={filter.id}
                                                ref={filter.myRef}
                                                className={"input"}
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className={styles.bgInput + " p-4"}>
                                    <h4 className="p-1 text-lg font-bold ">
                                        {get(filter, "name", "") === "AsgmtType"
                                            ? t("MassAchivePost.titleAsgmtType")
                                            : get(filter, "name", "") === "bots"
                                            ? t("MassAchivePost.titleBot")
                                            : get(filter, "name", "") === "ArchType"
                                            ? t("MassAchivePost.titleArchivType")
                                            : ""}
                                    </h4>
                                    <div className="flex items-center justify-center text-center">
                                        <ComboboxSelect
                                            options={filter.options}
                                            value={filter.value}
                                            placeholder={filter.placeholder}
                                            label={filter.placeholder}
                                            handleChange={filter.onChange}
                                            name={filter.name}
                                            defaultValue={filter.defaultValue}
                                            background={"#fff"}
                                            clearFilter={clearFilter}
                                            className={
                                                get(filter, "name", "") === "AsgmtType"
                                                    ? camposObligatorios.asgmtType
                                                        ? "w-full rounded-3 border-2 !border-red-950 bg-red-1010 bg-opacity-10 "
                                                        : ""
                                                    : get(filter, "name", "") === "bots"
                                                    ? camposObligatorios.bot
                                                        ? "w-full rounded-3 border-2 !border-red-950 bg-red-1010 bg-opacity-10 "
                                                        : ""
                                                    : get(filter, "name", "") === "ArchType"
                                                    ? camposObligatorios.archiveType
                                                        ? "w-full rounded-3 border-2 !border-red-950 bg-red-1010 bg-opacity-10 "
                                                        : ""
                                                    : ""
                                            }
                                        />
                                        {get(filter, "name", "") === "AsgmtType" ? (
                                            camposObligatorios.asgmtType ? (
                                                <span className="text-red-950">*</span>
                                            ) : (
                                                ""
                                            )
                                        ) : get(filter, "name", "") === "bots" ? (
                                            camposObligatorios.bot ? (
                                                <span className="text-red-950">*</span>
                                            ) : (
                                                ""
                                            )
                                        ) : get(filter, "name", "") === "ArchType" ? (
                                            camposObligatorios.archiveType ? (
                                                <span className="text-red-950">*</span>
                                            ) : (
                                                ""
                                            )
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div className="p-4">
                    <button
                        onClick={(e) => {
                            onGetPosts(1);
                            handlePageActual();
                        }}
                        className="h-12 w-full rounded-lg border-2 border-primary-200 p-3 font-bold text-primary-200">
                        {loadingData ? (
                            <div className="flex justify-center">
                                <LoadingSpinner color="#19A7CE" />
                            </div>
                        ) : (
                            t("MassAchivePost.button1")
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
export default FilterMassPostM;
