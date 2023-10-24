import React, { useState, useCallback } from "react";
import { ArchiveMassIcon } from "@apps/shared/icons";
import isEmpty from "lodash/isEmpty";
import ArchiveLoading from "../utils/ArchiveLoading";
import "dayjs/locale/es";
import PorHashTag from "./components/PorHashTag";
import PorHilo from "./components/PorHilo";
import { LoadingSpinner } from "@apps/shared/icons";
import Pagination from "./components/PaginationMassArchive";
import throttle from "lodash/throttle";

export function ResultMassPostMo(props) {
    const {
        t,
        onCloseModal,
        loadingData,
        data,
        bot,
        chooseArchiveType,
        byHashtagChoose,
        allCheck,
        setAllCheck,
        selected,
        setSelected,
        onArchivar,
        loadingArchivar,
        totalPages,
        total,
        page,
        setPage,
        setActualPage,
        actualPage,
        nextPage,
        previousPage,
        onGetPosts,
    } = props;

    const srcVacio = "https://s3.us-west-2.amazonaws.com/cdn.devlabs.tech/default_avatar.jpeg";

    // const [previousPage, setPreviousPage] = useState(0);

    const handleSelectAllClick = (event) => {
        setAllCheck((prevState) => !prevState);
        if (event.target.checked) {
            const newSelected = data.map((n) => n.messageId);
            // const newSelected = rows.map((n) => n.id_registro);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }

        setSelected(newSelected);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;
    const inputCheckboxClassName =
        "mt-1 mr-2 h-4 w-4 rounded-default border-1 border-gray-300 text-primary-200 checked:border-transparent checked:bg-primary-200 hover:checked:bg-primary-200 focus:ring-primary-200 focus:ring-opacity-25 focus:checked:bg-primary-200 cursor-pointer";

    return (
        <div className="flex w-full flex-col items-center justify-center p-4 py-12 text-center">
            {isEmpty(data) && !loadingData && (
                <div className="absolute top-[25%]">
                    <ArchiveMassIcon className="sm:ml-10 2xl:ml-16" style={{ width: "100%" }} />
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="mx-12">
                            <h4 className=" px-11 pt-4 pb-1 text-base font-extrabold">{t("MassAchivePost.notSelectTitle")}</h4>
                        </div>
                        <p className="p-3 text-sm">{t("MassAchivePost.notSelectText")}</p>
                    </div>
                </div>
            )}
            {loadingData && (
                <div className="flex h-auto w-full flex-col rounded-l-lg bg-white sm:h-sidebar-archived">
                    <ArchiveLoading />
                </div>
            )}
            {!isEmpty(data) && !isEmpty(chooseArchiveType) && !loadingData && chooseArchiveType.type === "2" && (
                <PorHilo
                    data={data}
                    selected={selected}
                    handleSelectAllClick={handleSelectAllClick}
                    inputCheckboxClassName={inputCheckboxClassName}
                    t={t}
                    isSelected={isSelected}
                    handleClick={handleClick}
                    srcVacio={srcVacio}
                    bot={bot}
                />
            )}
            {!isEmpty(data) && !isEmpty(chooseArchiveType) && !loadingData && chooseArchiveType.type === "1" && (
                <PorHashTag
                    byHashtagChoose={byHashtagChoose}
                    data={data}
                    srcVacio={srcVacio}
                    bot={bot}
                    t={t}
                    inputCheckboxClassName={inputCheckboxClassName}
                />
            )}

            <footer className="">
                {!isEmpty(data) && !loadingData && (
                    <div className="absolute bottom-[11%] left-[47%] w-6/12">
                        <Pagination
                            t={t}
                            previousPage={previousPage}
                            nextPage={nextPage}
                            actualPage={actualPage}
                            setActualPage={setActualPage}
                            total={total}
                            totalPages={totalPages}
                            onGetPosts={onGetPosts}
                        />
                    </div>
                )}
                <hr className=" border-b absolute left-[46%] top-[90%] w-full max-w-full border-gray-34" />
                <div className="absolute bottom-0 right-0 mr-4 mb-4 flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => {
                            onCloseModal();
                        }}
                        className="rounded-3xl border-transparent bg-gray-10 px-5 py-2 text-base font-bold text-gray-400 outline-none">
                        {t("botsComponentDelete.cancel")}
                    </button>
                    <button
                        type="submit"
                        className="button-gradient-xl disabled:cursor-not-allowed disabled:bg-opacity-60"
                        onClick={async () => {
                            await onArchivar();
                        }}>
                        {loadingArchivar ? (
                            <div className="flex justify-center">
                                <LoadingSpinner color="#FFFF" />
                            </div>
                        ) : (
                            t("pma.Archivar")
                        )}
                    </button>
                </div>
            </footer>
        </div>
    );
}
export default ResultMassPostMo;
