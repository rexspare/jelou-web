/* eslint-disable jsx-a11y/anchor-is-valid */
import get from "lodash/get";
import first from "lodash/first";
import isEmpty from "lodash/isEmpty";
import { Link, Navigate } from "react-router-dom";
import { Transition } from "@headlessui/react";
import { useState, useRef } from "react";

import { Input, Google, Facebook } from "@apps/platform/ui-shared";
import { DashboardServer } from "@apps/shared/modules";
import { useTranslation } from "react-i18next";
import { JelouIcon, JelouLogoIcon } from "@apps/platform/ui-shared";
import { useOnClickOutside } from "@apps/shared/hooks";

const renderErrors = (errors, t) => {
    if (!isEmpty(errors)) {
        return <span className="text-xs font-normal text-red-675">{errors}</span>;
    }
};

const RegisterForm = (props) => {
    const { setIsLogged } = props;
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState("");
    const [session, setSession] = useState(false);
    const [open, setOpen] = useState(false);
    const isMounted = useRef(null);
    const ref = useRef();
    const { t } = useTranslation();
    const lang = localStorage.getItem("lang");

    let config = {
        headers: { "Accept-Language": "es" },
    };

    const handleChange = ({ target }) => {
        const { value, name } = target;

        if (name === "email") {
            setEmail(value);
        }

        if (name === "name") {
            setName(value);
            localStorage.setItem("userName", value);
        }

        if (name === "password") {
            setPassword(value);
        }
    };

    useOnClickOutside(ref, () => {
        setOpen(false);
    });

    const handleSocialResponse = async (sesionData) => {
        try {
            const resp = await DashboardServer.post(`/auth/register/social`, sesionData, config);
            const { data } = resp;
            localStorage.setItem("jwt", data.data.token);
            setLoading(false);
            // Controlling memory leak
            if (isMounted.current) {
                const { data } = resp;
                setErrors(data);
            }

            if (resp.status === 200) {
                setSession(true);
                setIsLogged(true);
            }
        } catch (error) {
            const { response } = error;
            const { data } = response;
            const { message, email } = data;

            setLoading(false);
            setErrors(first(message) || first(email));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const dataIn = {
            email,
            password,
            names: name,
            lang: localStorage.getItem("lang"),
        };

        try {
            const resp = await DashboardServer.post(`/auth/register`, dataIn, config);
            const { data } = resp;
            localStorage.setItem("jwt", data.data.token);
            // setIsLogged(true);

            setLoading(false);
            // Controlling memory leak
            if (isMounted.current) {
                const { data } = resp;
                setErrors(data);
            }

            if (resp.status === 200) {
                setSession(true);
                setIsLogged(true);
            }
        } catch (error) {
            const { response } = error;
            const { data } = response;
            const { message } = data;
            setLoading(false);
            setErrors(get(data, `error.clientMessages.${lang}`, first(message)));
        }

        if (!isEmpty(errors)) {
            return <span className="text-xs font-normal text-red-675">{errors}</span>;
        }
    };

    return (
        <div className="flex h-screen min-h-screen flex-col overflow-hidden bg-white">
            <div className="w-full flex-col">
                <div className="relative h-screen">
                    <div className="hidden xxl:flex">
                        <JelouLogoIcon className="fill-current text-primary-500" width="19.125rem" height="34.5rem" fill="none" />
                        <Link to="/login">
                            <JelouIcon
                                className="absolute inset-0 z-50 m-20 fill-current object-cover text-primary-200"
                                width="11.563rem"
                                height="3.063rem"
                                fill="none"
                            />
                        </Link>
                    </div>
                    <div className="hidden sm:flex xxl:hidden">
                        <JelouLogoIcon className="fill-current text-primary-500" width="12.5rem" height="21.875rem" fill="none" />
                        <Link to="/login">
                            <JelouIcon
                                className="absolute inset-0 z-50 m-12 ml-14 fill-current object-cover text-primary-200"
                                width="7.5rem"
                                height="3.063rem"
                                fill="none"
                            />
                        </Link>
                    </div>
                    <div className="flex sm:hidden">
                        <JelouLogoIcon
                            className="fill-current text-primary-500"
                            width="8.75rem"
                            height="18.188rem"
                            fill="none"
                            style={{ marginTop: -72 }}
                        />
                        <Link to="/login">
                            <JelouIcon
                                className="absolute inset-0 z-50 mx-9 mt-4 fill-current object-cover text-primary-500"
                                width="6rem"
                                height="1.625rem"
                                fill="none"
                            />
                        </Link>
                    </div>

                    <div className="absolute inset-0 flex flex-1 flex-col justify-center p-5 sm:p-0 lg:flex-none">
                        <div className="mx-auto w-full max-w-sm">
                            <div className="mt-20 sm:mt-8">
                                <div className="mb-4">
                                    <div className="flex items-center">
                                        <div className="mr-2 text-3xl font-semibold text-gray-400">{t("register.title")}</div>
                                    </div>
                                </div>
                                <form action="#" onSubmit={handleSubmit} method="POST">
                                    <div className="flex flex-col space-y-4">
                                        <label htmlFor="Nombres">
                                            <span className=" mb-1 block text-xs opacity-50">{t("register.name")}</span>
                                            <Input
                                                className="input-login"
                                                id="nombre"
                                                type="text"
                                                required={true}
                                                name="name"
                                                onChange={handleChange}
                                                placeholder={t("register.name")}
                                            />
                                        </label>
                                        <label htmlFor="email">
                                            <span className=" mb-1 block text-xs opacity-50">{t("register.email")}</span>
                                            <Input
                                                className="input-login"
                                                id="email"
                                                type="email"
                                                required={true}
                                                name="email"
                                                onChange={handleChange}
                                                placeholder={"carlos@website.com"}
                                            />
                                        </label>
                                        <label htmlFor="password">
                                            <span className=" mb-1 block text-xs opacity-50">{t("register.password")}</span>
                                            <Input
                                                className="input-login"
                                                id="password"
                                                type="password"
                                                required={true}
                                                onChange={handleChange}
                                                name="password"
                                                placeholder={"........"}
                                            />
                                        </label>
                                    </div>
                                    {!isEmpty(errors) && <div className="mt-2 text-right">{renderErrors(errors)}</div>}
                                    <div className="mt-6 flex w-full flex-col justify-end md:flex-row">
                                        <div className="mt-6 flex w-full text-center md:mt-0">
                                            <button type="submit" className="button-primary w-full" disabled={loading}>
                                                {t("register.continue")}
                                            </button>
                                        </div>
                                    </div>
                                    <div ref={ref} className="relative">
                                        <Transition
                                            show={open}
                                            enter="transition ease-out duration-200"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                            className="z-50 w-1/2 rounded-xs bg-white shadow-menu">
                                            <div className="text-center font-bold text-gray-400 sm:text-2xl">{t("register.registersuccessful")}</div>
                                        </Transition>
                                    </div>
                                </form>
                                <div className="social-box pt-7">
                                    <div className="lineHorizontal">
                                        {" "}
                                        <span className="px-2">{t("register.o")}</span>{" "}
                                    </div>
                                    <div className="pt-7">
                                        <Facebook handleSocialResponse={handleSocialResponse} />
                                        <Google {...props} handleSocialResponse={handleSocialResponse} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-0 z-0 hidden overflow-hidden xxl:inline-block" style={{ right: "-20%" }}>
                            <svg width="54.188rem" height="28.5rem" viewBox="0 0 867 456" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="433.5" cy="433.5" r="431" stroke="#00B3C7" strokeOpacity="0.1" strokeWidth="5" />
                            </svg>
                        </div>
                        <div
                            className="absolute bottom-0 z-0 hidden overflow-hidden lg:inline-block xxl:hidden"
                            style={{ right: "-20%", top: "53%" }}>
                            <svg width="43.75rem" height="28.5rem" viewBox="0 0 867 456" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="433.5" cy="433.5" r="431" stroke="#00B3C7" strokeOpacity="0.1" strokeWidth="5" />
                            </svg>
                        </div>
                        <div className="absolute bottom-0 right-0 z-0 inline-block sm:hidden" style={{ top: "83%" }}>
                            <svg width="13.25rem" height="10.375rem" viewBox="0 0 212 166" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="177" cy="177" r="177" fill="white" />
                                <circle cx="177" cy="177" r="174.5" stroke="#00B3C7" strokeOpacity="0.1" strokeWidth="5" />
                            </svg>
                        </div>
                        <div></div>
                    </div>
                </div>
            </div>
            {session && <Navigate from="" to="/register-business" replace />}
        </div>
    );
};

export default RegisterForm;
