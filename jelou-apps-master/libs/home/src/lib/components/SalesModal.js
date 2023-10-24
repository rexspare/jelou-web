import React, { useRef } from "react";
import Lottie from "react-lottie";

import salesAnimation from "../animations/salesAnimation.json";
import { CloseIcon } from "@apps/shared/icons";
import { useOnClickOutside } from "@apps/shared/hooks";

const SalesModal = (props) => {
    const { t, closeModal } = props;
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: salesAnimation,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const salesModal = useRef();

    useOnClickOutside(salesModal, closeModal);
    return (
        <div className="absolute inset-x-0 top-0 z-120 sm:inset-0 sm:flex sm:items-center sm:justify-center">
            <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 z-20 bg-gray-490/75" />
            </div>
            <div
                ref={salesModal}
                className="relative z-[125] flex h-[20rem] w-[30rem] flex-col items-center rounded-3xl border-3 border-white bg-white   p-6 text-center  text-lg font-medium text-gray-400 hover:shadow-data-card ">
                <Lottie style={{ cursor: "default" }} options={defaultOptions} height={"70%"} width={"auto"} />

                <p className="px-4 text-[1rem] ">
                    {t("home.salesMessage")}
                    <a href="mailto:ventas@jelou.ai" className="font-bold">
                        ventas@jelou.ai
                    </a>
                </p>
                <button className="absolute top-0 right-[-2rem] z-[125]" onClick={closeModal}>
                    <CloseIcon className="fill-current text-white" width="1rem" height="1rem" />
                </button>
            </div>
        </div>
    );
};

export default SalesModal;
