import { Popover, Transition } from "@headlessui/react";
import toUpper from "lodash/toUpper";
import { Fragment, useRef } from "react";
import { useTranslation } from "react-i18next";

import { FilterIcon } from "@apps/shared/icons";
import ComboboxSelect from "../combobox/combobox";
import DateRangePickerClean from "../daterangepickerclean/daterangepickerclean";

const Filters = (props) => {
    const { filters, getNotes, cleanFilters } = props;
    const { t } = useTranslation();
    const searchButton = useRef();

    const renderFilter = (filter) => {
        switch (toUpper(filter.type)) {
            case "SELECT":
                return (
                    <ComboboxSelect
                        value={filter.value}
                        handleChange={filter.handleChange}
                        name="Operadores"
                        options={filter.options}
                        label={filter.label}
                        placeholder={filter.placeholder}
                        clearFilter={filter.clean}
                    />
                );
            case "RANGEDATE":
                return <DateRangePickerClean full dateValue={filter.value} dateChange={filter.handleChange} clearDate={filter.clean} selectedDates={filter.selectedDates} right />;
        }
    };

    return (
        <Popover className="relative flex items-center bg-white">
            <>
                <Popover.Button as="button" ref={searchButton}>
                    <FilterIcon stroke="#727C94" width="18" height="18" className="ml-2" />
                </Popover.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Popover.Panel className="absolute right-0 top-0 z-20 mt-8 w-screen max-w-sm rounded-10 bg-white px-4 sm:px-0 lg:max-w-xl">
                        <div className="ring-1 ring-opacity-5 rounded-lg shadow-normal ring-black">
                            <div className="px-7 py-6 text-sm font-medium text-gray-400">Filtros</div>
                            <div className="relative grid gap-8 px-7 lg:grid-cols-2">{filters.map((filter) => renderFilter(filter))}</div>
                            <div className="mx-4 flex justify-end space-x-2 bg-white py-4">
                                <button
                                    className="flow-root rounded-full px-2 py-2 text-primary-200 underline transition duration-150 ease-in-out focus:outline-none"
                                    onClick={() => {
                                        cleanFilters();
                                        searchButton.current?.click();
                                    }}
                                >
                                    <span className="flex items-center text-sm">{t("clients.clean")}</span>
                                </button>
                                <button
                                    className="flow-root rounded-full bg-primary-200 px-2 py-2 text-white transition duration-150 ease-in-out focus:outline-none"
                                    onClick={() => {
                                        searchButton.current?.click();
                                        getNotes();
                                    }}
                                >
                                    <span className="flex items-center text-sm">{t("plugins.Aplicar")}</span>
                                </button>
                            </div>
                        </div>
                    </Popover.Panel>
                </Transition>
            </>
        </Popover>
    );
};

export default Filters;
