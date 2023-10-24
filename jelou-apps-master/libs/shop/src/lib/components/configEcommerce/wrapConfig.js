import React from "react";
import { ConfigEcommerce } from ".";
import { useConfigEcommerce } from "../../hooks/configEcommerce";

export function WrapConfig({ showConfig, onCloseConfig }) {
    const {
        defaultOptions,
        // emptyValue,
        // handleActivateShop,
        // handleChangeInputText,
        handleErrorImg,
        handleInputImageChange,
        imagesLogo,
        InputImageLogo,
        // loading,
        nameCompany,
        onClose,
        setImagesLogo,
        // setShowActivateModal,
        // showActivateModal,
    } = useConfigEcommerce();

    const handleClose = () => {
        onClose();
        onCloseConfig();
    };

    return (
        <ConfigEcommerce
            defaultOptions={defaultOptions}
            InputImageLogo={InputImageLogo}
            // emptyValue={emptyValue}
            handleErrorImg={handleErrorImg}
            handleInputImageChange={handleInputImageChange}
            imagesLogo={imagesLogo}
            nameCompany={nameCompany}
            onClose={handleClose}
            // onChangeText={handleChangeInputText}
            handleSubmit={() => {}}
            setImagesLogo={setImagesLogo}
            showActivateModal={showConfig}
            title="Personaliza tu e-commerce"
        />
    );
}
