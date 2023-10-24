import { useTranslation } from "react-i18next";

import { SwitchInput, TextColorInput, TextInput } from "@apps/shared/common";
import TextAreaComponent from "../../../../Modal/textAreaComponent";
import { NAME_MAX_LENGTH, NAME_MIN_LENGTH } from "../../../../constants";
import ImageFileDrop from "./ImageFileDrop";

export default function WelcomeBubbleWidget(props) {
    const { tooltipPanel = {}, setSelectedWidget } = props;
    const { backgroundColor = "", backgroundColorGradient = "", logo = {}, message = {}, gradient = false } = tooltipPanel;
    const { title = "", text = "", textColor = "" } = message;

    const { t } = useTranslation();

    const handleObjectChange = (evt) => {
        const { name, value } = evt.target;
        switch (name) {
            case "message.title":
                setSelectedWidget((prev) => ({
                    ...prev,
                    tooltipPanel: { ...prev.tooltipPanel, message: { ...prev.tooltipPanel.message, title: value } },
                }));
                break;
            case "message.text":
                setSelectedWidget((prev) => ({
                    ...prev,
                    tooltipPanel: { ...prev.tooltipPanel, message: { ...prev.tooltipPanel.message, text: value } },
                }));
                break;
            case "message.textColor": {
                setSelectedWidget((prev) => ({
                    ...prev,
                    tooltipPanel: { ...prev.tooltipPanel, message: { ...prev.tooltipPanel.message, textColor: value } },
                }));
                break;
            }
            case "message.backgroundColor": {
                const [type, _name] = name.split(".");
                setSelectedWidget((prev) => ({
                    ...prev,
                    tooltipPanel: { ...prev.tooltipPanel, [type]: { ...prev.tooltipPanel[type], [_name]: value } },
                }));
                break;
            }
            case "backgroundColor":
                setSelectedWidget((prev) => ({
                    ...prev,
                    tooltipPanel: { ...prev.tooltipPanel, backgroundColor: value },
                }));
                break;
            case "backgroundColorGradient":
                setSelectedWidget((prev) => ({
                    ...prev,
                    tooltipPanel: { ...prev.tooltipPanel, backgroundColor: value },
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
                    tooltipPanel: { ...prev.tooltipPanel, [name]: color?.rgb },
                }));
                break;
            case "backgroundColorGradient":
                setSelectedWidget((prev) => ({
                    ...prev,
                    tooltipPanel: { ...prev.tooltipPanel, [name]: color?.rgb },
                }));
                break;
            case "message.textColor": {
                setSelectedWidget((prev) => ({
                    ...prev,
                    tooltipPanel: { ...prev.tooltipPanel, message: { ...prev.tooltipPanel.message, textColor: color?.rgb } },
                }));
                break;
            }
            default:
                setSelectedWidget((prev) => ({
                    ...prev,
                    tooltipPanel: { ...prev.tooltipPanel, [name]: color?.rgb },
                }));
                break;
        }
    };

    const handleSwitch = (check, name) => {
        switch (name) {
            case "maintain":
            case "openOnClick":
                setSelectedWidget((prev) => ({
                    ...prev,
                    tooltipPanel: { ...prev.tooltipPanel, [name]: check },
                }));
                break;
            case "enabled":
                setSelectedWidget((prev) => ({
                    ...prev,
                    tooltipPanel: { ...prev.tooltipPanel, logo: { ...prev.tooltipPanel.logo, [name]: check } },
                }));
                break;
            default:
                break;
        }
    };

    const saveImage = (url) => {
        setSelectedWidget((prev) => ({
            ...prev,
            tooltipPanel: { ...prev.tooltipPanel, logo: { ...prev.tooltipPanel.logo, url } },
        }));
    };

    return (
        <div className="flex h-[75vh] flex-1 flex-col space-y-6 overflow-y-auto border-l-1 border-gray-34 p-5">
            <div className="flex flex-col space-y-2">
                <span className="font-bold leading-6 text-gray-610">{t("brain.Burbuja de bienvenida")}</span>
                <span className="text-sm leading-5 text-gray-400">{t("brain.Configura el aspecto de las burbujas de mensaje que saldran del boton de inicio cada que tengas nuevos mensajes")}</span>
            </div>
            <div className="flex space-x-6">
                <div className="flex w-1/2 flex-col space-y-3">
                    <span className="text-15 font-semibold text-gray-610">{t("brain.Message")}</span>
                    <div className="w-full text-sm">
                        <TextInput
                            label={t("pma.title")}
                            placeholder={"Jelou"}
                            defaultValue={title}
                            name={"message.title"}
                            className="w-full text-gray-610"
                            onChange={handleObjectChange}
                            maxLength={NAME_MAX_LENGTH}
                            minLength={NAME_MIN_LENGTH}
                            length={title?.length}
                        />
                    </div>
                    <div className="w-full text-sm">
                        <TextAreaComponent
                            title={t("brain.Mensaje secundario")}
                            placeholder={"Soy tu agente virtual. Listo para ayudarte"}
                            defaultValue={text}
                            name={"message.text"}
                            className="text-gray-610"
                            length={text?.length}
                            onChange={handleObjectChange}
                            maxLength={NAME_MAX_LENGTH}
                            minLength={NAME_MIN_LENGTH}
                        />
                    </div>
                </div>
                <div className="flex w-1/2 flex-col space-y-2">
                    <SwitchInput
                        label={t("brain.Color de fondo en gradiente")}
                        id="gradient"
                        onChange={(check) => {
                            setSelectedWidget((prev) => ({
                                ...prev,
                                tooltipPanel: { ...prev.tooltipPanel, gradient: check },
                            }));
                        }}
                        labelClassName="flex block text-sm text-gray-400 w-1/2 items-center"
                        // tippyContent={t("brain.Encendido implica un tamaño 24 px, en caso contrario 16 px")}
                        containerClassName="h-11 justify-between"
                        defaultChecked={gradient}
                    />
                    <TextColorInput
                        label={t("brain.Color de fondo")}
                        name="backgroundColor"
                        tippyContent={t("brain.Color de fondo del tooltip. Si no se especifica, se aplicará un gradiente formado por los colores primary y secondary del theme")}
                        onChangeInput={handleObjectChange}
                        onChangeColorPicker={(color) => handleColorObject(color, "backgroundColor")}
                        value={backgroundColor}
                        pickerPosition="br"
                        color={backgroundColor || "#00B3C7"}
                    />
                    {tooltipPanel?.gradient && (
                        <TextColorInput
                            label={""}
                            name="backgroundColorGradient"
                            onChangeInput={handleObjectChange}
                            onChangeColorPicker={(color) => handleColorObject(color, "backgroundColorGradient")}
                            value={backgroundColorGradient}
                            pickerPosition="br"
                            color={backgroundColorGradient || ""}
                        />
                    )}
                    <TextColorInput
                        label={t("brain.Color del texto")}
                        name="message.textColor"
                        // tippyContent={t("brain.Color del ícono de cierre del tooltip. Si no se coloca, el ícono será de color blanco.")}
                        onChangeInput={handleObjectChange}
                        onChangeColorPicker={(color) => handleColorObject(color, "message.textColor")}
                        pickerPosition="br"
                        color={textColor === "light" ? "#FFFFFF" : textColor}
                        value={textColor}
                    />
                    {/* <SwitchInput
                        label={t("brain.Mantain")}
                        name="maintain"
                        defaultChecked={maintain}
                        onChange={handleSwitch}
                        labelClassName="flex block text-sm text-gray-400 w-1/2 items-center"
                        tippyContent={t("brain.Cuando cierre el widget seguirá apareciendo la burbuja de bienvenida")}
                        containerClassName="h-11"
                    />
                    <SwitchInput
                        label={t("brain.Abrir al dar clic")}
                        name="openOnClick"
                        defaultChecked={openOnClick}
                        onChange={handleSwitch}
                        labelClassName="flex block text-sm text-gray-400 w-1/2 items-center"
                        tippyContent={t("brain.Cuando cierre el widget seguirá apareciendo la burbuja de bienvenida")}
                        containerClassName="h-11"
                    /> */}
                </div>
            </div>
            {/* <div className="flex flex-col space-y-2">
                <span className="font-bold leading-6 text-gray-610">{t("brain.Adjunta el logo para mostrar dentro de la burbuja")}</span>
                <SwitchInput
                    label={t("brain.Visualizar logo en burbuja de bienvenida")}
                    name="enabled"
                    defaultChecked={enabled}
                    onChange={handleSwitch}
                    labelClassName="flex block text-sm text-gray-400 w-1/2 items-center"
                    containerClassName="h-11"
                />
                <ImageFileDrop url={url} saveImage={saveImage} />
            </div> */}
        </div>
    );
}
