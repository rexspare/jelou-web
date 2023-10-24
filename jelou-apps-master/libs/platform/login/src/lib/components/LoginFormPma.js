import { useOnClickOutside } from "@apps/shared/hooks";
import { JelouLogoIcon1 } from "@apps/shared/icons";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import J from "./vectors/J";

const renderErrors = (errors, t) => {
    if (!isEmpty(errors)) {
        const lang = localStorage.getItem("lang") || "es";
        const { clientMessages } = errors;
        return <span className="text-11 font-normal text-red-500">{get(clientMessages, lang, t("pma.La contraseña no es correcta"))}</span>;
    }
};

const isMobileApp = {
    AndroidApp: function () {
        return navigator.userAgent.match(/\bAndroid\W+(?:\w+\W+){0,10}?Build\b/g);
    },
    iOSApp: function () {
        return navigator.userAgent.match(/\biPhone|iPad|iPod\W+(?:\w+\W+){0,10}?Build\b/g);
    },
};

const NewLoginForm = (props) => {
    const { handleSubmit, handleChange, errors, isLoading, formRef } = props;
    const { t } = useTranslation();
    const ref = useRef();
    useOnClickOutside(ref, () => setShowLang(false));

    const [showLang, setShowLang] = useState(false);
    const [currentLang, setCurrentLang] = useState(localStorage.getItem("lang") || "Es");

    const [langs] = useState([
        { value: "es", label: "Es" },
        { value: "en", label: "En" },
        { value: "pt", label: "Pt" },
    ]);

    useEffect(() => {
        const language = get(localStorage, "lang", "es");
        localStorage.setItem("lang", language);
        localStorage.setItem("campaignBanner", "true");
    }, []);

    const setLanguage = (value) => {
        localStorage.setItem("lang", value);
        setCurrentLang(value);
        setShowLang(false);
        window.location.reload();
    };

    const isIOs = isMobileApp.iOSApp();

    return (
        <div className="w-full flex-col mid:w-1/2">
            <div className="relative h-full">
                <div className="hidden xxl:flex">
                    <J width="19.125rem" height="34.5rem" fill="none" />
                    <JelouLogoIcon1 className="absolute inset-0 m-20 fill-current object-cover text-primary-200" width="11.563rem" height="3.063rem" />
                </div>
                <div className="hidden sm:flex xxl:hidden">
                    <J width="12.5rem" height="21.875rem" fill="none" />
                    <JelouLogoIcon1 className="absolute inset-0 m-12 ml-14 fill-current object-cover text-primary-200" width="7.5rem" height="3.063rem" />
                </div>
                <div className="flex sm:hidden">
                    <J width="8.75rem" height="18.188rem" fill="none" style={{ marginTop: -72 }} />
                    <JelouLogoIcon1 className="absolute inset-0 mx-7 mt-4 fill-current object-cover text-primary-200" width="6rem" height="1.625rem" />
                </div>
                <header className="absolute top-0 right-0 z-20 flex justify-end pt-4 pr-4">
                    <div
                        className="relative cursor-pointer rounded-full bg-primary-600 px-4 py-1"
                        onClick={() => {
                            setShowLang(!showLang);
                        }}
                        ref={ref}
                    >
                        <div className="flex items-center">
                            <div className="mr-1 uppercase text-gray-400">{currentLang}</div>

                            <svg width="1.25rem" height="1.375rem" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 6L8 10L12 6" stroke="#00b3c7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        {showLang && (
                            <div className="absolute right-0 mt-2 w-24 cursor-pointer overflow-hidden rounded-lg bg-primary-600">
                                {langs.map((lang, index) => {
                                    return (
                                        <div
                                            className="flex h-8 justify-end overflow-hidden p-1 pr-5 uppercase text-gray-400 hover:bg-primary-200 hover:text-white"
                                            onClick={() => {
                                                setLanguage(lang.value);
                                            }}
                                            key={`lang-${index}`}
                                        >
                                            {lang.label}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </header>

                <div className="absolute inset-0 flex flex-1 flex-col justify-center p-5 sm:p-0 mid:flex-none">
                    <div className="z-20 mx-auto w-full max-w-xs">
                        <div className="mt-20 sm:mt-8">
                            <div className="mb-4">
                                <span role="img" aria-label="hi user!" className="text-2xl font-semibold text-gray-400 sm:text-3xl">
                                    {t("common.multiAgtPanel")} 👋
                                </span>
                                <div className="text-13 text-gray-450 sm:text-sm">{t("Ingresa tus credenciales")}</div>
                            </div>
                            <form action="" onSubmit={handleSubmit} ref={formRef}>
                                <div className="flex flex-col space-y-4">
                                    <label htmlFor="email">
                                        <span className="mb-1 block text-xs font-bold opacity-50">{t("login.email")}</span>
                                        <input
                                            className="h-9 w-full rounded-lg border-transparent bg-gray-10 px-3 text-sm font-medium text-gray-400 placeholder:text-gray-400 placeholder:text-opacity-65 focus:border-[#7dd3fc] focus:ring-[#7dd3fc]"
                                            id="email"
                                            name="email"
                                            type="email"
                                            onChange={handleChange}
                                            required
                                            placeholder={t("Escribe tu correo")}
                                        ></input>
                                    </label>
                                    <label htmlFor="email">
                                        <span className="mb-1 block text-xs font-bold opacity-50">{t("login.password")}</span>
                                        <input
                                            className="h-9 w-full items-center justify-center rounded-lg border-transparent bg-gray-10 px-3 text-sm font-medium text-gray-400 placeholder:text-[3rem] placeholder:text-gray-400 placeholder:text-opacity-65 focus:border-[#7dd3fc] focus:ring-[#7dd3fc]"
                                            id="password"
                                            name="password"
                                            type="password"
                                            onChange={handleChange}
                                            placeholder="........"
                                            required
                                        ></input>
                                    </label>
                                </div>
                                {!isEmpty(errors) && <div className="mt-2 text-right">{renderErrors(errors, t)}</div>}
                                <div className="flex justify-end">
                                    <NavLink to="/forgot" className="my-3 hidden cursor-pointer text-right text-xs text-gray-400 text-opacity-75 hover:underline sm:block">
                                        {t("¿Olvidaste tu contraseña?")}
                                    </NavLink>
                                </div>
                                <div className="mt-4 flex w-full flex-col md:flex-row">
                                    <div className="mt-6 flex w-full items-center justify-center text-center md:mt-0">
                                        <button type="submit" className="login-button-gradient h-[2.4375rem] w-full rounded-10 font-bold text-white" disabled={isLoading}>
                                            {isLoading ? <BeatLoader color={"white"} size={"0.625rem"} /> : `${t("Iniciar sesión")}`}
                                        </button>
                                    </div>
                                </div>

                                {isIOs && (
                                    <div className="z-30 mt-3 flex items-center justify-center text-center md:mt-0 md:hidden">
                                        <a href="https://jelou.ai/contactanos" target="_blank" rel="noreferrer" className="btn-inactive-outline flex w-40 bg-white xxl:w-44">
                                            {t("Registro")}
                                        </a>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewLoginForm;
