import React, { useState } from "react";
import Lottie from "react-lottie";
import salesAnimation from "../animations/salesAnimation.json";
import { useNavigate } from "react-router-dom";
import { useEventTracking } from "@apps/shared/hooks";

const CardLink = (props) => {
    const { permission, enabledImg, disabledImg, navigateTo, t, cardTitle, show = true } = props;
    const [showDisabledMsg, setShowDisabledMsg] = useState(false);
    const trackEvent = useEventTracking();
    const navigate = useNavigate();
    const goToApp = (app) => {
        trackEvent("Home Section Click", { Section: navigateTo });
        navigate(app);
    };

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: salesAnimation,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    return show ? (
        !showDisabledMsg ? (
            <button
                className="flex h-40 w-full flex-col items-center justify-center rounded-3xl border-3 border-white bg-white p-2 hover:border-primary-200/15 hover:shadow-data-card disabled:cursor-not-allowed md:h-[20rem] md:p-4 lg:p-6 2xl:p-8"
                onClick={() => goToApp(navigateTo)}
                onMouseEnter={!permission ? () => setShowDisabledMsg(true) : () => ({})}
            >
                <div className="flex h-full items-center place-self-center">
                    {permission ? (
                        <img src={enabledImg} className="h-3/5 lg:h-4/5" alt={cardTitle} loading="lazy" />
                    ) : (
                        <img src={disabledImg} className="h-3/5 lg:h-4/5" alt={cardTitle} loading="lazy" />
                    )}
                </div>
                <div className="flex h-[3.75rem] items-center justify-center  ">
                    <p className={`text-base font-bold md:text-2xl ${permission ? "text-primary-200" : "text-gray-40"}`}>{t(cardTitle)}</p>
                </div>
            </button>
        ) : (
            <div
                onMouseLeave={() => setShowDisabledMsg(false)}
                className="flex h-[20rem] w-full flex-col items-center rounded-3xl border-3 border-white bg-[#F4F4F4] bg-opacity-40  p-6 text-center  text-lg font-medium text-gray-400 hover:border-primary-200/15 hover:shadow-data-card "
            >
                <Lottie style={{ cursor: "default" }} options={defaultOptions} height={"70%"} width={"auto"} />

                <p className="px-4 text-[1rem] ">
                    {t("home.salesMessage")}
                    <a href="mailto:ventas@jelou.ai" className="font-bold">
                        {" "}
                        ventas@jelou.ai
                    </a>
                </p>
            </div>
        )
    ) : null;
};

export default CardLink;
