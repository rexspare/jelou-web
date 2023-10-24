import { useTranslation } from "react-i18next";

import Icon from "./Icon";

const MetricsIcon = (props) => {
    const { t } = useTranslation();
    return (
        <div>
            <Icon viewBox="0 0 28 27" className={props.className} width={props.width} height={props.height} fill={props.fill} title={"Métricas"}>
                <path
                    d="M0.875 4C0.875 2.27411 2.27411 0.875 4 0.875H24C25.7259 0.875 27.125 2.27411 27.125 4V20.0969C27.125 20.8065 26.8835 21.4949 26.4402 22.049L25.3222 23.4465L24.0272 25.0006C23.4335 25.7131 22.5539 26.125 21.6265 26.125H4C2.27411 26.125 0.875 24.7259 0.875 23V4Z"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="1.75"
                />
                <path d="M27 19H24C21.7909 19 20 20.7909 20 23V26" stroke="currentColor" strokeWidth="1.75" />
                <path
                    d="M5.5 17L9.7547 12.7453C10.1598 12.3402 10.8218 12.3576 11.2051 12.7834L14.1864 16.096C14.6078 16.5642 15.3518 16.5309 15.7297 16.0271L19.5 11"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                />
                <path d="M17 10.5L20.5 9L21.5 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </Icon>
            <p className="mt-1 text-center text-[0.5rem] md:text-[0.6rem]">{t("sideBar.metrics")}</p>
        </div>
    );
};
export default MetricsIcon;
