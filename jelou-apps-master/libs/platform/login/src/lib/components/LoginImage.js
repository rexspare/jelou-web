import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import dayjs from "dayjs";

const LoginImage = (props) => {
    const [time, setTime] = useState(dayjs().locale("es").format("HH:mm"));
    const [currentLang] = useState(localStorage.getItem("lang") || "es");

    useEffect(() => {
        const id = setInterval(function () {
            setTime(dayjs().locale("es").format("HH:mm"));
        }, 10 * 1000);
        return () => {
            clearInterval(id);
        };
    }, []);

    const { t } = props;

    return (
        <div className="bg-login h-full w-full">
            <div className="ml-10 flex h-full flex-col justify-end">
                <div className="mb-20">
                    <div className="font-bold text-white opacity-50 mid:text-xl xxl:text-2xl">
                        {dayjs().locale(`${currentLang}`).format("DD MMMM YYYY")}
                    </div>
                    <div className="text-7xl font-bold leading-normal text-white">{time}</div>
                    <div className="w-3/5 font-semibold text-white mid:text-lg xxl:text-2xl">
                        {t("Ayuda a resolver los")} <br /> {t("problemas de tus usuarios")}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withTranslation()(LoginImage);
