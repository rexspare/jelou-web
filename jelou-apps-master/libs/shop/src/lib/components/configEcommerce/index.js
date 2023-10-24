import { useTranslation } from "react-i18next";
import isEmpty from "lodash/isEmpty";
import React from "react";
import SketchPicker from "react-color/lib/components/sketch/Sketch";
import Tippy from "@tippyjs/react";

import { CloseIcon2 as CloseIconBold, ErrorIcon, FileIcon, IconInfo } from "@apps/shared/icons";
import { Modal } from "../Modal";
import { ModalSelectPicker } from "../Modal/ModalPortal";
import { PreviewDivice } from "./previewDivice";
import { useColorInputs } from "../../pages/Activate/hooks/useColorInputs";

export function ConfigEcommerce({
    // emptyValue,
    handleErrorImg,
    handleInputImageChange,
    handleSubmit,
    imagesLogo,
    InputImageLogo,
    // nameCompany,
    // onChangeText,
    onClose,
    setImagesLogo,
    showActivateModal,
    title,
}) {
    const { t } = useTranslation();
    const [openSelectPicker, setSelectPicker] = React.useState({ isOpen: false, color: null });

    const {
        bgAddressColor,
        complementaryColor,
        handleChangeColor,
        InputsColors,
        primaryColor,
        secondaryColor,
        textAddressColor,
        textProductColor,
        whichColorIsSeleted,
    } = useColorInputs();

    const handleOpenSelectPicker = (evt, whichColorOpened) => {
        evt.preventDefault();
        setSelectPicker({ isOpen: true, color: whichColorOpened });
    };

    const closeSelectPicker = () => setSelectPicker({ isOpen: false, color: null });

    return (
        <Modal classNameActivate="p-0" className="w-[55rem] rounded-12" closeModal={onClose} isShow={showActivateModal}>
            <ModalSelectPicker closeModal={closeSelectPicker} isShow={openSelectPicker.isOpen}>
                <div className="flex w-full justify-center">
                    <SketchPicker
                        disableAlpha={true}
                        color={whichColorIsSeleted[openSelectPicker.color]}
                        onChange={(color) => handleChangeColor(color.hex, openSelectPicker.color)}
                    />
                </div>
            </ModalSelectPicker>

            <div className="grid w-full grid-cols-2 ">
                <section className="h-[46rem] overflow-y-scroll p-9">
                    <h1 className="mb-4 text-2xl font-bold text-gray-400">{title}</h1>

                    <form onSubmit={handleSubmit} className="mb-20 flex flex-col gap-4">
                        <div className="text-15">
                            <div className="flex justify-between">
                                <span> Logo </span>
                                {imagesLogo.length > 0 ? (
                                    <button
                                        onClick={(evt) => {
                                            evt.preventDefault();
                                            setImagesLogo([]);
                                        }}
                                        className="ml-2 text-xs text-gray-400">
                                        <CloseIconBold />
                                    </button>
                                ) : (
                                    ""
                                )}
                            </div>
                            {isEmpty(imagesLogo) ? (
                                <>
                                    <input onChange={handleInputImageChange} ref={InputImageLogo} type="file" hidden={true} />
                                    <button
                                        onClick={(evt) => {
                                            evt.preventDefault();
                                            InputImageLogo.current.click();
                                        }}
                                        className="mt-4 flex items-center gap-0.5 text-15 text-primary-200">
                                        <FileIcon />
                                        Adjunta tu logo
                                    </button>
                                </>
                            ) : (
                                <div className={imagesLogo.length > 0 ? "mt-2" : ""}>
                                    {imagesLogo.length > 0 &&
                                        imagesLogo.map((image, i) => {
                                            if (!image.name) return null;
                                            const blob = new Blob([image]);
                                            const url = URL.createObjectURL(blob);
                                            return (
                                                <div key={i} className="h-56 rounded-12 p-2" style={{ backgroundColor: complementaryColor }}>
                                                    <img src={url} alt="Imagen del producto" className="h-full w-full rounded-12 object-contain" />
                                                </div>
                                            );
                                        })}
                                </div>
                            )}
                            {handleErrorImg.error && (
                                <div className="mt-2 flex items-center gap-2 text-15 font-medium">
                                    <ErrorIcon /> <span className="text-red-1010">{handleErrorImg.message}</span>
                                </div>
                            )}
                        </div>

                        {/* <label>
                            <span className="flex items-center gap-2 mb-1 text-15">
                                Nombre
                                <Tippy arrow={false} className="tippyInfoColors" content={"Este campo es opcional"} placement="top" touch={false}>
                                    <span className="cursor-pointer">
                                        <IconInfo />
                                    </span>
                                </Tippy>
                            </span>
                            <input
                                onChange={onChangeText}
                                name="name"
                                className={`block w-full rounded-lg text-15 text-gray-100 focus:ring-transparent ${
                                    emptyValue["name"]
                                        ? "border-2 border-red-950 bg-red-1010 bg-opacity-10 focus:border-red-950"
                                        : "border-none bg-primary-700 focus:border-transparent"
                                }`}
                                value={nameCompany}
                                type="text"
                                placeholder="Escribe el nombre de la empresa"
                            />
                            {emptyValue["name"] && (
                                <div className="flex items-center gap-2 mt-2 font-medium text-15">
                                    <ErrorIcon /> <span className="text-red-1010">{emptyValue["name"]}</span>
                                </div>
                            )}
                        </label> */}

                        <div className="my-2 w-full border-1 border-b-1 border-gray-100 border-opacity-25" />

                        <h2>Colores:</h2>
                        <div className="flex flex-col gap-5">
                            {InputsColors.map((input) => {
                                const { color, label, tippyComponent, type, id } = input;
                                return (
                                    <label key={id} className="grid items-center" style={{ gridTemplateColumns: "9rem 1fr" }}>
                                        <span className="text-15">{label}</span>
                                        <div className="flex h-9 items-center gap-2 overflow-hidden rounded-[0.5625rem] bg-primary-700 pl-3">
                                            <button
                                                onClick={(evt) => handleOpenSelectPicker(evt, type)}
                                                className="h-6 w-8 overflow-hidden rounded-xs border-none focus:border-none"
                                                style={{ backgroundColor: color }}></button>

                                            <span className="flex items-center">
                                                <input
                                                    name={type}
                                                    className="h-9 w-full border-none bg-primary-700 p-0 focus:ring-transparent"
                                                    onChange={(evt) => handleChangeColor(evt.target.value, type)}
                                                    type="text"
                                                    value={color}
                                                />
                                                <Tippy
                                                    arrow={false}
                                                    className="tippyInfoColors"
                                                    content={tippyComponent}
                                                    placement="top"
                                                    touch={false}>
                                                    <span className="cursor-pointer">
                                                        <IconInfo />
                                                    </span>
                                                </Tippy>
                                            </span>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                        {/* right-[2.25rem] */}
                        <footer className="absolute bottom-0 flex h-[6rem] w-[23.35rem] items-end justify-end gap-4 bg-white">
                            <div className="flex h-full items-center justify-end gap-4 pr-4">
                                <button
                                    onClick={(evt) => {
                                        evt.preventDefault();
                                        onClose();
                                    }}
                                    className="h-10 w-28 rounded-20 bg-gray-10 font-semibold text-gray-400">
                                    {t("shop.modal.cancel")}
                                </button>
                                <button type="submit" className="button-gradient">
                                    Activar
                                </button>
                            </div>
                        </footer>
                    </form>
                </section>
                <section className="bg-gray-100 bg-opacity-10">
                    <div className="flex w-full justify-end">
                        <button onClick={onClose} className="m-4">
                            <CloseIconBold />
                        </button>
                    </div>
                    <PreviewDivice
                        imagesLogo={imagesLogo}
                        // nameCompany={nameCompany}
                        bgAddressColor={bgAddressColor}
                        complementaryColor={complementaryColor}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                        textAddressColor={textAddressColor}
                        textProductColor={textProductColor}
                    />
                    <p className="my-5 text-center text-gray-400">Vista Previa</p>
                </section>
            </div>
        </Modal>
    );
}
