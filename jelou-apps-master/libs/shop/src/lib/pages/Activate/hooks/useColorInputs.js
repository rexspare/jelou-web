import { useState } from "react";
import { PrincipalTippy, BgAddressTippy, ComplementaryTippy, SecundaryTippy, TextAddressTippy, TextTippy } from "../../../components/Tippys";

const TYPES_COLORS = {
    bgAddress: "background_address_color",
    complementary: "complementary_color",
    primary: "primary_color",
    secondary: "secundary_color",
    textAddress: "text_address_color",
    textProduct: "text_color",
};

export function useColorInputs() {
    const [primaryColor, setPrimaryColor] = useState("#00B3C7");
    const [complementaryColor, setComplementaryColor] = useState("#00A2CF");
    const [secondaryColor, setSecondaryColor] = useState("#FFFFFF");
    const [bgAddressColor, setBgAddressColor] = useState("#E7FCFF");
    const [textAddressColor, setTextAddressColor] = useState("#00B3C7");
    const [textProductColor, setTextProductColor] = useState("#727C94");

    const whichColorIsSeleted = {
        [TYPES_COLORS.primary]: primaryColor,
        [TYPES_COLORS.secondary]: secondaryColor,
        [TYPES_COLORS.complementary]: complementaryColor,
        [TYPES_COLORS.bgAddress]: bgAddressColor,
        [TYPES_COLORS.textAddress]: textAddressColor,
        [TYPES_COLORS.textProduct]: textProductColor,
    };

    const InputsColors = [
        {
            id: 1,
            label: "Principal",
            color: primaryColor,
            tippyComponent: <PrincipalTippy />,
            type: TYPES_COLORS.primary,
        },
        {
            id: 2,
            label: "Complementario",
            color: complementaryColor,
            tippyComponent: <ComplementaryTippy />,
            type: TYPES_COLORS.complementary,
        },
        {
            id: 3,
            label: "Secundario",
            color: secondaryColor,
            tippyComponent: <SecundaryTippy />,
            type: TYPES_COLORS.secondary,
        },
        {
            id: 4,
            label: "Fondo dirección",
            color: bgAddressColor,
            tippyComponent: <BgAddressTippy />,
            type: TYPES_COLORS.bgAddress,
        },
        {
            id: 5,
            label: "Texto dirección",
            color: textAddressColor,
            tippyComponent: <TextAddressTippy />,
            type: TYPES_COLORS.textAddress,
        },
        {
            id: 6,
            label: "Texto producto",
            color: textProductColor,
            tippyComponent: <TextTippy />,
            type: TYPES_COLORS.textProduct,
        },
    ];

    function handleChangeColor(color, whichColorChange) {
        switch (whichColorChange) {
            case TYPES_COLORS.primary:
                setPrimaryColor(color);
                break;
            case TYPES_COLORS.secondary:
                setSecondaryColor(color);
                break;
            case TYPES_COLORS.complementary:
                setComplementaryColor(color);
                break;
            case TYPES_COLORS.bgAddress:
                setBgAddressColor(color);
                break;
            case TYPES_COLORS.textAddress:
                setTextAddressColor(color);
                break;
            case TYPES_COLORS.textProduct:
                setTextProductColor(color);
                break;
            default:
                break;
        }
    }

    return {
        bgAddressColor,
        complementaryColor,
        handleChangeColor,
        InputsColors,
        primaryColor,
        secondaryColor,
        textAddressColor,
        textProductColor,
        whichColorIsSeleted,
    };
}
