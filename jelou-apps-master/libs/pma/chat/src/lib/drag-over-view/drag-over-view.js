import React from "react";
import { useTranslation } from "react-i18next";
import Lottie from "react-lottie";
import animation from "./DropZoneAnimation.json";

const DragOverView = () => {
    const { t } = useTranslation();
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animation,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };
    return (
        <section id="dropzoneLeave" className="absolute inset-0 grid place-content-center bg-white">
            <Lottie isStopped={false} isPaused={false} options={defaultOptions} height={300} width={300} />{" "}
            <p className="mx-auto w-72 text-center text-xl font-bold text-gray-400">
                {t("pma.Puedes arrastrar archivos para enviar en esta conversación")}
            </p>
        </section>
    );
};

export default DragOverView;
