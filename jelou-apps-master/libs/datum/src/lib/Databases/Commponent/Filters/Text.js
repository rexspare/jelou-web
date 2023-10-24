import { useCallback, useContext, useMemo, useRef, useState } from "react";
import isEmpty from "lodash/isEmpty";

import { GlobalSearchPMA } from "@apps/shared/common";
import { resetSearchAction, setSearchAction } from "../../Hook/use-params-for-filters/useParamsForFilters";
import { RowsTableData } from "../../Table";

export function TextFilter({ filter, cleaner, resetPagination }) {
    const [input, setInput] = useState("");
    const [firstTime, setFirstTime] = useState(false);

    const { dispatchForFilters } = useContext(RowsTableData);

    const searchButton = useRef();

    const placeholder = filter?.name || "Buscar";

    const getKeysForSearch = useCallback(() => {
        const { columns = [] } = filter ?? {};

        if (isEmpty(columns)) return [];

        return columns.map((column, index) => {
            const { key, name } = column;
            return { id: index, name: name, searchBy: key, isNumber: false };
        });
    }, [filter]);

    const archivedQuerySearch = ""; // get the redux state

    const customHandleSearch = ({ input, field }) => {
        const hasSearchBy = Boolean(field?.searchBy);

        const search = {
            search: input,
            ...(hasSearchBy ? { searchBy: field.searchBy } : {}),
        };

        resetPagination();

        dispatchForFilters(setSearchAction(search));

        if (!firstTime) {
            setFirstTime(true);
            cleaner.current.push(clearFilter);
        }
    };

    const clearFilter = () => {
        setInput("");
        dispatchForFilters(resetSearchAction());
    };

    const typeSearchBy = useMemo(() => getKeysForSearch(), [getKeysForSearch]);

    return (
        <div className="relative">
            <GlobalSearchPMA
                clean={clearFilter}
                placeholder={placeholder}
                query={archivedQuerySearch}
                recentSearchName="datum_archived"
                searchButton={searchButton}
                setQuery={() => null}
                setSearchBy={() => null}
                typeSearchBy={typeSearchBy}
                customHandleSearch={customHandleSearch}
                input={input}
                setInput={setInput}
                minLength={0}
            />
            {!isEmpty(archivedQuerySearch) && (
                <span className="flex justify-end mt-1 italic text-red-400 text-11">*No se encontraron resultados</span>
            )}
        </div>
    );
}
