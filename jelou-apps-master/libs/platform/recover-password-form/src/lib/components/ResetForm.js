import { Navigate, NavLink } from "react-router-dom";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { J } from "@apps/platform/login";
import { useOnClickOutside } from "@apps/shared/hooks";
import { useRef, useState } from "react";
import { JelouLogoIcon1 } from "@apps/shared/icons";
import { useTranslation } from "react-i18next";
import { BeatLoader } from "react-spinners";

const renderErrors = (errors = {}, t) => {
    if (errors) {
        return <span className="text-red text-xs font-normal">{errors}</span>;
    }
};

const renderFeedback = (feedback, t) => {
    if (!isEmpty(feedback)) {
        return (
            <div className="m-auto w-full rounded-md bg-gray-26 p-2.5 text-sm font-normal text-gray-700">
                {t("Cambiado")}
                <NavLink to="/" className="font-medium text-primary-200 underline">
                    {t("Ingresar")}
                </NavLink>
            </div>
        );
    }
};

const ResetForm = (props) => {
    const { handleSubmit, handleChange, errors, loading, feedback, errorsObj, redirectLogin } = props;
    const { t } = useTranslation();
    const ref = useRef();
    useOnClickOutside(ref, () => setShowLang(false));

    const [showLang, setShowLang] = useState(false);
    const [currentLang, setCurrentLang] = useState(localStorage.getItem("lang") || "es");

    const [langs] = useState([
        { value: "es", label: "ES" },
        { value: "en", label: "EN" },
    ]);

    const setLanguage = (value) => {
        localStorage.setItem("lang", value);
        setCurrentLang(value);
        setShowLang(false);
    };

    if (redirectLogin) {
        return <Navigate to={`/login`} exact />;
    }

    return (
        <div className="w-full flex-col sm:w-3/5">
            <div className="relative h-full">
                <div className="hidden xxl:flex">
                    <J width="19.125rem" height="34.5rem" fill="none" />
                    <JelouLogoIcon1 className="absolute inset-0 m-20 object-cover" width="11.563rem" height="3.063rem" fill="none" />
                </div>
                <div className="hidden sm:flex xxl:hidden">
                    <J width="12.5rem" height="21.875rem" fill="none" />
                    <JelouLogoIcon1 className="absolute inset-0 m-12 ml-14 object-cover" width="7.5rem" height="3.063rem" fill="none" />
                </div>
                <div className="flex sm:hidden">
                    <J width="8.75rem" height="18.188rem" fill="none" style={{ marginTop: -72 }} />
                    <JelouLogoIcon1 className="absolute inset-0 mx-7 mt-4 object-cover" width="6rem" height="1.625rem" fill="none" />
                </div>
                <header className="absolute top-0 right-0 z-20 flex justify-end px-4 pt-4">
                    <div
                        className="relative cursor-pointer rounded-full bg-primary-50 px-4 py-1"
                        onClick={() => {
                            setShowLang(!showLang);
                        }}
                        ref={ref}>
                        <div className="flex items-center">
                            <div className="mr-1 uppercase text-gray-450">{currentLang}</div>

                            <svg width="1.25rem" height="1.375rem" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 6L8 10L12 6" stroke="#00b3c7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        {showLang && (
                            <div className="absolute -ml-2 mt-2 w-16 cursor-pointer rounded-lg bg-primary-50">
                                {langs.map((lang, index) => {
                                    return (
                                        <div
                                            className="rounded-lg p-1 text-gray-450 hover:bg-primary-200 hover:text-white"
                                            onClick={() => {
                                                setLanguage(lang.value);
                                            }}
                                            key={`lang-${index}`}>
                                            {lang.label}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </header>

                <div className="absolute inset-0 flex flex-1 flex-col justify-center p-5 sm:p-0 lg:flex-none">
                    <div className="z-20 mx-auto mb-5 w-full max-w-xs sm:mt-0">
                        <div className="mt-20 sm:mt-0">
                            <div className="mb-4">
                                <span role="img" aria-label="change password" className="text-3xl font-semibold text-gray-15">
                                    {t("Cambiar Contraseña")} 👋
                                </span>
                            </div>
                            {!isEmpty(feedback) && <div className="mt-4 mb-4 bg-primary-50 text-center">{renderFeedback("true", t)}</div>}

                            <form action="" onSubmit={handleSubmit}>
                                <div className="flex flex-col space-y-4">
                                    <span className="mb-1 block text-sm opacity-50">{t("Password")}</span>
                                    <input
                                        className="input-primary"
                                        id="password"
                                        placeholder="........"
                                        name="password"
                                        type="password"
                                        onChange={handleChange}></input>
                                    {!isEmpty(errorsObj) && !isEmpty(get(errorsObj, "password", [])) && (
                                        <div className="mt-2 text-right">{errorsObj.password.map((err) => renderErrors(`${err[currentLang]} `))}</div>
                                    )}
                                    <span className=" mb-1 block text-sm opacity-50">{t("Repeat Password")}</span>
                                    <input
                                        className="input-primary"
                                        id="password"
                                        placeholder="........"
                                        name="password2"
                                        type="password"
                                        onChange={handleChange}></input>
                                </div>
                                {!isEmpty(errorsObj) && !isEmpty(get(errorsObj, "confirmPassword", [])) && (
                                    <div className="mt-2 text-right">
                                        {errorsObj.confirmPassword.map((err) => renderErrors(`${err[currentLang]} `))}
                                    </div>
                                )}

                                {!isEmpty(errors) && <div className="mt-2 text-right">{renderErrors(errors)}</div>}

                                <div className="mt-6 flex w-full flex-col justify-end md:flex-row">
                                    <div className="flex items-center justify-center text-center">
                                        <button type="submit" className="btn-primary w-40 xxl:w-44" disabled={loading}>
                                            {loading ? <BeatLoader color={"white"} size={"0.625rem"} /> : `${t("Enviar")}`}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="absolute bottom-0 z-0 hidden overflow-hidden xxl:inline-block" style={{ right: "-49%" }}>
                        <svg width="867" height="456" viewBox="0 0 867 456" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="433.5" cy="433.5" r="431" stroke="#00B3C7" strokeOpacity="0.1" strokeWidth="5" />
                        </svg>
                    </div>
                    <div className="absolute bottom-0 z-0 hidden overflow-hidden lg:inline-block xxl:hidden" style={{ right: "-49%", top: "45%" }}>
                        <svg width="700" height="456" viewBox="0 0 867 456" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="433.5" cy="433.5" r="431" stroke="#00B3C7" strokeOpacity="0.1" strokeWidth="5" />
                        </svg>
                    </div>
                    <div className="absolute right-0 bottom-0 z-0 inline-block sm:hidden" style={{ top: "75%" }}>
                        <svg width="212" height="166" viewBox="0 0 212 166" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="177" cy="177" r="177" fill="white" />
                            <circle cx="177" cy="177" r="174.5" stroke="#00B3C7" strokeOpacity="0.1" strokeWidth="5" />
                        </svg>
                    </div>
                </div>
                <NavLink
                    to="/"
                    className="absolute right-0 bottom-0 hidden cursor-pointer p-5 text-gray-400 hover:underline sm:block lg:text-sm xxl:text-base">
                    {t("Regresar")}
                </NavLink>
                <NavLink to="/" className="absolute bottom-0 block w-full cursor-pointer pb-4 text-center text-gray-400 hover:underline sm:hidden">
                    {t("Regresar")}
                </NavLink>
            </div>
        </div>
    );
};

export default ResetForm;
