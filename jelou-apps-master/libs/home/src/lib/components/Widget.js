import isEmpty from "lodash/isEmpty";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useEventTracking } from "@apps/shared/hooks";

// import { WIDGET_ALLOWED_COMPANIES } from "libs/shared/constants/src/lib/shared-constants";
import blueIcon from "../illustrations/blue_idea.svg";
import whiteIcon from "../illustrations/white_idea.svg";

export default function Widget({ companyId }) {
    const { NX_REACT_APP_WIDGET_API_KEY } = process.env;
    const { t } = useTranslation();
    const [hover, setHover] = useState(false);
    // const [isCompanyAllowedToSeeWidget, setIsCompanyAllowedToSeeWidget] = useState(false);
    const widgetInstanceRef = useRef(null);
    const trackEvent = useEventTracking();

    const handleHover = () => setHover(true);
    const handleLeave = () => setHover(false);
    const handleClick = () => {
        trackEvent("Support Widget Opened");
        if (!isEmpty(widgetInstanceRef.current)) {
            widgetInstanceRef.current.open();
        }
    };

    /*   useEffect(() => {
    setIsCompanyAllowedToSeeWidget(Boolean(WIDGET_ALLOWED_COMPANIES.find((allowedCompany) => allowedCompany.id === companyId)));
  },[companyId]) */

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://cdn.jelou.ai/widgets/loader.js";
        document.body.appendChild(script);
        try {
            document.addEventListener("jelou-widget:load", () => {
                // eslint-disable-next-line no-undef
                const widgetService = new WidgetService({
                    apiKey: NX_REACT_APP_WIDGET_API_KEY,
                    properties: {
                        hideOnClose: true,
                    },
                });
                widgetService
                    .connect({})
                    .then((instance) => {
                        widgetInstanceRef.current = instance;
                        console.log("Widget success! 🚀");
                    })
                    .catch((err) => console.log("Error connecting to widget service:", err));
            });
        } catch (error) {
            console.log("Error:", error);
        }
    }, []);

    return (
        /* isCompanyAllowedToSeeWidget &&  */
        <button
            className="fixed right-0 top-1/2 z-50 h-44 w-9 rounded-l-[12px] bg-white pb-5 pt-4 text-primary-200 shadow-md hover:bg-primary-200 hover:text-white"
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}
            onClick={handleClick}
        >
            <div className="grid h-full grid-cols-1 grid-rows-2 items-end justify-end" style={{ gridTemplateRows: "70% 30%" }}>
                <p className="inline-block rotate-[270deg] whitespace-nowrap text-base font-bold">{t("common.support")}</p>
                <div className="h-fit">
                    {hover ? <img className="inline-block" src={whiteIcon} alt={"tool"} loading="lazy" /> : <img className="inline-block" src={blueIcon} alt={"tool"} loading="lazy" />}
                </div>
            </div>
        </button>
    );
}
