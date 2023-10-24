import { Input } from "@apps/platform/ui-shared";
import { renderMessage as renderToastMessage } from "@apps/shared/common";
import { MESSAGE_TYPES } from "@apps/shared/constants";
import { BackArrowIcon, FiguresLoginLeft, FiguresLoginRight, JelouLogo } from "@apps/shared/icons";
import { DashboardServer } from "@apps/shared/modules";
import { i18n } from "@apps/shared/utils";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LANGS = [
    { value: "es", label: "Es" },
    { value: "en", label: "En" },
    { value: "pt", label: "Pt" },
];

const RecoverPasswordForm = (props) => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const navigate = useNavigate();
    const [showLang, setShowLang] = useState(false);
    const ref = useRef();
    const [currentLang, setCurrentLang] = useState(localStorage.getItem("lang") || "Es");

    const classInput =
        "border text-15 border-gray-35 focus:!border-blue-200  focus:shadow focus:!shadow-blue-200  w-full border-spacing-[0.98rem] rounded-[0.7125rem] !bg-white text-black disabled:!bg-white placeholder:!text-15";

    let config = {
        headers: { "Accept-Language": "es" },
    };

    const handleChange = ({ target }) => {
        const { value, name } = target;

        if (name === "email") {
            setEmail(value);
        }
    };
    const setLanguage = (value) => {
        localStorage.setItem("lang", value);
        setCurrentLang(value);
        setShowLang(false);
        i18n.changeLanguage(value);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const dataIn = {
            email,
            generateOtp: true,
        };
        try {
            const resp = await DashboardServer.post(`/auth/recover/password`, dataIn, config);
            // const { data } = resp;
            setLoading(false);

            if (resp.request.status === 200) {
                navigate("/new-password", { state: { email: email } });
            }
        } catch (error) {
            const { response } = error;
            const clientMessage = response?.data?.error?.clientMessages;
            renderToastMessage(clientMessage[lang], MESSAGE_TYPES.ERROR);

            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen min-h-screen flex-col overflow-hidden !bg-gray-81">
            <div>
                <ToastContainer />
            </div>
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
            <div className="w-full flex-col">
                <div className="relative h-screen">
                    <div className=" flex pl-4 pt-4 sm:pl-8 sm:pt-8">
                        <JelouLogo className="fill-current " fill="none" />
                    </div>
                    <div className="absolute inset-0 z-10 flex flex-1 flex-col justify-center p-5 sm:!-top-[20%] sm:p-0 lg:flex-none">
                        <div className="mx-auto w-full max-w-sm">
                            <div className="mt-20 sm:mt-8">
                                <div className="mb-4">
                                    <div className="mb-2 flex items-center">
                                        <div className="mr-2 text-2xl font-semibold text-gray-610">{t("componentRecover.recover")}</div>
                                    </div>
                                    <div className="mb-6 w-[90%] text-sm text-gray-400">{t("componentRecover.sendEmail")}</div>
                                </div>
                                <form action="#" onSubmit={handleSubmit} method="POST">
                                    <div className="flex flex-col space-y-4">
                                        <label htmlFor="email">
                                            <span className="mb-1 block pl-4 text-15 font-bold text-gray-610 ">{t("login.email")}</span>
                                            <Input className={classInput} id="email" type="email" required name="email" onChange={handleChange} placeholder={t("login.placeHolderEmail")} />
                                        </label>
                                    </div>
                                    <div className="mt-6 flex w-full flex-col justify-end md:flex-row">
                                        <div className="mt-6 flex w-full text-center md:mt-0">
                                            <button type="submit" className="button-gradient !mx-1 !w-full !py-2" disabled={loading}>
                                                {loading ? <BeatLoader color={"white"} size={"0.625rem"} /> : `${t("ConfirmationModal.send")}`}
                                            </button>
                                        </div>
                                    </div>
                                    <Link to="/login" className="mt-3 flex items-center justify-center text-center">
                                        <BackArrowIcon className="fill-current text-primary-200" width="0.8rem" height="0.8rem" />
                                        <span className="pl-2 text-15 font-bold text-primary-200 ">{t("componentRecover.backToLogin")}</span>
                                    </Link>
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
        </div>
    );
};

export default RecoverPasswordForm;
