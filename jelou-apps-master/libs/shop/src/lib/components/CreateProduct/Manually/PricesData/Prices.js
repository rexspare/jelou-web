import { Suspense, useState } from "react";
import {useTranslation} from "react-i18next";

import { PricesTags } from "./Tags";
import { InputNumber } from "./InputNumber";
import { initDefaultTags } from "./utils.colors";
import { validatePriceData } from "./validator.price";
import DeletePriceModal from "../../../Actions/DeletePrice";
import { InputSelector } from "../PrincipalDataPanel/InputSelector";
import { CURRENCIES, NAME_PRICES_INPUTS } from "../../../../constants";

import { Menu , Transition} from '@headlessui/react'

import { Dots } from "@apps/shared/icons";
import { EditIcon } from "@apps/shared/icons";
import { TrashIcon } from "@apps/shared/icons";

import { PRICE_ACTION } from "../../../../constants";
import { checkUUID } from "libs/shop/src/lib/utils/checkUUID";

export function PriceForm({ 
    id, 
    value, 
    currency, 
    productId,
    priceAction,
    setPriceAction,
    addValuesToPrice, 
    setIsSomeEditing,
    tags: defaultTags, 
    handleDeletePrice, 
}) {
    
    const { t } = useTranslation();
    
    const [hasError, setHasError] = useState({});
    const [tags, setTags] = useState(initDefaultTags(defaultTags));
    const [isEditable, setIsEditable] = useState(value === null && currency === null);

    const [defaultValueNumber, setDefaultValueNumber] = useState(value);
    const [defaultValueCurrency, setDefaultValueCurrency] = useState(CURRENCIES && CURRENCIES.length > 0 && currency ? CURRENCIES.filter((option) => currency.includes(String(option.value))) : null);

    const [showDeletePriceModal, setShowDeletePriceModal] = useState(false);

    const handleSavePrice = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        const price = {
            ...data,
            isSaved: true,
            isEdit: priceAction === PRICE_ACTION.EDIT,
            [NAME_PRICES_INPUTS.PRICE_GROUP_TAGS]: tags.map((tag) => tag.name),
        };

        const errors = validatePriceData(price);
        if (errors) {
            setHasError(errors);
            return;
        }

        setPriceAction(PRICE_ACTION.ADD);
        setHasError({});
        addValuesToPrice(id, price);
        setIsEditable(false);
        setIsSomeEditing(false);
    };

    const handleEditPrice = () => {
        setPriceAction(PRICE_ACTION.EDIT);
        setIsEditable(true);
        setIsSomeEditing(true);
    };

    const deletePrice = ()=> {
        if ((currency === null && value === null) || checkUUID(id)) {
            handleDeletePrice(id);
            return;
        }
        setShowDeletePriceModal(true);
    };

    const handleCancelAction = () => {
        if (priceAction === PRICE_ACTION.ADD) {
            deletePrice();
        }
        if (priceAction === PRICE_ACTION.EDIT) {
            setIsEditable(false);
            setDefaultValueNumber(value);
            setTags(initDefaultTags(defaultTags));
            setDefaultValueCurrency(CURRENCIES && CURRENCIES.length > 0 && currency ? CURRENCIES.filter((option) => currency.includes(String(option.value))) : null);
        }
        setIsSomeEditing(false);
        setPriceAction(PRICE_ACTION.ADD);
    }

    const handleChange = (e) => {
        setDefaultValueCurrency(e);
    }

    return (
        <>
            <div className="grid grid-cols-[auto_1rem] items-start gap-1">
                <form onSubmit={handleSavePrice} className="grid gap-4 rounded-12 border-0.5 border-gray-100 p-8">
                    <InputNumber
                        isPrices={true}
                        disabled={!isEditable}
                        value={defaultValueNumber}
                        name={NAME_PRICES_INPUTS.VALUE}
                        setValue={setDefaultValueNumber}
                        label={t("shop.prices.priceLabel")}
                        hasError={hasError[NAME_PRICES_INPUTS.VALUE]}
                        placeholder={t("shop.prices.pricePlaceholder")}
                    />
                    <InputSelector
                        isPrices={true}
                        multiSelect={false}
                        options={CURRENCIES}
                        disabled={!isEditable}
                        onChange={handleChange}
                        value={defaultValueCurrency}
                        name={NAME_PRICES_INPUTS.CURRENCY}
                        label={t("shop.prices.currencyLabel")}
                        hasError={hasError[NAME_PRICES_INPUTS.CURRENCY]}
                        placeholder={t("shop.prices.currencyPlaceholder")}
                    />
                    <PricesTags 
                        tags={tags} 
                        setTags={setTags} 
                        isEditable={isEditable} 
                        error={hasError[NAME_PRICES_INPUTS.PRICE_GROUP_TAGS]} 
                    />
                    {
                        isEditable && (
                        <footer className="flex justify-end w-full gap-3 mt-8">
                            <button 
                                onClick={handleCancelAction} 
                                className="h-10 px-4 text-base font-semibold text-gray-400 rounded-full bg-primary-700"
                            >
                                {t("shop.prices.cancelButton")}
                            </button>
                            <button 
                                type="submit"
                                className="h-10 px-4 text-base font-semibold rounded-full bg-primary-350 text-primary-200"
                            >
                                {t("shop.prices.saveButton")}
                            </button>
                        </footer>
                        )
                    }
                </form>
                <Menu as="div">
                    <Menu.Button as="button" className="h-9 w-7">
                        <div className="rotate-90 mr-5">
                            <Dots width={25} height={25} className="" fill="#00B3C7"/>
                        </div>
                    </Menu.Button>
                    <Transition
                        as="section"
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95">
                        <Menu.Items as="ul" className="absolute mr-2 mb-10 right-0 z-120 w-36 overflow-hidden rounded-10 bg-white shadow-menu">
                            <Menu.Item as="li">
                                <button
                                    disabled={isEditable}
                                    onClick={handleEditPrice}
                                    className="flex gap-2 w-full px-4 py-2 text-left text-13 font-bold text-gray-400 hover:bg-primary-200 hover:bg-opacity-10 hover:text-primary-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                >   
                                    <EditIcon width={15} height={15} fill="currentColor"/>
                                    {t("shop.prices.editButton")}
                                </button>
                            </Menu.Item>
                            <Menu.Item as="li">
                                <button
                                    onClick={deletePrice}
                                    className="flex gap-2 w-full px-4 py-2 text-left text-13 font-bold text-gray-400 hover:bg-primary-200 hover:bg-opacity-10 hover:text-primary-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50" 
                                >
                                    <TrashIcon width={15} height={15} fill="currentColor"/>
                                    {t("shop.prices.deleteButton")}
                                </button>
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
            <Suspense>
                {
                    showDeletePriceModal && (
                    <DeletePriceModal
                        priceId={id}
                        productId={productId}
                        isShow={showDeletePriceModal}
                        handleDeletePrice={handleDeletePrice}
                        closeModal={() => setShowDeletePriceModal(false)}
                    />
                    )
                }
            </Suspense>
        </>
    );
}
