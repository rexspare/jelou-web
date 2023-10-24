import { useTranslation } from "react-i18next";
import isEmpty from "lodash/isEmpty";

import { useRef } from "react";
import { Filters, SortedOptions, GlobalSearchPma } from "@apps/shared/common";

export function Search(props) {
    const { t } = useTranslation();
    const {
        filters,
        sortOrder,
        setSortOrder,
        showSortOptions,
        setShowSortOptions,
        getNotes,
        open,
        setOpen,
        notes,
        cleanFilters,
        //search
        setQuery,
        query,
        searchBy,
        setSearchBy,
        clean,
        typeSearchBy,
    } = props;

    const searchButton = useRef();

    return (
        <div className="relative flex w-full items-center px-4">
            <div className="w-full">
                <GlobalSearchPma
                    searchButton={searchButton}
                    setQuery={setQuery}
                    query={query}
                    searchBy={searchBy}
                    setSearchBy={setSearchBy}
                    clean={clean}
                    typeSearchBy={typeSearchBy}
                    position="top-0 right-0"
                    placeholder={t("pma.Buscar en notas")}
                    type="archived"
                />
                {!isEmpty(query) && isEmpty(notes) && <span className="mt-1 flex justify-end text-11 italic text-red-500">*No se encontraron resultados</span>}
            </div>
            <div className="flex items-center justify-center">
                <SortedOptions sortOrder={sortOrder} setSortOrder={setSortOrder} showSortOptions={showSortOptions} setShowSortOptions={setShowSortOptions} />
                {/* <Filters filters={filters} getNotes={getNotes} open={open} setOpen={setOpen} cleanFilters={cleanFilters} /> */}
            </div>
        </div>
    );
}
