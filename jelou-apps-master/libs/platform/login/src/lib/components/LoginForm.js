import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { BeatLoader } from "react-spinners";

import { Input } from "@apps/shared/common";
import { useOnClickOutside } from "@apps/shared/hooks";
import { EyesOffIcon, EyesOnIcon, FiguresLoginLeft, FiguresLoginRight, HandEmoji, JelouLogo } from "@apps/shared/icons";
import { i18n } from "@apps/shared/utils";

import "./LoginForm.css";

const LANGS = [
    { value: "es", label: "Es" },
    { value: "en", label: "En" },
    { value: "pt", label: "Pt" },
];

const LoginForm = (props) => {
    const {
        handleSubmit,
        handleChange,
        errors,
        isLoading,
        //  handleSocialRes
    } = props;
    const { t } = useTranslation();
    const [currentLang, setCurrentLang] = useState(localStorage.getItem("lang") || "Es");
    const [showLang, setShowLang] = useState(false);
    const [passVisibility, setPassVisibility] = useState(false);
    const ref = useRef();
    const classInputPassw =
        "border text-15 border-gray-35 focus:!border-blue-200  focus:shadow focus:!shadow-blue-200  w-full border-spacing-[0.98rem] rounded-[0.7125rem] !bg-white text-black disabled:!bg-white placeholder:!text-15";

    useOnClickOutside(ref, () => setShowLang(false));
    const renderErrors = (errors, t) => {
        if (!isEmpty(errors)) {
            return <span className="text-xs font-normal text-red-675">{errors[currentLang]}</span>;
        }
    };
    useEffect(() => {
        const language = get(localStorage, "lang", "es");
        localStorage.setItem("lang", language);
    }, []);

    const togglePasswordVisibility = (setterPassword) => {
        setterPassword((prevState) => !prevState);
    };

    const setLanguage = (value) => {
        localStorage.setItem("lang", value);
        setCurrentLang(value);
        setShowLang(false);
        i18n.changeLanguage(value);
    };

    return (
        <div className="w-full flex-col !bg-gray-81">
            <header className="absolute top-2 right-2 z-20 flex justify-end pt-4 pr-4">
                <div
                    className="relative cursor-pointer rounded-full bg-primary-400 px-4 py-1"
                    onClick={() => {
                        setShowLang(!showLang);
                    }}
                    ref={ref}
                >
                    <div className="flex items-center">
                        <div className="mr-1 uppercase text-gray-450">{currentLang}</div>

                        <svg width="1.25rem" height="1.375rem" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 6L8 10L12 6" stroke="#00b3c7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    {showLang && (
                        <div className="absolute right-0 mt-2 w-24 cursor-pointer overflow-hidden rounded-lg bg-primary-400">
                            {LANGS.map((lang, index) => {
                                return (
                                    <div
                                        className="flex h-8 justify-end overflow-hidden p-1 pr-5 uppercase text-gray-450 hover:bg-primary-200 hover:text-white"
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

            <div className="relative h-screen">
                <div className=" flex pl-4 pt-4 sm:pl-8 sm:pt-8">
                    <JelouLogo className="fill-current " fill="none" />
                </div>

                <div className="absolute inset-0 z-10 flex flex-1 flex-col justify-center p-5 sm:!-top-[16%] sm:p-0 lg:flex-none">
                    <div className="mx-auto w-full max-w-sm">
                        <div className="">
                            <div className="py-1">
                                <HandEmoji viewBox="0 0 50 45" />
                            </div>
                            <div className="mb-4">
                                <div className="mb-2 flex items-center">
                                    <div className="mr-2 text-2xl font-semibold text-gray-610">{t("login.hello")}</div>
                                </div>
                            </div>
                            <form action="#" onSubmit={handleSubmit} method="POST">
                                <div className="flex flex-col space-y-4">
                                    <label htmlFor="email">
                                        <span className="mb-1 block pl-4 text-15 font-bold text-gray-610 ">{t("login.email")}</span>
                                        <Input className={classInputPassw} id="email" type="email" required name="email" onChange={handleChange} placeholder={t("login.placeHolderEmail")} />
                                    </label>
                                    <label htmlFor="password">
                                        <span className="mb-1 block pl-4 text-15 font-bold text-gray-610 ">{t("login.password")}</span>
                                        <div className="relative">
                                            <div className="absolute top-[20%] right-[4%]">
                                                <button type="button" onClick={() => togglePasswordVisibility(setPassVisibility)}>
                                                    {passVisibility && <EyesOnIcon className="fill-current text-gray-400" width="22" height="22" />}
                                                    {!passVisibility && <EyesOffIcon className="fill-current text-gray-400" width="22" height="22" />}
                                                </button>
                                            </div>
                                            <Input
                                                className={classInputPassw}
                                                id="password"
                                                type={passVisibility === true ? "text" : "password"}
                                                required
                                                onChange={handleChange}
                                                name="password"
                                                placeholder={t("login.placeHolderPass")}
                                            />
                                        </div>
                                    </label>
                                    <div className="flex w-full justify-end">
                                        <Link to="/recover-password" className=" block cursor-pointer text-right font-bold text-primary-200  hover:underline lg:text-base">
                                            {t("login.forgotpassword")}
                                        </Link>
                                    </div>
                                </div>
                                {!isEmpty(errors) && <div className="mt-2 text-right">{renderErrors(errors)}</div>}
                                <div className="mt-6 flex w-full flex-col justify-end md:flex-row">
                                    <div className="mt-6 flex w-full items-center justify-center text-center md:mt-0">
                                        <button type="submit" className="button-gradient !mx-1 !w-full !py-2" disabled={isLoading}>
                                            {isLoading ? <BeatLoader color={"white"} size={"0.625rem"} /> : `${t("login.initsesion")}`}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 right-0 z-0 hidden overflow-hidden sm:inline-block">
                    <FiguresLoginRight />
                </div>
                <div className="absolute bottom-0 left-0 z-0 hidden overflow-hidden sm:inline-block">
                    <FiguresLoginLeft />
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
