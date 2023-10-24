import { useTranslation } from "react-i18next";
import { v4 as uuid } from "uuid";

import { renderMessage } from "@apps/shared/common";
import { NAME_PRICES_INPUTS, STEPS_IDS } from "../../../../constants";
import { HeaderPanel } from "../HeaderPanel";
import { FooterBtns } from "../PrincipalDataPanel/FooterBtns";
import { PriceForm } from "./Prices";
import { MESSAGE_TYPES } from "@apps/shared/constants";

import { PRICE_ACTION } from "../../../../constants";

import { useState } from "react";

export const PricesData = ({ 
    loading, 
    isUpdate,
    productId, 
    closeModal, 
    pricesList, 
    goBackPanel,
    goToNextPanel, 
    actionProduct,
    setPricesList,
    setIsSomeEditing, 
    }) => {
    
    const { t } = useTranslation();    
    const [priceAction, setPriceAction] = useState(null);

    const comeBackPanel = () => {
        isUpdate ? closeModal() : goBackPanel(STEPS_IDS.PRICES, STEPS_IDS.IMAGES);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (priceAction === PRICE_ACTION.EDIT) {
            renderMessage("Asegúrate de guardar todos los precios antes de continuar", MESSAGE_TYPES.ERROR);
            return;
        }

        if (pricesList.every((price) => price.value !== null)) {
            isUpdate ? actionProduct() : goToNextPanel(STEPS_IDS.PRICES, STEPS_IDS.DATES);
            return;
        }

        renderMessage("Asegúrate de guardar todos los precios antes de continuar", MESSAGE_TYPES.ERROR);
    };

    const handleAddPrice = (event) => {
        event.preventDefault();
        setPriceAction(PRICE_ACTION.ADD);

        const price = {
            id: uuid(),
            [NAME_PRICES_INPUTS.VALUE]: null,
            [NAME_PRICES_INPUTS.CURRENCY]: null,
            [NAME_PRICES_INPUTS.PRICE_GROUP_TAGS]: null,
            isNew: true,
        };
        setPricesList([...pricesList, price]);
        setIsSomeEditing(true);
    };

    const addValuesToPrice = (priceId, data) => {
        setPricesList((preState) => preState.map((price) => (price.id === priceId ? { ...price, ...data } : price)));
    };

    const handleDeletePrice = (priceId) => {
        setPricesList((preState) => preState.filter((price) => price.id !== priceId));
    };

    const labelBtnPrincipal = isUpdate ? t("buttons.save") : t("buttons.next");
    const labelBtnSecondary = isUpdate ? t("buttons.close") : t("buttons.back");

    return (
        <>
            <HeaderPanel closeModal={closeModal} title={t("shop.prices.addPriceTitle")} />

            <div className="h-[29.75rem] space-y-4 overflow-y-auto overflow-x-hidden">
                {pricesList.map((price) => {
                    const {
                        id,
                        [NAME_PRICES_INPUTS.VALUE]: value,
                        [NAME_PRICES_INPUTS.CURRENCY]: currency,
                        [NAME_PRICES_INPUTS.PRICE_GROUP_TAGS]: tagsGroup,
                        tags = [],
                    } = price;

                    const tagsList = tags
                        .map((tag) => tag.name.es).concat(tagsGroup ?? [])
                        .filter((tag, index, self) => self.indexOf(tag) === index);
                    
                    return (
                        <PriceForm
                            id={id}
                            key={id}
                            value={value}
                            tags={tagsList}
                            currency={currency}
                            productId={productId}
                            priceAction={priceAction}
                            setPriceAction={setPriceAction}
                            setIsSomeEditing={setIsSomeEditing}
                            addValuesToPrice={addValuesToPrice}
                            handleDeletePrice={handleDeletePrice}
                        />
                    );
                })}
                <button onClick={handleAddPrice} type="button" className="text-base font-semibold text-primary-200">
                    {t("shop.prices.addPrice")}
                </button>
                {!isUpdate && <span className="block text-[#A6B4D0]">
                    {t("shop.images.optionalStep")}
                </span>}
            </div>

            <form onSubmit={handleSubmit}>
                <FooterBtns
                    loading={loading}
                    closeModal={comeBackPanel}
                    labelBtnPrincipal={labelBtnPrincipal}
                    labelBtnSecondary={labelBtnSecondary}
                />
            </form>
        </>
    );
};
