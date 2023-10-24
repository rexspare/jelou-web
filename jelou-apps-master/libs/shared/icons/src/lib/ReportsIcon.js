import Icon from "./Icon";

import { useTranslation } from "react-i18next";

const ReportsIcon = (props) => {
    const { t } = useTranslation();
    return (
        <div>
            <Icon viewBox="0 0 24 24" className={props.className} width={props.width} height={props.height} fill={props.fill} title={"Datos"}>
                <path d="m18.25 20h-12.5c-.414 0-.75-.336-.75-.75v-10.5c0-.414.336-.75.75-.75h12.5c.414 0 .75.336.75.75v10.5c0 .414-.336.75-.75.75zm-11.75-1.5h11v-9h-11z" />
                <path d="m9.75 20c-.414 0-.75-.336-.75-.75v-10.5c0-.414.336-.75.75-.75s.75.336.75.75v10.5c0 .414-.336.75-.75.75z" />
                <path d="m18.25 14.75h-12.5c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h12.5c.414 0 .75.336.75.75s-.336.75-.75.75z" />
                <path d="m21.25 23h-18.5c-1.517 0-2.75-1.233-2.75-2.75v-16.5c0-1.517 1.233-2.75 2.75-2.75h18.5c1.517 0 2.75 1.233 2.75 2.75v16.5c0 1.517-1.233 2.75-2.75 2.75zm-18.5-20.5c-.689 0-1.25.561-1.25 1.25v16.5c0 .689.561 1.25 1.25 1.25h18.5c.689 0 1.25-.561 1.25-1.25v-16.5c0-.689-.561-1.25-1.25-1.25z" />
                <path d="m23.25 6h-22.5c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h22.5c.414 0 .75.336.75.75s-.336.75-.75.75z" />
            </Icon>
            <p className=" mt-1 text-center text-[0.5rem] leading-3 md:text-[0.6rem]">{t("sideBar.datum")}</p>
        </div>
    );
};
export default ReportsIcon;
