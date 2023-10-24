import { useState, Suspense } from "react";

import { Modal } from "../../Modal";
import { DatesData } from "./DatesData";
import { PricesData } from "./PricesData";
import { renderMessage } from "@apps/shared/common";
import { UploadImagesData } from "./UploadImagesData";
import { MESSAGE_TYPES } from "@apps/shared/constants";
import { UptatingNav, NavigationModal } from "./Navigations";
import { INIT_STEPS_LIST, STEPS_IDS } from "../../../constants";
import { useCreateOrUpdateProduct } from "./createOrUpdateProduct";
import { PrincipalDataForm } from "./PrincipalDataPanel/PrincipalDataForm";

import { useTranslation } from "react-i18next";

import { getAllPriceOfOneProduct } from "../../../services/prices";

import { checkUUID } from "../../../utils/checkUUID";
import SavePriceModal from "./PricesData/SavePriceModal";

const initialProduct = (productData, isUpdate) => (isUpdate ? productData : {});
const initialPricesList = (pricesListDefault, isUpdate) => (isUpdate ? pricesListDefault : []);

const CreateProductModal = ({
    closeModal,
    isShow = false,
    isUpdate = false,
    pricesListDefault,
    refreshProductList,
    product: defaultProductData,
} = {}) => {
    
    const { t } = useTranslation();
    const [step, setStep] = useState(STEPS_IDS.PRINCIPAL_DATA);
    const [stepsList, setStepsList] = useState(INIT_STEPS_LIST);

    const [product, setProduct] = useState(initialProduct(defaultProductData, isUpdate));
    const [pricesList, setPricesList] = useState(initialPricesList(pricesListDefault, isUpdate));
    const [isSomeEditing, setIsSomeEditing] = useState(false);

    const [desiredStep, setDesiredStep] = useState(null);
    const [showSavePriceModal, setShowSavePriceModal] = useState(false);

    const closeAndClear = () => {
        setStep(STEPS_IDS.PRINCIPAL_DATA);
        setStepsList(INIT_STEPS_LIST);
        setProduct({});
        closeModal();
    };

    const { loading, createProduct, updateProduct } = useCreateOrUpdateProduct();

    const handleActionProduct = (data, shouldCloseModal = false) => {
        const newProduct = { ...product, ...data };

        const action = isUpdate ? updateProduct : createProduct;
        action(newProduct, pricesList).then(async () => {
            refreshProductList();
            shouldCloseModal && closeModal();
            const message = isUpdate ? "Producto actualizado correctamente" : "Producto creado correctamente";
            renderMessage(message, MESSAGE_TYPES.SUCCESS);
            const prices = await getAllPriceOfOneProduct(newProduct.id);
            setPricesList(prices);
        });
    };

    const goToNextPanel = (currentStep, nextStep) => {
        setStepsList((preState) => preState.map((step) => (step.id === currentStep ? { ...step, isComplete: true, isActive: false } : step)));
        setStepsList((preState) => preState.map((step) => (step.id === nextStep ? { ...step, isActive: true } : step)));

        setStep(nextStep);
    };

    const goBackPanel = (currentStep, previousStep, isDesiredStep = false) => {
        if (isSomeEditing && !isDesiredStep && currentStep === STEPS_IDS.PRICES ) {
            setDesiredStep(previousStep);
            setShowSavePriceModal(true);
            return;
        }
        setStepsList((preState) => preState.map((step) => (step.id === currentStep ? { ...step, isActive: false } : step)));
        setStepsList((preState) => preState.map((step) => (step.id === previousStep ? { ...step, isActive: true, isComplete: false } : step)));

        setStep(previousStep);
    };

    const navigateWithSteps = (idStep, isDesiredStep = false) => {
        if ((pricesList.some((price) => checkUUID(price.id)) || isSomeEditing) && !isDesiredStep && idStep !== STEPS_IDS.PRICES) {
            setDesiredStep(idStep);
            setShowSavePriceModal(true);
            return;
        }
        setStepsList((preState) =>
            preState.map((step) => {
                return step.id === idStep ? { ...step, isActive: true } : { ...step, isActive: false };
            })
        );
        setStep(idStep);
        setDesiredStep(null);
    };
    
    const handleContinueAction = () => {
        if (isUpdate) {
            setPricesList(pricesList.filter((price) => !checkUUID(price.id)));
        }else {
            setPricesList(pricesList.filter((price) => price.isSaved));
        }
        setIsSomeEditing(false);
        setShowSavePriceModal(false);
        navigateWithSteps(desiredStep, true);
    }

    const handleAddProductData = (data) => setProduct((prevState) => ({ ...prevState, ...data }));
    
    const PANELS = {
        [STEPS_IDS.PRINCIPAL_DATA]: () => (
            <PrincipalDataForm
                loading={loading}
                product={product}
                isUpdate={isUpdate}
                closeModal={closeAndClear}
                goToNextPanel={goToNextPanel}
                actionProduct={handleActionProduct}
                handleAddProductData={handleAddProductData}
            />
        ),
        [STEPS_IDS.IMAGES]: () => (
            <UploadImagesData
                loading={loading}
                product={product}
                isUpdate={isUpdate}
                goBackPanel={goBackPanel}
                closeModal={closeAndClear}
                goToNextPanel={goToNextPanel}
                actionProduct={handleActionProduct}
                handleAddProductData={handleAddProductData}
            />
        ),
        [STEPS_IDS.PRICES]: () => (
            <PricesData
                loading={loading}
                isUpdate={isUpdate}
                productId={product.id}
                pricesList={pricesList}
                goBackPanel={goBackPanel}
                closeModal={closeAndClear}
                setPricesList={setPricesList}
                goToNextPanel={goToNextPanel}
                setIsSomeEditing={setIsSomeEditing}
                actionProduct={handleActionProduct}
                handleAddProductData={handleAddProductData}
            />
        ),
        [STEPS_IDS.DATES]: () => (
            <DatesData
                loading={loading}
                isUpdate={isUpdate}
                product={product}
                goBackPanel={goBackPanel}
                closeModal={closeAndClear}
                actionProduct={handleActionProduct}
            />
        ),
    };

    return (
        <>
            <Modal isShow={isShow} className="h-92 w-[51.5625rem] rounded-20 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)]" classNameActivate="">
                <div className="grid h-full grid-cols-[17rem_auto]">
                    <section className="bg-primary-350">
                        <h3 className="py-9 pl-12 text-xl font-semibold text-primary-200">
                            {isUpdate && t("shop.prices.editTitle")}
                            {!isUpdate && t("shop.prices.createTitle")}
                        </h3>
                        {isUpdate ? (
                            <UptatingNav stepsList={stepsList} navigateWithSteps={navigateWithSteps} />
                        ) : (
                            <NavigationModal stepsList={stepsList} />
                        )}
                    </section>
                    <section className="px-9">{PANELS[step]()}</section>
                </div>
            </Modal>
            <Suspense>
                {
                    showSavePriceModal && (
                    <SavePriceModal
                        isShow={showSavePriceModal}
                        handleContinueAction={handleContinueAction}
                        closeModal={() => setShowSavePriceModal(false)}
                    />
                    )
                }
            </Suspense>
        </>
    );
};

export default CreateProductModal;
