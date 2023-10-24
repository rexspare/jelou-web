import isEmpty from "lodash/isEmpty";
import { withTranslation } from "react-i18next";
import { CleanIcon } from "@apps/shared/icons";
import Tippy from "@tippyjs/react";
import { ComboboxSelect } from "@apps/shared/common";
import { CheckIcon } from "@heroicons/react/solid";

const KIACombobox = (props) => {
    const { filters, filteredCategory, filteredGroups, filteredAgencies, filteredCities, applySearch, cleanFilters, t } = props;

    const handleChange = (evt, setFilteredOption) => {
        setFilteredOption(evt);
    };

    const searchFilters = () => {
        if (isEmpty(filteredCategory) && isEmpty(filteredGroups) && isEmpty(filteredCities) && isEmpty(filteredAgencies)) {
            return;
        }
        applySearch();
    };

    return (
        <div className="mt-4 hidden w-full items-center space-x-3 rounded-xl bg-white p-3 px-6 lg:flex">
            {filters.map((filter, index) => {
                return (
                    <ComboboxSelect
                        key={index}
                        handleChange={(evt) => handleChange(evt, filter.setFilteredOption)}
                        value={filter.filteredOption}
                        options={filter.options}
                        label={filter.placeholder}
                        loading={filter.loading}
                        clearFilter={() => handleChange([], filter.setFilteredOption)}
                    />
                );
            })}
            <div className="flex w-full items-center justify-end space-x-2">
                <Tippy content={t("AdminFilters.clean")} placement={"bottom"} touch={false}>
                    <button
                        className="flex h-[1.90rem] w-[1.96rem] items-center justify-center rounded-full bg-green-960 focus:outline-none"
                        onClick={() => cleanFilters()}>
                        <CleanIcon className="m-auto fill-current text-white" width="0.844rem" height="1.178rem" />
                    </button>
                </Tippy>
                <Tippy content={t("AdminFilters.clean")} placement={"bottom"} touch={false}>
                    <button
                        className="flex h-[1.90rem] w-[1.96rem] items-center justify-center rounded-full bg-primary-200 focus:outline-none"
                        onClick={searchFilters}>
                        <CheckIcon className="m-auto fill-current text-white" width="1.6rem" height="1.4rem" />
                    </button>
                </Tippy>
            </div>
        </div>
    );
};

export default withTranslation()(KIACombobox);
