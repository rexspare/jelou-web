import { useTranslation } from "react-i18next";

import Icon from "./Icon";

const MonitoringIcon = (props) => {
    const { t } = useTranslation();
    return (
        <div>
            <Icon viewBox="0 0 28 27" className={props.className} width={props.width} height={props.height} fill={props.fill} title="Monitoring">
                <rect x="0.875" y="0.875" width="26.256" height="25.248" rx="3.125" fill="transparent" stroke="currentColor" strokeWidth="1.75" />
                <line x1="8.875" y1="1" x2="8.875" y2="26" stroke="currentColor" strokeWidth="1.75" />
                <line x1="24" y1="9.875" x2="11" y2="9.875" stroke="currentColor" strokeWidth="1.75" />
                <line x1="24" y1="13.875" x2="11" y2="13.875" stroke="currentColor" strokeWidth="1.75" />
                <line x1="24" y1="17.875" x2="18" y2="17.875" stroke="currentColor" strokeWidth="1.75" />
                <line x1="7" y1="7.875" x2="3" y2="7.875" stroke="currentColor" strokeWidth="1.75" />
                <line x1="7" y1="10.875" x2="3" y2="10.875" stroke="currentColor" strokeWidth="1.75" />
            </Icon>
            <p className=" mt-2 text-center text-[0.5rem] leading-3 md:text-[0.6rem]">{t("sideBar.monitoring")}</p>
        </div>
    );
};

export default MonitoringIcon;
