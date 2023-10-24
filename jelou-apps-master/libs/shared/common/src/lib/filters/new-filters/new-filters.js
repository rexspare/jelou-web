import { withTranslation } from "react-i18next";

import Select from "../../select/ReactSelect";

const Filters = (props) => {
    const { filters, cleanFilters, t } = props;

    const handleChange = (evt, setFilteredOption, placeholder) => {
        const { value } = evt;
        if (value === "-1") {
            setFilteredOption({ value: "-1", label: `${placeholder}: Todos` });
        } else {
            setFilteredOption(evt);
        }
    };

    return (
        <div className="mb-4 hidden rounded-md bg-white p-2 lg:flex">
            {filters.map((filter, index) => {
                return (
                    <div className="relative" key={index} ref={filter.dropdownRef}>
                        <div className="border-gray-475 relative flex w-48 items-center justify-between border-r-1 bg-white focus:outline-none">
                            <Select
                                onChange={(evt) => handleChange(evt, filter.setFilteredOption, filter.placeholder)}
                                value={filter.filteredOption}
                                options={filter.options}
                                placeholder={filter.placeholder}
                                loading={filter.loading}
                                hasAll
                                oneLabel
                            />
                        </div>
                    </div>
                );
            })}
            <div className="flex w-full items-center justify-end">
                <button
                    className="bg-blond text-blond-dark hover:bg-blond-darker hover:text-blond-darkest ml-4 inline-flex h-6 min-w-20 items-center justify-center rounded-full px-3 text-xs font-medium leading-4"
                    onClick={() => cleanFilters()}>
                    {t("Limpiar")}
                </button>
            </div>
        </div>
    );
};

export default withTranslation()(Filters);
