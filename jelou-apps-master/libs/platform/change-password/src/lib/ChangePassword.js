import { Input } from "@apps/platform/ui-shared";
import { renderMessage as renderToastMessage } from "@apps/shared/common";
import { MESSAGE_TYPES } from "@apps/shared/constants";
import { useOnClickOutside } from "@apps/shared/hooks";
import {
    AlertCircleYellow,
    BackArrowIcon,
    CheckmarkIcon,
    CheckSucces,
    EmailIconOpen,
    EyesOffIcon,
    EyesOnIcon,
    FiguresLoginLeft,
    FiguresLoginRight,
    IconQuestion,
    JelouLogo,
    KeyIcon2,
} from "@apps/shared/icons";
import { DashboardServer } from "@apps/shared/modules";
import { i18n } from "@apps/shared/utils";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import OtpInput from "react-otp-input";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./platform-change-password.module.css";

const LANGS = [
    { value: "es", label: "Es" },
    { value: "en", label: "En" },
    { value: "pt", label: "Pt" },
];

const initialState = {
    eightMinVal: false,
    oneMayusVal: false,
    oneMinusVal: false,
    oneCharSpecialVal: false,
    oneNumberVal: false,
};

const NewPasswordForm = (props) => {
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [passVisibility, setPassVisibility] = useState(false);
    const [passConfVisibility, setPassConfVisibility] = useState(false);
    const [visibleInfo, setVisibleInfo] = useState(false);
    const [lockedButton, setLockedButton] = useState(true);
    const [samePassword, setSamePassword] = useState(null);
    const [errors, setErrors] = useState("");
    const [msgErrorCod, setMsgErrorCod] = useState("");
    const [errorCode, setErrorCode] = useState(false);
    const [addNewPass, setAddNewPass] = useState(false); //*
    const [restoredPassw, setRestoredPassw] = useState(false);
    const [repTokenOtp, setRepTokenOtp] = useState("");
    const [otp, setOtp] = useState("");
    const [valCharSpecial, setValCharSpecial] = useState(null);

    const { t } = useTranslation();
    // const { token } = useParams();
    const [currentLang, setCurrentLang] = useState(localStorage.getItem("lang") || "Es");
    const [showLang, setShowLang] = useState(false);
    const ref = useRef();
    const [stateValPassword, setStateValPassword] = useState(initialState);
    const [codeNumVal, setCodeNumVal] = useState(false);
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const location = useLocation();
    const email = get(location.state, "email", "");
    const navigate = useNavigate();

    useOnClickOutside(ref, () => setShowLang(false));
    let config = {
        headers: { "Accept-Language": "es" },
    };
    useEffect(() => {
        const language = get(localStorage, "lang", "es");
        localStorage.setItem("lang", language);
    }, []);

    useEffect(() => {
        const allValPasswordCompleted = Object.values(stateValPassword).every((param) => param === true);
        setLockedButton(!(samePassword && allValPasswordCompleted && valCharSpecial));
    }, [stateValPassword, samePassword, valCharSpecial]);

    const warningInfoMsg = (setState) => {
        setState(true);
        setTimeout(() => {
            setState(false);
        }, 4000);
    };

    const handleOtp = (eve) => {
        setOtp(eve);
    };
    const togglePasswordVisibility = (setterPassword) => {
        setterPassword((prevState) => !prevState);
    };
    const setLanguage = (value) => {
        localStorage.setItem("lang", value);
        setCurrentLang(value);
        setShowLang(false);
        i18n.changeLanguage(value);
    };
    const classInputPassw =
        "border text-15 border-gray-35 focus:!border-blue-200  focus:shadow focus:!shadow-blue-200  w-full border-spacing-[0.98rem] rounded-[0.7125rem] !bg-white text-black disabled:!bg-white placeholder:!text-15";

    const validationPassword = (value) => {
        const regexLetterMinus = /[a-z]/;
        const regexLetterMayus = /[A-Z]/;
        const regexCharSpecial = /[@$!%*?&.#&_-]/;
        const regexLetterNumber = /[0-9]/;

        setStateValPassword({
            ...stateValPassword,
            eightMinVal: value.length >= 10,
            oneMinusVal: regexLetterMinus.test(value),
            oneMayusVal: regexLetterMayus.test(value),
            oneCharSpecialVal: regexCharSpecial.test(value),
            oneNumberVal: regexLetterNumber.test(value),
        });
    };

    const validationCharSpecial = (value) => {
        const regexLettersNumb = /^([a-zA-Z0-9@$!%*?&.#&\-_\s]+$)/;
        setValCharSpecial(regexLettersNumb.test(value));
    };
    const validationSamePassword = ({ password, passwordConfirm }) => {
        setSamePassword(!isEmpty(passwordConfirm) && !isEmpty(password) ? passwordConfirm === password : null);
    };

    useEffect(() => {
        validationSamePassword({ password, passwordConfirm });
    }, [password, passwordConfirm]);

    const handleChange = ({ target }) => {
        const { value, name } = target;
        if (name === "password") {
            validationPassword(value);
            validationCharSpecial(value);
            setPassword(value);
        }
        if (name === "password2") {
            setPasswordConfirm(value);
        }
    };

    const goToLogin = () => {
        navigate("/login");
        setRestoredPassw(false);
    };
    const resendMail = async (event) => {
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
                renderToastMessage(t("componentChangePassword.reSentok") + email, MESSAGE_TYPES.SUCCESS);
            }
        } catch (error) {
            const { response } = error;
            const clientMessage = response?.data?.error?.clientMessages;
            renderToastMessage(clientMessage[lang], MESSAGE_TYPES.ERROR);

            setLoading(false);
        }
    };
    const handleSubmitCode = async (event) => {
        event.preventDefault();
        if (otp.length < 4) {
            setCodeNumVal(true);
            return false;
        }
        setLoading(true);
        setCodeNumVal(false);
        const dataIn = {
            email,
            otpCode: otp,
        };
        try {
            const resp = await DashboardServer.post(`/auth/validate/otp`, dataIn, config);
            // const { data } = resp;
            setLoading(false);

            if (resp.request.status === 200) {
                const tokenOtp = get(resp.data.data, "token", "");
                setRepTokenOtp(tokenOtp);
                setAddNewPass(true);
                setMsgErrorCod("");
                setErrorCode(false);
            }
        } catch (error) {
            const { response } = error;
            const clientMessage = response?.data?.error?.clientMessages;
            setMsgErrorCod(clientMessage[lang]);
            setLoading(false);
            setAddNewPass(false);
            setErrorCode(true);
        }
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrors("");
        const dataIn = {
            password,
            confirmPassword: passwordConfirm,
            token: repTokenOtp,
        };

        try {
            const resp = await DashboardServer.post(`/auth/reset/password`, dataIn);
            // const { data } = resp;
            if (resp.request.status === 200) {
                setLoading(false);
                setPassword("");
                setPasswordConfirm("");
                setRestoredPassw(true);
            }
        } catch (error) {
            const { response } = error;
            const clientMessage = response?.data?.error?.clientMessages;
            const codeError = response?.data?.error?.code;

            const redirectRecover = () => {
                navigate("/recover-password");
            };
            if (codeError === "E1011") setTimeout(redirectRecover, 4000);

            renderToastMessage(clientMessage[lang], MESSAGE_TYPES.ERROR);

            setLoading(false);
        }
    };
    const hideEmail = (email) => {
        if (isEmpty(email)) {
            return false;
        }
        const [username, domain] = email.split("@");

        const hiddenUsername = username.substring(0, 3) + "...";

        const hiddenEmail = hiddenUsername + "@" + domain;

        return hiddenEmail;
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
                    <div className="absolute inset-0 z-10 flex flex-1 flex-col justify-center p-5 sm:p-0 lg:flex-none">
                        {addNewPass === true && restoredPassw === false ? (
                            <div className="mx-auto w-full max-w-sm">
                                <div className="mt-20 sm:mt-8">
                                    <div className="mx-auto mt-0 mb-6 flex w-fit items-center justify-center rounded-[50%] bg-primary-350 p-3">
                                        <KeyIcon2 />
                                    </div>
                                    <div className="mb-7">
                                        <div className="flex flex-col items-center">
                                            <h4 className="mb-1 w-full text-2xl font-semibold text-gray-610">{t("componentChangePassword.changePassword")}</h4>
                                            <p className="text-sm text-gray-400">{t("componentChangePassword.subText")}</p>
                                        </div>
                                    </div>

                                    <form action="#" onSubmit={handleSubmit} method="POST">
                                        <div className="flex flex-col space-y-4">
                                            <label htmlFor="password">
                                                <span className="mb-1 block pl-4 text-15 font-bold text-gray-610 ">{t("componentChangePassword.password")}</span>
                                                <div className="relative pb-4">
                                                    <div className="absolute top-[20%] right-[4%]">
                                                        <button type="button" onClick={() => togglePasswordVisibility(setPassVisibility)}>
                                                            {passVisibility && <EyesOnIcon className="fill-current text-gray-400" width="22" height="22" />}
                                                            {!passVisibility && <EyesOffIcon className="fill-current text-gray-400" width="22" height="22" />}
                                                        </button>
                                                    </div>
                                                    <Input
                                                        className={classInputPassw}
                                                        id="password1"
                                                        type={passVisibility === true ? "text" : "password"}
                                                        required={true}
                                                        value={password}
                                                        onChange={handleChange}
                                                        name="password"
                                                        placeholder={t("componentChangePassword.repeatPlaceHolder")}
                                                    />
                                                </div>
                                            </label>
                                            {!isEmpty(password) && (
                                                <div className="relative">
                                                    <div className="block items-start justify-center gap-7 pb-3 sm:flex">
                                                        <div className="flex flex-col items-start justify-start text-left">
                                                            <div className="flex py-2">
                                                                <CheckmarkIcon fill={stateValPassword.eightMinVal ? "#18BA81" : "#727C94"} width="16" height="16" />
                                                                <h4 className={`whitespace-nowrap ${stateValPassword.eightMinVal ? "text-gray-610" : "text-gray-400"} pl-1 text-[0.9rem] font-bold`}>
                                                                    {t("password.minimumChar")}
                                                                </h4>
                                                            </div>
                                                            <div className="flex py-2">
                                                                <CheckmarkIcon fill={stateValPassword.oneMayusVal ? "#18BA81" : "#727C94"} width="16" height="16" />
                                                                <h4 className={`whitespace-nowrap ${stateValPassword.oneMayusVal ? "text-gray-610" : "text-gray-400"} pl-1 text-[0.9rem] font-bold`}>
                                                                    {t("password.oneMayus")}
                                                                </h4>
                                                            </div>
                                                            <div className="flex py-2">
                                                                <CheckmarkIcon fill={stateValPassword.oneMinusVal ? "#18BA81" : "#727C94"} width="16" height="16" />
                                                                <h4 className={`whitespace-nowrap ${stateValPassword.oneMinusVal ? "text-gray-610" : "text-gray-400"} pl-1 text-[0.9rem] font-bold`}>
                                                                    {t("password.oneMinus")}
                                                                </h4>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-start justify-start text-left">
                                                            <div className="flex py-2">
                                                                <CheckmarkIcon fill={stateValPassword.oneCharSpecialVal ? "#18BA81" : "#727C94"} width="16" height="16" />
                                                                <h4
                                                                    className={`whitespace-nowrap ${
                                                                        stateValPassword.oneCharSpecialVal ? "text-gray-610" : "text-gray-400"
                                                                    } pl-1 pr-1 text-[0.9rem] font-bold`}
                                                                >
                                                                    {t("password.oneCharSpecial")}
                                                                </h4>
                                                                <button type="button" className="w-full" onClick={() => warningInfoMsg(setVisibleInfo)}>
                                                                    <IconQuestion className="fill-current text-gray-400" width="16" height="16" />
                                                                </button>
                                                            </div>
                                                            <div className="flex py-2">
                                                                <CheckmarkIcon fill={stateValPassword.oneNumberVal ? "#18BA81" : "#727C94"} width="16" height="16" />
                                                                <h4 className={`whitespace-nowrap ${stateValPassword.oneNumberVal ? "text-gray-610" : "text-gray-400"} pl-1 text-[0.9rem] font-bold`}>
                                                                    {t("password.oneNumber")}
                                                                </h4>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {visibleInfo && (
                                                        <Fragment>
                                                            <div className="absolute left-[5%] top-[3%] z-10 h-24 w-73 rounded-10 bg-white text-gray-400 drop-shadow-default sm:left-[103%]">
                                                                <p className="p-4 text-15 ">
                                                                    {t("password.instructionChar")} <span className="font-bold">@$!%*?&.#&-_</span>
                                                                </p>
                                                            </div>
                                                            <div className="absolute top-[12%] left-[100%] hidden sm:block">
                                                                <div className="z-0  inline-block w-3 overflow-hidden">
                                                                    <div className=" h-16  origin-top-right -rotate-45 transform bg-white drop-shadow-default"></div>
                                                                </div>
                                                            </div>
                                                        </Fragment>
                                                    )}
                                                </div>
                                            )}
                                            <label htmlFor="repetir password">
                                                <span className="mb-1 block pl-4 text-15 font-bold text-gray-610">{t("componentChangePassword.repeat")}</span>
                                                <div className="relative">
                                                    <div className="absolute top-[20%] right-[4%]">
                                                        <div className="flex items-center justify-center">
                                                            {samePassword === false && <AlertCircleYellow className=" mr-2" viewBox="0 0 28 28" stroke="#F95A59" />}
                                                            {samePassword === true && <CheckSucces className="mr-2" />}
                                                            <button type="button" onClick={() => togglePasswordVisibility(setPassConfVisibility)}>
                                                                {passConfVisibility && <EyesOnIcon className="fill-current text-gray-400" width="22" height="22" />}
                                                                {!passConfVisibility && <EyesOffIcon className="fill-current text-gray-400" width="22" height="22" />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <Input
                                                        className={
                                                            classInputPassw +
                                                            `${
                                                                samePassword === true
                                                                    ? " !border-green-80 focus:!border-green-80"
                                                                    : samePassword === false
                                                                    ? " !border-red-601 focus:!border-red-601"
                                                                    : ""
                                                            }` +
                                                            " show-passwords"
                                                        }
                                                        id="password2"
                                                        type={passConfVisibility === true ? "text" : "password"}
                                                        required={true}
                                                        onChange={handleChange}
                                                        name="password2"
                                                        value={passwordConfirm}
                                                        placeholder={t("componentChangePassword.passwordPlaceHolder")}
                                                    />
                                                </div>
                                                <div className="flex flex-col items-start justify-start pt-2">
                                                    {samePassword === false && <span className="text-15 font-bold text-red-601">{t("componentChangePassword.noMatch")}</span>}
                                                    {valCharSpecial === false && !isEmpty(password) && <span className="text-15 font-bold text-red-601">{t("password.charNotValid")}</span>}
                                                    {samePassword === true && <span className="text-15 font-bold text-green-80">{t("componentChangePassword.match")}</span>}
                                                </div>
                                            </label>
                                        </div>

                                        <div className=" mt-6 flex w-full flex-col justify-end md:flex-row">
                                            <div className="mt-6 flex w-full text-center md:mt-0">
                                                <button
                                                    type="submit"
                                                    className={` ${lockedButton ? "rounded-20 bg-gray-90 text-gray-34" : "button-gradient"}  !mx-1 !w-full !py-2`}
                                                    disabled={loading || lockedButton}
                                                >
                                                    {loading ? <BeatLoader color={"white"} size={"0.625rem"} /> : `${t("componentChangePassword.resetPassword")}`}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        ) : addNewPass === false && restoredPassw === false ? (
                            <div className="mx-auto w-full max-w-sm">
                                <div className="mt-20 sm:mt-8">
                                    <div className="mx-auto mt-0 mb-6 flex w-fit items-center justify-center rounded-[50%] bg-primary-350 p-2">
                                        <EmailIconOpen />
                                    </div>
                                    <div className="mb-7">
                                        <div className="flex flex-col items-center text-center">
                                            <h4 className="mb-1 w-full text-2xl font-semibold text-gray-610">{t("componentChangePassword.codeTitle")}</h4>
                                            <p className="text-sm text-gray-400">
                                                {t("componentChangePassword.sendEmail")}
                                                <span className="font-bold"> {hideEmail(email)}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <form action="#" onSubmit={handleSubmitCode} method="POST">
                                        <div className="flex flex-col space-y-4">
                                            <label htmlFor="code">
                                                <div className="flex items-center justify-center pb-4 text-center">
                                                    <OtpInput
                                                        value={otp}
                                                        onChange={handleOtp}
                                                        containerStyle={errorCode === true ? styles.errorOtp : styles.validOtp}
                                                        numInputs={4}
                                                        required={true}
                                                        renderInput={(props) => <input {...props} />}
                                                    />
                                                </div>
                                                {errorCode && (
                                                    <div className="flex items-center justify-start ">
                                                        <AlertCircleYellow className=" mr-2" viewBox="0 0 28 28" stroke="#F95A59" />
                                                        <span className="text-15 font-bold text-red-601">{msgErrorCod}</span>
                                                    </div>
                                                )}
                                                {codeNumVal && (
                                                    <div className="flex items-center justify-start ">
                                                        <AlertCircleYellow className=" mr-2" viewBox="0 0 28 28" stroke="#F95A59" />
                                                        <span className="text-15 font-bold text-red-601">{t("password.warningOtp")}</span>
                                                    </div>
                                                )}
                                            </label>
                                        </div>

                                        <div className=" mt-6 flex w-full flex-col justify-end md:flex-row">
                                            <div className="mt-6 flex w-full text-center md:mt-0">
                                                <button type="submit" className=" button-gradient pointer !mx-1 !w-full !py-2" disabled={loading}>
                                                    {loading ? <BeatLoader color={"white"} size={"0.625rem"} /> : `${t("register.continue")}`}
                                                </button>
                                            </div>
                                        </div>
                                        <p className="w-full pt-5 pb-1 text-center">
                                            <span className="pr-1 text-15 text-gray-400">{t("componentChangePassword.questionEmail")}</span>
                                            <button type="button" onClick={(event) => resendMail(event)}>
                                                <span className="text-15 text-primary-200 underline ">{t("componentChangePassword.againSend")}</span>
                                            </button>
                                        </p>
                                        <Link to="/recover-password" onClick={() => setAddNewPass(false)} className="mt-3 flex items-center justify-center text-center">
                                            <BackArrowIcon className="fill-current text-primary-200" width="0.8rem" height="0.8rem" />
                                            <span className="pl-2 text-15 font-bold text-primary-200 ">{t("componentChangePassword.backTolast")}</span>
                                        </Link>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className="mx-auto w-full max-w-s">
                                <div className="mt-20 sm:mt-8">
                                    <div className="mx-auto mt-0 mb-6 flex w-fit items-center justify-center rounded-[50%] bg-primary-350 p-3">
                                        <KeyIcon2 />
                                    </div>
                                    <div className="mb-7">
                                        <div className="flex flex-col items-center">
                                            <h4 className="mb-1 w-full text-2xl font-semibold text-gray-610">{t("componentChangePassword.restoredPasTitle")}</h4>
                                            <p className="text-sm text-gray-400">{t("componentChangePassword.restoredPasText")}</p>
                                        </div>
                                    </div>

                                    <div className=" mt-6 flex w-full flex-col justify-end md:flex-row">
                                        <div className="mt-6 flex w-full text-center md:mt-0">
                                            <button type="button" className="button-gradient !mx-1 !w-full !py-2" onClick={goToLogin}>
                                                {loading ? <BeatLoader color={"white"} size={"0.625rem"} /> : `${t("componentChangePassword.restoredPasButton")}`}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
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

export default NewPasswordForm;
