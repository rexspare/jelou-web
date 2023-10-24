import React from "react";
import { J } from "@apps/platform/login";
import isEmpty from "lodash/isEmpty";
import { BeatLoader } from "react-spinners";
import { withTranslation } from "react-i18next";
import { NavLink, Link } from "react-router-dom";
import { JelouLogoIcon1 } from "@apps/shared/icons";

const renderErrors = (errors = {}, t) => {
    if (errors) {
        return <span className="text-red text-xs font-normal">{t(errors)}</span>;
    }
};

const renderFeedback = (feedback, t) => {
    if (!isEmpty(feedback)) {
        return <div className="m-auto w-full rounded-10 bg-[#E8F0FE] p-2.5 text-sm font-bold text-[#028594]">{t("Correo enviado")}</div>;
    }
};

const Forgot = (props) => {
    const { handleSubmit, handleChange, errors, loading, t, feedback } = props;

    return (
        <div className="w-full flex-col sm:w-1/2">
            <div className="relative h-full">
                <div className="hidden xxl:flex">
                    <J width="19.125rem" height="34.5rem" fill="none" />
                    <Link to="/">
                        <JelouLogoIcon1
                            className="absolute inset-0 z-100 m-20 fill-current object-cover text-primary-200"
                            width="11.563rem"
                            height="3.063rem"
                        />
                    </Link>
                </div>
                <div className="hidden sm:flex xxl:hidden">
                    <J width="12.5rem" height="21.875rem" fill="none" />
                    <Link to="/">
                        <JelouLogoIcon1
                            className="absolute inset-0 z-100 m-12 ml-14 fill-current object-cover text-primary-200"
                            width="7.5rem"
                            height="3.063rem"
                        />
                    </Link>
                </div>
                <div className="flex sm:hidden">
                    <J width="8.75rem" height="18.188rem" fill="none" style={{ marginTop: -72 }} />
                    <Link to="/">
                        <JelouLogoIcon1
                            className="absolute inset-0 z-100 mx-7 mt-4 fill-current object-cover text-primary-200"
                            width="6rem"
                            height="1.625rem"
                        />
                    </Link>
                </div>
                <div className="absolute inset-0 flex flex-1 flex-col justify-center p-5 sm:p-0 lg:flex-none">
                    <div className="z-20 mx-auto mb-5 w-full max-w-xs sm:mt-0">
                        <div className="mt-20 sm:mt-0">
                            <div className="mb-4">
                                <div className="text-3xl font-semibold text-gray-400">{t("Recover password")}</div>
                            </div>
                            {!isEmpty(feedback) && <div className="mt-4 mb-4 text-center">{renderFeedback("true", t)}</div>}

                            <form action="" onSubmit={handleSubmit} className={`${isEmpty(feedback) ? "block" : "hidden"}`}>
                                <div className="flex flex-col space-y-4">
                                    <label htmlFor="email">
                                        <span className="mb-1 block text-xs font-bold opacity-50">{t("Correo")}</span>
                                        <input
                                            className="h-9 w-full rounded-lg border-transparent bg-gray-10 px-3 text-sm font-medium text-gray-400 placeholder:text-gray-400 placeholder:text-opacity-65 focus:border-[#7dd3fc] focus:ring-[#7dd3fc]"
                                            id="email"
                                            name="email"
                                            type="email"
                                            onChange={handleChange}
                                            required
                                            placeholder={t("Escribe tu correo")}></input>
                                    </label>
                                </div>
                                {!isEmpty(errors) && <div className="mt-2 text-right">{renderErrors(errors, t)}</div>}

                                <div className="mt-6 flex w-full flex-col justify-end md:flex-row">
                                    <div className="flex w-full items-center justify-center text-center">
                                        <button
                                            type="submit"
                                            className="login-button-gradient h-[2.4375rem] w-full rounded-10 font-bold text-white"
                                            disabled={loading}>
                                            {loading ? <BeatLoader color={"white"} size={"0.625rem"} /> : `${t("Enviar")}`}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <NavLink
                    to="/"
                    className="absolute right-0 bottom-0 hidden cursor-pointer p-5 text-xs text-gray-400 text-opacity-75 hover:underline sm:block">
                    {t("Regresar")}
                </NavLink>
                <NavLink
                    to="/"
                    className="absolute bottom-0 block w-full cursor-pointer pb-4 text-center text-xs text-gray-400 text-opacity-75 hover:underline sm:hidden">
                    {t("Regresar")}
                </NavLink>
            </div>
        </div>
    );
};

export default withTranslation()(Forgot);
