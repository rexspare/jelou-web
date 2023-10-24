import { InputSelector, SwitchInput, TextColorInput, TextInput } from "@apps/shared/common";
import { DownIcon } from "@apps/shared/icons";
import TextAreaComponent from "../../../../Modal/textAreaComponent";
import { BODY_PANEL_BORDER_OPTIONS, NAME_MAX_LENGTH, NAME_MAX_LENGTH_SUBTITLE, NAME_MIN_LENGTH } from "../../../../constants";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ImageFileDrop from "./ImageFileDrop";
import get from "lodash/get";

export default function GeneralAspectsWidget(props) {
    const { setSelectedWidget, headerPanel = {}, theme = {}, bodyPanel = {} } = props;
    const { t } = useTranslation();

    const { background = "", color: colorHeaderPanel = "", distribution = "", logo = {}, message = {}, stateTextColor = "", title = {}, gradient = false } = headerPanel;

    const { topBorder } = bodyPanel;

    const { vars = {} } = theme;
    const { color = {}, font } = vars;
    const { grey = ["", "", "", ""] } = color;

    const [openAdvancedConfiguration, setOpenAdvancedConfiguration] = useState(false);

    const handleSelector = (name, option) => {
        switch (name) {
            case "topBorder":
                setSelectedWidget((prev) => ({ ...prev, bodyPanel: { ...prev.bodyPanel, [name]: option.value } }));
                break;
        }
    };

    const handleObjectChange = (evt) => {
        const { name, value } = evt.target;
        switch (name) {
            case "secondary":
            case "primary":
            case "userText":
            case "primaryDarker":
            case "userBubble":
            case "errorTxt":
            case "errorBg":
            case "warningTxt":
            case "warningBg":
            case "infoTxt":
            case "infoBg":
            case "successTxt":
            case "successBg":
                setSelectedWidget((prev) => ({
                    ...prev,
                    theme: { ...prev.theme, vars: { ...prev.theme.vars, color: { ...prev.theme.vars.color, [name]: value } } },
                }));
                break;
            case "grey[0]":
            case "grey[1]":
            case "grey[2]":
            case "grey[3]": {
                const arrayGrey = [...grey];
                arrayGrey[parseInt(name.split("[")[1])] = value;

                setSelectedWidget((prev) => ({
                    ...prev,
                    theme: { ...prev.theme, vars: { ...prev.theme.vars, color: { ...prev.theme.vars.color, grey: arrayGrey } } },
                }));
                break;
            }
            case "title.text":
            case "message.description":
            case "message.descriptionTextColor": {
                const [type, _name] = name.split(".");
                setSelectedWidget((prev) => ({
                    ...prev,
                    headerPanel: { ...prev.headerPanel, [type]: { ...prev.headerPanel[type], [_name]: value } },
                }));
                break;
            }
            case "headerPanel.color":
            case "headerPanel.background": {
                const [header, _type] = name.split(".");
                setSelectedWidget((prev) => ({
                    ...prev,
                    [header]: { ...prev[header], [_type]: value },
                }));
                break;
            }
            default:
                break;
        }
    };

    const handleColorObject = (color, name) => {
        switch (name) {
            case "grey[0]":
            case "grey[1]":
            case "grey[2]":
            case "grey[3]": {
                const arrayGrey = [...grey];
                arrayGrey[parseInt(name?.split("[")[1])] = color?.rgb;

                setSelectedWidget((prev) => ({
                    ...prev,
                    theme: { ...prev.theme, vars: { ...prev.theme.vars, color: { ...prev.theme.vars.color, grey: arrayGrey } } },
                }));
                break;
            }
            case "message.descriptionTextColor": {
                const [type, _name] = name.split(".");
                setSelectedWidget((prev) => ({
                    ...prev,
                    headerPanel: { ...prev.headerPanel, [type]: { ...prev.headerPanel[type], [_name]: color?.rgb } },
                }));
                break;
            }
            case "headerPanel.color":
            case "headerPanel.background": {
                const [header, _type] = name.split(".");
                setSelectedWidget((prev) => ({
                    ...prev,
                    [header]: { ...prev[header], [_type]: color?.rgb },
                }));
                break;
            }
            case "secondary":
            case "primary":
            case "userText":
            case "primaryDarker":
            case "userBubble":
            case "errorTxt":
            case "errorBg":
            case "warningTxt":
            case "warningBg":
            case "infoTxt":
            case "infoBg":
            case "successTxt":
            case "successBg":
            default:
                setSelectedWidget((prev) => ({
                    ...prev,
                    theme: { ...prev.theme, vars: { ...prev.theme.vars, color: { ...prev.theme.vars.color, [name]: color?.rgb } } },
                }));
                break;
        }
    };

    const saveImage = (logUrl) => {
        setSelectedWidget((prev) => ({
            ...prev,
            headerPanel: { ...prev.headerPanel, logo: { ...prev.headerPanel.logo, url: logUrl } },
        }));
    };

    const IconFont = () => (
        <div className="flex h-8 w-8 items-center justify-center rounded-4 border-1 border-gray-34 text-xl text-gray-610" style={{ fontFamily: font }}>
            T
        </div>
    );

    return (
        <div className="flex h-[75vh] flex-1 flex-col space-y-5 overflow-y-auto border-l-1 border-gray-34 p-5">
            <div className="flex flex-col space-y-2">
                <span className="text-base font-bold leading-6 text-gray-610">{t("brain.Aspectos generales")}</span>
                <span className="text-sm leading-5 text-gray-400">
                    {t("brain.Configura el aspecto del tema que regira las demas propiedades configurables, como el boton de inicio, la burbuja del panel, entre otros")}
                </span>
            </div>
            <div className="flex flex-col space-y-2">
                <span className="text-sm font-bold leading-6 text-gray-610">{t("brain.Interfaz del chat")}</span>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <SwitchInput
                        label={t("brain.Color de fondo en gradiente")}
                        id="gradient"
                        onChange={(check) => {
                          setSelectedWidget((prev) => ({
                              ...prev,
                              headerPanel: { ...prev.headerPanel, gradient: check },
                          }));
                        }}
                        labelClassName="flex block text-sm text-gray-400 w-1/2 items-center"
                        tippyContent={t("brain.Color de fondo del encabezado del widget chat")}
                        containerClassName="h-11 justify-between"
                        defaultChecked={gradient}
                    />
                    <TextColorInput
                        label={t("brain.Color primario oscuro")}
                        name="primaryDarker"
                        color={color.primaryDarker || ""}
                        onChangeInput={handleObjectChange}
                        onChangeColorPicker={(color) => handleColorObject(color, "primaryDarker")}
                    />
                    <div>
                        {gradient && <TextColorInput
                            label={t("brain.Color primario")}
                            name="primary"
                            color={color.primary || ""}
                            onChangeInput={handleObjectChange}
                            onChangeColorPicker={(color) => handleColorObject(color, "primary")}
                        />}
                    </div>
                    <TextColorInput
                        label={t("brain.Texto")}
                        name="userText"
                        color={color.userText || ""}
                        onChangeInput={handleObjectChange}
                        onChangeColorPicker={(color) => handleColorObject(color, "userText")}
                        pickerPosition="br"
                    />
                   <div>
                        { gradient &&
                        <TextColorInput
                            label={t("brain.Color secundario")}
                            name="secondary"
                            color={color.secondary || ""}
                            onChangeInput={handleObjectChange}
                            onChangeColorPicker={(color) => handleColorObject(color, "secondary")}
                            pickerPosition="br"
                        />}
                   </div>
                    <TextColorInput
                        label={t("brain.Fondo de burbuja usuario")}
                        name="userBubble"
                        color={color.userBubble || ""}
                        onChangeInput={handleObjectChange}
                        onChangeColorPicker={(color) => handleColorObject(color, "userBubble")}
                    />
                </div>
            </div>
            <div className="flex flex-col space-y-2 rounded-4 border-1 border-gray-34">
                <div className="flex h-10 cursor-pointer items-center justify-between px-3 font-bold leading-6 text-gray-610" onClick={() => setOpenAdvancedConfiguration(!openAdvancedConfiguration)}>
                    <span className="text-sm font-bold leading-6 text-gray-610">{t("common.advancedSettings")}</span>
                    <button className="text-gray-610">
                        <DownIcon fill="currentColor" className={openAdvancedConfiguration ? "rotate-180" : "rotate-0"} />
                    </button>
                </div>
                {openAdvancedConfiguration && (
                    <div className="flex flex-col space-y-3 p-4">
                        <InputSelector
                            label={t("brain.Aspecto de esquinas")}
                            name={"topBorder"}
                            labelClassName="block font-medium mb-1 text-15 text-gray-610 font-semibold"
                            options={BODY_PANEL_BORDER_OPTIONS}
                            defaultValue={topBorder}
                            onChange={(opt) => handleSelector("topBorder", opt)}
                            menuListTop
                        />
                        <div className="flex space-x-4">
                            <div className="flex w-1/2 flex-col">
                                <span className="text-sm font-semibold text-gray-400">{t("brain.Colores semanticos")}</span>
                                <TextColorInput
                                    label={t("brain.Texto de error")}
                                    name="errorTxt"
                                    color={color.errorTxt || ""}
                                    onChangeInput={handleObjectChange}
                                    onChangeColorPicker={(color) => handleColorObject(color, "errorTxt")}
                                />
                                <TextColorInput
                                    label={t("brain.Fondo de error")}
                                    name="errorBg"
                                    color={color.errorBg || ""}
                                    onChangeInput={handleObjectChange}
                                    onChangeColorPicker={(color) => handleColorObject(color, "errorBg")}
                                />
                                <TextColorInput
                                    label={t("brain.Texto de alerta")}
                                    name="warningTxt"
                                    color={color.warningTxt || ""}
                                    onChangeInput={handleObjectChange}
                                    onChangeColorPicker={(color) => handleColorObject(color, "warningTxt")}
                                />
                                <TextColorInput
                                    label={t("brain.Fondo de alerta")}
                                    name="warningBg"
                                    color={color.warningBg || ""}
                                    onChangeInput={handleObjectChange}
                                    onChangeColorPicker={(color) => handleColorObject(color, "warningBg")}
                                />
                                <TextColorInput
                                    label={t("brain.Texto de informacion")}
                                    name="infoTxt"
                                    color={color.infoTxt || ""}
                                    onChangeInput={handleObjectChange}
                                    onChangeColorPicker={(color) => handleColorObject(color, "infoTxt")}
                                />
                                <TextColorInput
                                    label={t("brain.Fondo de informacion")}
                                    name="infoBg"
                                    color={color.infoBg || ""}
                                    onChangeInput={handleObjectChange}
                                    onChangeColorPicker={(color) => handleColorObject(color, "infoBg")}
                                />
                                <TextColorInput
                                    label={t("brain.Texto de exito")}
                                    name="successTxt"
                                    color={color.successTxt || ""}
                                    onChangeInput={handleObjectChange}
                                    onChangeColorPicker={(color) => handleColorObject(color, "successTxt")}
                                />
                                <TextColorInput
                                    label={t("brain.Fondo de exito")}
                                    name="successBg"
                                    color={color.successBg || ""}
                                    onChangeInput={handleObjectChange}
                                    onChangeColorPicker={(color) => handleColorObject(color, "successBg")}
                                />
                            </div>
                            <div className="flex w-1/2 flex-col">
                                <span className="text-sm font-semibold text-gray-400">{t("brain.Escala de grises")}</span>
                                <TextColorInput
                                    label="200"
                                    name="grey[0]"
                                    color={grey[0] || ""}
                                    onChangeInput={handleObjectChange}
                                    onChangeColorPicker={(color) => handleColorObject(color, "grey[0]")}
                                    pickerPosition="br"
                                />
                                <TextColorInput
                                    label="400"
                                    name="grey[1]"
                                    color={grey[1] || ""}
                                    onChangeInput={handleObjectChange}
                                    onChangeColorPicker={(color) => handleColorObject(color, "grey[1]")}
                                    pickerPosition="br"
                                />
                                <TextColorInput
                                    label="600"
                                    name="grey[2]"
                                    color={grey[2] || ""}
                                    onChangeInput={handleObjectChange}
                                    onChangeColorPicker={(color) => handleColorObject(color, "grey[2]")}
                                    pickerPosition="br"
                                />
                                <TextColorInput
                                    label="800"
                                    name="grey[3]"
                                    color={grey[3] || ""}
                                    onChangeInput={handleObjectChange}
                                    onChangeColorPicker={(color) => handleColorObject(color, "grey[3]")}
                                    pickerPosition="br"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex flex-col space-y-2 border-t-1 border-gray-34 pt-5">
                <span className="font-bold leading-6 text-gray-610">{t("brain.Encabezado del chat")}</span>
                <span className="text-sm leading-5 text-gray-400">{t("brain.Configura el aspecto del encabezado del chat")}</span>

                <span className="pt-6 text-sm font-semibold text-gray-610">Logo</span>
                <ImageFileDrop url={logo?.url} saveImage={saveImage} />

                <span className="pt-6 pb-4 text-sm font-semibold text-gray-610">{t("brain.Message")}</span>
                <div className="flex space-x-4 mt-2">
                    <div className="flex w-1/2 flex-col">
                        <div className="w-full text-sm">
                            <TextInput
                                label={t("pma.title")}
                                placeholder={"Jelou"}
                                defaultValue={title?.text}
                                name={"title.text"}
                                className="w-full font-normal text-gray-610 "
                                onChange={handleObjectChange}
                                maxLength={NAME_MAX_LENGTH}
                                minLength={NAME_MIN_LENGTH}
                                length={title?.text?.length}
                            />
                        </div>
                        <div className="w-full text-sm">
                            <TextAreaComponent
                                title={t("brain.Subtitle")}
                                placeholder={t("brain.Soy el agente virtual de sorporte")}
                                defaultValue={message?.description}
                                name={"message.description"}
                                className="text-gray-610"
                                length={message?.description?.length}
                                onChange={handleObjectChange}
                                maxLength={NAME_MAX_LENGTH_SUBTITLE}
                                minLength={NAME_MIN_LENGTH}
                            />
                        </div>
                    </div>
                    <div className="flex w-1/2 flex-col space-y-2">
                        <TextColorInput
                            label={t("brain.Color de titulo")}
                            color={colorHeaderPanel || ""}
                            name="headerPanel.color"
                            onChangeInput={handleObjectChange}
                            onChangeColorPicker={(color) => handleColorObject(color, "headerPanel.color")}
                            pickerPosition="tr"
                        />
                        <TextColorInput
                            label={t("brain.Color del mensaje secundario")}
                            color={message?.descriptionTextColor || ""}
                            name="message.descriptionTextColor"
                            onChangeInput={handleObjectChange}
                            onChangeColorPicker={(color) => handleColorObject(color, "message.descriptionTextColor")}
                            pickerPosition="tr"
                        />
                        <TextColorInput
                            label={t("brain.Color de fondo")}
                            color={background || ""}
                            name="headerPanel.background"
                            onChangeInput={handleObjectChange}
                            onChangeColorPicker={(color) => handleColorObject(color, "headerPanel.background")}
                            pickerPosition="tr"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
