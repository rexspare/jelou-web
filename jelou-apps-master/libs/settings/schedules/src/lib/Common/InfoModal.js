import React, { useRef } from "react";

import { useTranslation } from "react-i18next";

import { CloseIcon } from "@apps/shared/icons";
import { useOnClickOutside } from "@apps/shared/hooks";
import Lottie from "react-lottie";
import watchAnimation from "./watchAnimation.json";

const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: watchAnimation,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
    },
};

const InfoModal = (props) => {
    const { setOpen } = props;

    const ref = useRef();
    const { t } = useTranslation();

    useOnClickOutside(ref, () => {
        return setOpen(false);
    });

    return (
        <div className=" fixed inset-x-0 top-0 z-120 overflow-auto bg-black bg-opacity-25 sm:inset-0 sm:flex sm:items-center sm:justify-center">
            <div className="relative flex h-[30rem] w-[26rem] flex-col items-center justify-center rounded-12 bg-white  shadow-modal" ref={ref}>
                <button onClick={() => setOpen(false)}>
                    <CloseIcon className="absolute top-2 right-2 fill-current text-gray-400" width="1rem" height="1rem" />
                </button>
                <Lottie options={defaultOptions} height={300} width={300} />
                <p className="pb-10  text-center text-xl font-semibold text-primary-200">
                    {t("¡La configuración de horario ha sido duplicada con éxito!")}
                </p>
            </div>
        </div>
    );
};

export default InfoModal;
