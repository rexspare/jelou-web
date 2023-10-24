import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { DebounceInput } from "react-debounce-input";
import { CloseIcon, SearchIcon } from "@apps/shared/icons";

export function ActionsTitle({
    title,
    isProduct = false,
    isCategories = false,
    placeholderInputSearch,
    setSearch = () => null,
    isSubscriptions = false,
    handleOpenClick = () => null,
} = {}) {

    const { t } = useTranslation();
    const [searchInputValue, setSearchInputValue] = useState("");

    const permissions = useSelector((state) => state.userSession.permissions);
    const createProductPermissions = permissions?.includes("ecommerce:create_product");
    const createCategoryPermissions = permissions?.includes("ecommerce:create_category");

    const showBtnInProducts = isProduct && createProductPermissions;
    const showBtnInCategories = isCategories && createCategoryPermissions;
    const showBtnInSubscriptions = isSubscriptions && createCategoryPermissions;

    async function handleChange({ target }) {
        const { value } = target;
        setSearchInputValue(value);
        setSearch((preState) => {
            return {
                ...preState,
                search: { search: { value } },
            };
        });
    }

    const handleClearInputSearchClick = (evt) => {
        evt.preventDefault();
        setSearchInputValue("");
        setSearch((preState) => {
            const { search, ...rest } = preState;
            return rest;
        });
    };

    return (
        <div className="flex justify-between pt-4">
            <h1 className="ml-5 text-xl font-bold text-primary-200">{title}</h1>
            <section className="flex gap-3 mr-5">
                <div className="flex h-9 w-[17rem] items-center rounded-20 border-2 border-gray-100 border-opacity-50 px-4">
                    <label className="flex items-center ">
                        <SearchIcon className="fill-current" width="1rem" height="1rem" />
                        <DebounceInput
                            autoFocus
                            type="search"
                            minLength={2}
                            debounceTimeout={500}
                            onChange={handleChange}
                            value={searchInputValue}
                            placeholder={placeholderInputSearch}
                            className="pl-2 font-semibold leading-normal text-gray-100 placeholder-gray-100 bg-transparent border-0 outline-none inputShop text-15 ring-transparent focus:border-transparent focus:ring-transparent"
                        />
                    </label>
                    {searchInputValue && (
                        <button onClick={handleClearInputSearchClick}>
                            <CloseIcon width={10} height={10} fill="rgba(166, 180, 208,1)" />
                        </button>
                    )}
                </div>
                {(showBtnInCategories || showBtnInProducts || showBtnInSubscriptions) && (
                    <button onClick={handleOpenClick} className="button-gradient whitespace-nowrap">
                        <span className="pr-2">+</span>
                        {t("shop.modal.create")}
                    </button>
                )}
            </section>
        </div>
    );
}
