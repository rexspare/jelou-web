import React from "react";
import { useDispatch } from "react-redux";
import { useTranslation, withTranslation } from "react-i18next";
import Tippy from "@tippyjs/react";
import { setShowSidebar } from "@apps/redux/store";

const ShowSidebar = (props) => {
    const { show } = props;
    const { t } = useTranslation();
    const dispatch = useDispatch();

    return (
        <Tippy content={show ? t("pma.Cerrar") : t("pma.Abrir")} placement={"left"}>
            {show ? (
                <svg
                    className="absolute right-0 z-50 mt-[3.125rem] hidden cursor-pointer select-none rounded-l-full shadow-normal focus:outline-none mid:block"
                    width="2.5rem"
                    height="2.313rem"
                    viewBox="0 0 40 37"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => dispatch(setShowSidebar(!show))}>
                    <path d="M0 5C0 2.23858 2.23858 0 5 0H41V37H5C2.23858 37 0 34.7614 0 32V5Z" fill="#ffffff" />
                    <path
                        d="M29.176 16.1978C29.4989 16.5251 29.4989 17.0511 29.176 17.3785L24.6472 21.9682C24.3243 22.2955 24.3243 22.8215 24.6472 23.1488L24.8221 23.3261C25.1512 23.6596 25.6896 23.6596 26.0187 23.3261L31.8873 17.3785C32.2103 17.0512 32.2103 16.5251 31.8873 16.1978L26.0187 10.2502C25.6896 9.91661 25.1512 9.91661 24.8221 10.2502L24.6472 10.4274C24.3243 10.7547 24.3243 11.2808 24.6472 11.6081L29.176 16.1978Z"
                        fill="#00B3C7"
                    />
                    <path
                        d="M20.7709 16.1978C21.0939 16.5251 21.0939 17.0511 20.7709 17.3785L16.2422 21.9682C15.9193 22.2955 15.9193 22.8215 16.2422 23.1488L16.4171 23.3261C16.7462 23.6596 17.2845 23.6596 17.6137 23.3261L23.4823 17.3785C23.8052 17.0512 23.8052 16.5251 23.4823 16.1978L17.6137 10.2502C17.2845 9.91661 16.7462 9.91661 16.4171 10.2502L16.2422 10.4274C15.9193 10.7547 15.9193 11.2808 16.2422 11.6081L20.7709 16.1978Z"
                        fill="#00B3C7"
                    />
                </svg>
            ) : (
                <svg
                    className="absolute right-0 z-50 mt-[3.125rem] hidden cursor-pointer select-none rounded-l-full shadow-normal focus:outline-none mid:block"
                    width="2.5rem"
                    height="2.313rem"
                    viewBox="0 0 40 37"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => dispatch(setShowSidebar(!show))}>
                    <path d="M0 5C0 2.23858 2.23858 0 5 0H41V37H5C2.23858 37 0 34.7614 0 32V5Z" fill="#ffffff" />
                    <path
                        d="M18.9532 16.1978C18.6302 16.5251 18.6302 17.0511 18.9532 17.3785L23.4819 21.9682C23.8049 22.2955 23.8049 22.8215 23.4819 23.1488L23.307 23.3261C22.9779 23.6596 22.4396 23.6596 22.1105 23.3261L16.2418 17.3785C15.9189 17.0512 15.9189 16.5251 16.2418 16.1978L22.1105 10.2502C22.4396 9.91661 22.9779 9.91661 23.307 10.2502L23.4819 10.4274C23.8049 10.7547 23.8049 11.2808 23.4819 11.6081L18.9532 16.1978Z"
                        fill="#00B3C7"
                    />
                    <path
                        d="M27.3584 16.1978C27.0355 16.5251 27.0355 17.0511 27.3584 17.3785L31.8872 21.9682C32.2101 22.2955 32.2101 22.8215 31.8872 23.1488L31.7123 23.3261C31.3832 23.6596 30.8449 23.6596 30.5157 23.3261L24.6471 17.3785C24.3242 17.0512 24.3242 16.5251 24.6471 16.1978L30.5157 10.2502C30.8449 9.91661 31.3832 9.91661 31.7123 10.2502L31.8872 10.4274C32.2101 10.7547 32.2101 11.2808 31.8872 11.6081L27.3584 16.1978Z"
                        fill="#00B3C7"
                    />
                </svg>
            )}
        </Tippy>
    );
};

export default withTranslation()(ShowSidebar);
