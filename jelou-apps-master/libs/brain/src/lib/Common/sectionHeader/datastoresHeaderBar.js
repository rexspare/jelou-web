import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DebounceInput } from "react-debounce-input";

import { CloseIcon, SearchIcon2 } from "@apps/shared/icons";
import { DATASTORE, TRUNCATION_CHARACTER_LIMITS } from "../../constants";
import CreateOrEditDatastoreModal from "../../Components/Datastores/createOrEditDatastoreModal";
import AddButton from "../addButton";
import ConditionalTruncateTippy from "../conditionalTruncateTippy";

const DatastoresHeaderBar = (props) => {
    const {
        header,
        handleSearch,
        resetData,
        handleCreateDatastore,
        showCreateDatastoreModal,
        closeCreateDatastoreModal,
    } = props;
    const { t } = useTranslation();
    const [searchInputValue, setSearchInputValue] = useState("");

    const handleClearInputSearchClick = (e) => {
        e.preventDefault();
        setSearchInputValue("");
        resetData();
    };

    return (
        <>
            <div className="flex w-full justify-between">
                <div className="flex items-center justify-center gap-x-4">
                    <ConditionalTruncateTippy
                        text={header}
                        charactersLimit={TRUNCATION_CHARACTER_LIMITS.HEADER}
                        textStyle={"text-xl font-bold text-primary-200"}
                    />
                </div>
                <section className="flex gap-3">
                    <div className="flex h-10 w-[18rem] items-center rounded-10 border-default border-gray-100 border-opacity-50 bg-white px-4">
                        <label className="flex items-center ">
                            <SearchIcon2 width="24px" height="24px" />
                            <DebounceInput
                                autoFocus
                                type="search"
                                minLength={2}
                                debounceTimeout={500}
                                onChange={(e) => {
                                    handleSearch(e);
                                    setSearchInputValue(e.target.value);
                                }}
                                value={searchInputValue}
                                placeholder={`${t("common.search")} ${DATASTORE.SINGULAR_LOWER}`}
                                className="inputShop border-0 bg-transparent pl-4 text-15 leading-normal text-gray-100 placeholder-gray-100 outline-none ring-transparent focus:border-transparent focus:ring-transparent"
                            />
                        </label>
                        {searchInputValue && (
                            <button className="pr-2" onClick={handleClearInputSearchClick}>
                                <CloseIcon width={10} height={10} fill="rgba(166, 180, 208,1)" />
                            </button>
                        )}
                    </div>
                    <AddButton onClick={handleCreateDatastore} />
                </section>
            </div>
            <CreateOrEditDatastoreModal
                openModal={showCreateDatastoreModal}
                closeModal={closeCreateDatastoreModal}
            />
        </>
    );
};

export default DatastoresHeaderBar;
