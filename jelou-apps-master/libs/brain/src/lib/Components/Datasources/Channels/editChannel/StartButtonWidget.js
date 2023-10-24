import { InputSelector, TextColorInput, TextInput } from "@apps/shared/common";
import React, { useEffect, useRef, useState } from "react";
import { BorderButtonIcon } from "@apps/shared/icons";
import { Trans, useTranslation } from "react-i18next";
import ImageFileDrop from "./ImageFileDrop";
import { LOGO_SIZE_OPTIONS, POSITION_START_BUTTON_OPTIONS, START_BUTTON_SIZE_OPTIONS } from "../../../../constants";

export default function StartButtonWidget(props) {
    const { setSelectedWidget, startButton = {}, theme = {} } = props;
    const { backgroundColor, logoSize, logoUrl, overflow, size, border = {} } = startButton;
    const { position } = theme;
    const { borderColor, borderWidth } = border;

    const { t } = useTranslation();

    const saveImage = (url) => {
        setSelectedWidget((prev) => ({ ...prev, startButton: { ...prev.startButton, logoUrl: url } }));
    };

    const handleObjectChange = (evt) => {
        const { name, value } = evt.target;
        switch (name) {
            case "backgroundColor":
                setSelectedWidget((prev) => ({
                    ...prev,
                    startButton: { ...prev.startButton, backgroundColor: value },
                }));
                break;
            case "borderWidth":
                setSelectedWidget((prev) => ({
                    ...prev,
                    startButton: { ...prev.startButton, border: { ...prev.startButton.border, borderWidth: value } },
                }));
                break;
            case "borderColor":
                setSelectedWidget((prev) => ({
                    ...prev,
                    startButton: { ...prev.startButton, border: { ...prev.startButton.border, borderColor: value } },
                }));
                break;
            default:
                break;
        }
    };

    const handleColorObject = (color, name) => {
        switch (name) {
            case "backgroundColor":
                setSelectedWidget((prev) => ({
                    ...prev,
                    startButton: { ...prev.startButton, backgroundColor: color?.rgb },
                }));
                break;
            case "borderColor":
                setSelectedWidget((prev) => ({
                    ...prev,
                    startButton: { ...prev.startButton, border: { ...prev.startButton.border, borderColor: color?.rgb } },
                }));
                break;
            default:
                break;
        }
    };

    const handleSelector = (name, option) => {
        switch (name) {
            case "logoSize":
                setSelectedWidget((prev) => ({ ...prev, startButton: { ...prev.startButton, [name]: option.value } }));
                break;
            case "size":
                setSelectedWidget((prev) => ({ ...prev, startButton: { ...prev.startButton, [name]: option.value } }));
                break;
            default:
                break;
        }
    };

    return (
        <div className="flex relative h-[75vh] flex-1 flex-col space-y-5 overflow-y-auto border-l-1 border-gray-34 p-5">
            <div className="flex flex-col space-y-2">
                <span className="font-bold leading-6 text-gray-610">{t("brain.Boton del chat")}</span>
                <span className="text-sm leading-5 text-gray-400">{t("brain.Configura el aspecto del boton flotante del chat, el cual siempre estara visible en la posicion configurada")}</span>
            </div>
            <div className="flex flex-col space-y-2">
                <span className="font-bold leading-6 text-gray-610">{t("brain.Adjunta la imagen del botón del chat")}</span>
                <ImageFileDrop url={logoUrl} saveImage={saveImage} />
            </div>
            <div className="flex flex-col space-y-2 pt-5">
                <div className="flex space-x-6">
                    <div className="flex w-1/2 flex-col space-y-3">
                        <InputSelector
                            label={t("brain.Tamaño del logo")}
                            name={"logoSize"}
                            placeholder={t("common.Selecciona una opcion")}
                            labelClassName="block font-medium mb-1 text-sm text-gray-610 font-semibold"
                            options={LOGO_SIZE_OPTIONS}
                            defaultValue={logoSize}
                            onChange={(opt) => handleSelector("logoSize", opt)}
                            menuListTop
                        />
                        <InputSelector
                            label={t("brain.Tamaño del boton")}
                            name={"size"}
                            placeholder={t("common.Selecciona una opcion")}
                            labelClassName="block font-medium mb-1 text-sm text-gray-610 font-semibold"
                            options={START_BUTTON_SIZE_OPTIONS}
                            defaultValue={size}
                            onChange={(opt) => handleSelector("size", opt)}
                            menuListTop
                        />
                        <TextInput
                            label={t("brain.Borde del boton")}
                            labelClassName="mb-1 block items-center gap-2 text-sm font-semibold text-gray-610"
                            placeholder={"1px"}
                            name={"borderWidth"}
                            icon={<BorderButtonIcon />}
                            className="w-full text-gray-610"
                            defaultValue={borderWidth}
                            value={borderWidth}
                            onChange={handleObjectChange}
                        />
                    </div>
                    <div className="flex w-1/2 flex-col">
                        <TextColorInput
                            label={t("brain.Color de fondo del boton")}
                            name="backgroundColor"
                            color={backgroundColor || ""}
                            onChangeInput={handleObjectChange}
                            onChangeColorPicker={(color) => handleColorObject(color, "backgroundColor")}
                            pickerPosition="br"
                        />
                        <TextColorInput
                            label={t("brain.Color de borde")}
                            name="borderColor"
                            color={borderColor || ""}
                            onChangeInput={handleObjectChange}
                            onChangeColorPicker={(color) => handleColorObject(color, "borderColor")}
                            pickerPosition="br"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
