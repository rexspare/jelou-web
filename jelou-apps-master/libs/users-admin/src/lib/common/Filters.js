import Tippy from "@tippyjs/react";
import isEmpty from "lodash/isEmpty";
import { ClipLoader } from "react-spinners";
import { useTranslation } from "react-i18next";
import { DebounceInput } from "react-debounce-input";
import React, { useEffect, useRef } from "react";

import { Clean, DownloadIcon, SearchIcon } from "@apps/shared/icons";
import { MultiCombobox } from "@apps/shared/common";

const Filters = (props) => {
    const {
        loadResults,
        selectedOptions,
        setSelectedOptions,
        INITIAL_FILTERS,
        filters,
        setQuery,
        loadingQuery,
        showDownload,
        downloadUsers,
        loadingDownload,
        query,
    } = props;
    const { t } = useTranslation();

    const input = useRef();

    const clearFilters = () => {
        setSelectedOptions(INITIAL_FILTERS);
        setQuery("");
    };

    useEffect(() => {
        if (!isEmpty(query)) {
            loadResults(query);
        } else {
            loadResults();
        }
    }, [selectedOptions, query]);

    useEffect(() => {
        if (input.current) {
            input.current.state.value = "";
        }
    }, []);

    async function handleChange({ target }) {
        const { value } = target;
        setQuery(value.trim());
        loadResults(value.trim());
    }

    return (
        <div className="flex justify-between p-2 py-4">
            <div className="flex items-center">
                <div className="relative mr-6 flex h-full w-70 rounded-[0.8125rem] border-[0.0938rem] border-gray-100 border-opacity-50">
                    <div className="absolute top-0 left-0 bottom-0 ml-4 flex items-center">
                        {loadingQuery ? (
                            <div>
                                <ClipLoader size={"0.875rem"} color={"#c4daf2"} />
                            </div>
                        ) : (
                            <SearchIcon className="fill-current" width="1rem" height="1rem" />
                        )}
                    </div>
                    <DebounceInput
                        type="search"
                        ref={input}
                        value={query}
                        className="w-full rounded-full border-transparent py-1 pl-14 text-sm text-gray-500 focus:border-transparent focus:ring-transparent"
                        placeholder={t("plugins.Buscar")}
                        minLength={2}
                        debounceTimeout={500}
                        onChange={handleChange}
                        autoFocus
                    />
                </div>
                {filters.map((filter, index) => (
                    <div key={index} className={`mr-5 flex h-full w-64 items-center pr-2`}>
                        <MultiCombobox
                            icon={filter.icon}
                            label={filter.name}
                            handleChange={filter.onChange}
                            value={filter.value}
                            name={filter.name}
                            clearFilter={filter.clear}
                            options={filter.options}
                            background={"#fff"}
                            hasAllOptions={true}
                        />
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-end space-x-2 pl-4">
                <Tippy content={t("AdminFilters.clean")} placement={"bottom"} theme={"jelou"} touch={false}>
                    <button
                        className="flex h-[1.90rem] w-[1.90rem] items-center justify-center rounded-full bg-green-960 focus:outline-none"
                        onClick={clearFilters}>
                        <Clean className="fill-current text-white" width="0.844rem" height="1.178rem" />
                    </button>
                </Tippy>

                {showDownload && (
                    <Tippy content={t("HSMTableFilter.download")} theme={"jelou"} placement={"bottom"} touch={false}>
                        <button
                            onClick={downloadUsers}
                            className="flex h-[1.90rem] w-[1.96rem] items-center justify-center rounded-full bg-primary-200 focus:outline-none"
                            disabled={loadingDownload}>
                            {loadingDownload ? (
                                <ClipLoader color={"white"} size="1.1875rem" />
                            ) : (
                                <DownloadIcon width="0.813rem" height="0.875rem" fill="white" />
                            )}
                        </button>
                    </Tippy>
                )}
            </div>
        </div>
    );
};

export default Filters;
