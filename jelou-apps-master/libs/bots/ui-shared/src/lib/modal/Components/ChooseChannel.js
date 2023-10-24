import { BeatLoader } from "react-spinners";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import Tippy from "@tippyjs/react";

import "tippy.js/dist/tippy.css";
import { CloseIcon, JelouLogoIcon, Web, Whatsapp, Facebook, Instagram } from "@apps/shared/icons";
import { DashboardServer, initFacebookSdk, facebookAppId, appSecretFB } from "@apps/shared/modules";
import { SearchSelect } from "@apps/shared/common";
import { TYPES_CHANNEL } from "../contants";
import { launchWhatsAppSignup } from "../hooks/whatsAppFB";
import { useSelector } from "react-redux";

const COMPANY_ID_BPS = 285;
const renderErrors = (errors) => {
    if (!isEmpty(errors)) {
        return <span className="text-xs font-normal text-red-675">{errors}</span>;
    }
};

const ChooseChannel = (props) => {
    const { setOpen, loadBots, setShowTab1, setShowTab2, setOpenGuide, setShowFinishLogin } = props;
    const [loading, setLoading] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [channel, setChannel] = useState("");
    const [pageId, setPageId] = useState("");
    const [errors, setErrors] = useState("");
    const [fbSelect, setFbSelect] = useState(false);
    const [igSelect, setIgSelect] = useState(false);
    const [renderWhatsMsg, setRenderWhatsMsg] = useState(false);
    const [accessToken, setAccessToken] = useState(null);
    const [value, setValue] = useState("");
    const [options, setOptions] = useState([]);
    const [loadingWSlogin, setLoadingWSlogin] = useState(false);
    const { t } = useTranslation();
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const company = useSelector((state) => state.company);

    useEffect(() => {
        if (company) initFacebookSdk({ companyId: company.id });
    }, [company]);

    const generateEternalPageToken = (accessToken) => {
        return new Promise((resolve, reject) => {
            window.FB.api(
                "/oauth/access_token",
                "GET",
                {
                    grant_type: "fb_exchange_token",
                    client_id: facebookAppId, // appID
                    client_secret: appSecretFB, // appSecret
                    fb_exchange_token: accessToken, // access Token luego del login
                },
                (response) => {
                    if (response.access_token) {
                        resolve(response.access_token);
                    } else {
                        console.error(response);
                        reject(response);
                    }
                }
            );
        });
    };

    const handleSelect = async (id) => {
        try {
            const page = options.find((page) => page.id === id);
            const accessToken = await generateEternalPageToken(page.access_token);
            setPageId(id);
            setAccessToken(accessToken);
            setValue(id);
        } catch (error) {
            console.log(error);
        }
    };

    const onClose = () => {
        setShowTab2(false);
        setOpen(false);
    };

    const back = () => {
        setShowTab1(true);
        setShowTab2(false);
    };

    const handleSocialResponse = async (token, userId, social) => {
        setOptions([]);
        setLoading(true);

        try {
            const response = await axios.get(`https://graph.facebook.com/${userId}/accounts?fields=name,access_token&access_token=${token}`);
            console.log("~ response de handleSocialResponse", response.data);

            setOptions(response.data.data); //enlista las paginas que administra el usuario
            if (social === TYPES_CHANNEL.INSTAGRAM) {
                setIgSelect(true);
            }
            if (social === TYPES_CHANNEL.FACEBOOK) {
                setFbSelect(true);
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const loginFacebook = async () => {
        setLoadingSubmit(true);
        const authResponse = await window.FB.login(
            function (response) {
                console.log("~ response login Facebook", response);
                setLoading(false);
                const { authResponse } = response;
                if (authResponse) {
                    handleSocialResponse(authResponse.accessToken, authResponse.userID, TYPES_CHANNEL.FACEBOOK);
                }
            },
            { scope: "email,pages_show_list,pages_show_list" }
        );
        setLoadingSubmit(false);

        if (!authResponse) return;
    };

    const loginInstagram = async () => {
        setLoadingSubmit(true);
        const authResponse = await window.FB.login(
            function (response) {
                setLoading(false);
                const { authResponse } = response;
                if (authResponse) {
                    handleSocialResponse(authResponse.accessToken, authResponse.userID, TYPES_CHANNEL.INSTAGRAM);
                }
            },
            {
                scope: "pages_show_list,pages_messaging,pages_read_engagement,instagram_basic,instagram_manage_messages,pages_manage_metadata",
            }
        );
        setLoadingSubmit(false);

        if (!authResponse) return;
    };

    const handleChannel = (e) => {
        const type = e.currentTarget.id;
        setChannel(type);
        setErrors("");
        switch (type) {
            case TYPES_CHANNEL.FACEBOOK:
                setRenderWhatsMsg(false);
                loginFacebook();
                break;

            case TYPES_CHANNEL.INSTAGRAM:
                setRenderWhatsMsg(false);
                loginInstagram();
                break;

            case TYPES_CHANNEL.WHATSAPP:
                setRenderWhatsMsg(true);
                break;

            case TYPES_CHANNEL.WHATSAPP_OFFICIAL:
                setRenderWhatsMsg(false);
                setLoadingWSlogin(true);

                launchWhatsAppSignup()
                    .then((res) => {
                        setShowFinishLogin(true);
                        setShowTab2(false);
                        // console.log({ res });
                    })
                    .catch((err) => {
                        console.log({ err });
                    })
                    .finally(() => {
                        setLoadingWSlogin(false);
                    });
                break;

            default:
                return null;
        }
    };

    const handleSubmit = async () => {
        setLoadingSubmit(true);
        setErrors("");

        let botId = "";
        switch (channel) {
            case TYPES_CHANNEL.FACEBOOK:
                if (value) {
                    botId = value;
                } else {
                    setErrors(t("botsChooseChannel.errorFb"));
                }
                break;

            case TYPES_CHANNEL.INSTAGRAM:
                if (value) {
                    botId = value;
                } else {
                    setErrors(t("botsChooseChannel.errorFb"));
                }
                break;

            case TYPES_CHANNEL.WHATSAPP:
                botId = null;
                break;

            default:
                return null;
        }

        if (!isEmpty(channel) && isEmpty(errors)) {
            if (channel === TYPES_CHANNEL.INSTAGRAM) {
                const { data } = await axios
                    .get("https://graph.facebook.com/v12.0/me?fields=username%2Cconnected_instagram_account%2Cinstagram_business_account%2Cinstagram_accounts", {
                        params: {
                            access_token: accessToken,
                        },
                    })
                    .catch((error) => {
                        console.log(error);
                        setErrors(t("botsCreate.errorIg"));
                        setRenderWhatsMsg(false);
                        setLoadingSubmit(false);
                    })
                    .finally(() => {
                        setLoadingSubmit(false);
                    });

                if (get(data, "connected_instagram_account.id")) {
                    botId = get(data, "connected_instagram_account.id");
                }
            }

            const dataIn = {
                name: localStorage.getItem("bot"),
                templateId: parseInt(localStorage.getItem("templateId")),
                type: channel,
            };

            if (channel === TYPES_CHANNEL.FACEBOOK || channel === TYPES_CHANNEL.INSTAGRAM) {
                dataIn.botId = botId;
                dataIn.access_token = accessToken;
            }

            const companyId = get(company, "id");
            try {
                await DashboardServer.post(`/companies/${companyId}/bots/create`, dataIn).finally(() => {
                    setLoadingSubmit(false);
                });

                localStorage.removeItem("bot");
                localStorage.removeItem("templateId");
                setOpenGuide(true);
                setOpen(false);

                if (channel === TYPES_CHANNEL.FACEBOOK) {
                    window.FB.api(
                        `/${pageId}/subscribed_apps`,
                        "POST",
                        {
                            subscribed_fields: "messages,messaging_postbacks",
                            access_token: accessToken,
                        },
                        function (response) {
                            if (response && !response.error) {
                                /* handle the result */
                            }
                        }
                    );
                }
                if (channel === TYPES_CHANNEL.INSTAGRAM) {
                    window.FB.api(
                        `/${pageId}/subscribed_apps`,
                        "POST",
                        {
                            subscribed_fields: "messages,mention,messaging_postbacks",
                            access_token: accessToken,
                        },
                        function (response) {
                            if (response && !response.error) {
                                /* handle the result */
                                console.log("registred ok");
                            }
                        }
                    );
                }
                loadBots();
            } catch (error) {
                console.log(error);
                const { response } = error;
                const { data } = response;
                const message = get(data, `error.clientMessages.${lang}`, data.message);
                setErrors(message);
                setRenderWhatsMsg(false);
                setLoadingSubmit(false);
            }
        } else {
            isEmpty(channel) ? setErrors(t("botsChooseChannel.errorChannel")) : setLoadingSubmit(false);
            setLoadingSubmit(false);
        }

        if (!isEmpty(errors)) {
            return <span className="text-xs font-normal text-red-675">{errors}</span>;
        }
    };

    return (
        <div className="fixed inset-x-0 top-0 z-50 overflow-auto sm:inset-0 sm:flex sm:items-center sm:justify-center">
            <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 z-20 bg-gray-490/75" />
            </div>
            <div className={`min-w-125.5 transform rounded-lg bg-white px-6 pb-4 pt-5 shadow-modal transition-all`}>
                <div className="mb-3 flex items-center justify-between pb-4">
                    <div className="flex items-center">
                        <div className={`bg-primary mr-2 flex h-8 w-8 items-center justify-center rounded-full sm:h-10 sm:w-10 md:mr-4`}>
                            <JelouLogoIcon width="1.875rem" height="2.4rem" />
                        </div>
                        <div className="max-w-md text-base font-bold text-gray-400 md:text-2xl">{t("botsChooseChannel.moreStep")}</div>
                    </div>
                    <span onClick={() => onClose()}>
                        <CloseIcon className="cursor-pointer fill-current text-gray-450" width="1rem" height="1rem" />
                    </span>
                </div>
                <div className="relative px-10 pb-10">
                    <div>
                        <div className="mt-2 flex w-full flex-col justify-end md:flex-row ">
                            <div className="mt-2 w-full flex-row ">
                                <div className="pb-4 text-lg font-bold text-gray-400">{t("botsChooseChannel.channel")}</div>
                                <div className="flex w-full space-x-2">
                                    <div className="block text-center align-middle">
                                        <button
                                            disabled={company?.id === COMPANY_ID_BPS}
                                            className={`rounded-lg border-3 border-transparent bg-gray-20 p-5 focus:outline-none ${channel === TYPES_CHANNEL.FACEBOOK && "border-3 border-primary-200"}
                                            ${company?.id === COMPANY_ID_BPS ? "cursor-not-allowed opacity-50" : ""}`}
                                            id={TYPES_CHANNEL.FACEBOOK}
                                            onClick={handleChannel}
                                        >
                                            <Facebook className={`text-gray-15`} width="3.75rem" height="3.75rem" />
                                        </button>
                                        <div className="pt-2 text-15 font-medium text-gray-400 text-opacity-75">Facebook</div>
                                    </div>
                                    <div className="block text-center align-middle">
                                        <button
                                            disabled={company?.id === COMPANY_ID_BPS}
                                            className={`rounded-lg border-3 border-transparent bg-gray-20 p-5 focus:outline-none ${channel === TYPES_CHANNEL.INSTAGRAM && "border-3 border-primary-200"}
                                             ${company?.id === COMPANY_ID_BPS ? "cursor-not-allowed opacity-50" : ""}`}
                                            id={TYPES_CHANNEL.INSTAGRAM}
                                            onClick={handleChannel}
                                        >
                                            <Instagram className={`text-gray-15`} width="3.75rem" height="3.75rem" />
                                        </button>
                                        <div className="pt-2 text-15 font-medium text-gray-400">Instagram</div>
                                    </div>
                                    <div className="block text-center align-middle">
                                        <button
                                            className={`rounded-lg border-3 border-transparent bg-gray-20 p-5 focus:outline-none ${
                                                channel === TYPES_CHANNEL.WHATSAPP && "border-3 border-primary-200"
                                            }`}
                                            id={TYPES_CHANNEL.WHATSAPP}
                                            onClick={handleChannel}
                                        >
                                            <Whatsapp className={`text-gray-15`} width="3.75rem" height="3.75rem" />
                                        </button>
                                        <div className="pt-2 text-15 font-medium text-gray-400 text-opacity-75">Whatsapp</div>
                                    </div>
                                    <div className="block text-center align-middle">
                                        {loadingWSlogin ? (
                                            <div className="flex h-[79px] w-full items-center justify-center rounded-lg bg-gray-20 p-5">
                                                <BeatLoader color={"white"} size={"0.625rem"} />
                                            </div>
                                        ) : (
                                            <button
                                                disabled={company?.id !== COMPANY_ID_BPS}
                                                className={`rounded-lg border-3 border-transparent bg-gray-20 p-5 focus:outline-none ${
                                                    channel === TYPES_CHANNEL.WHATSAPP_OFFICIAL && "border-3 border-primary-200"
                                                }
                                                ${company?.id !== COMPANY_ID_BPS ? "cursor-not-allowed opacity-50" : ""}`}
                                                id={TYPES_CHANNEL.WHATSAPP_OFFICIAL}
                                                onClick={handleChannel}
                                            >
                                                <Whatsapp className={`text-gray-15`} width="3.75rem" height="3.75rem" />
                                            </button>
                                        )}
                                        <div className="pt-2 text-15 font-medium text-gray-400 text-opacity-75">Whatsapp Official</div>
                                    </div>
                                    <div className="block text-center align-middle">
                                        <Tippy content={t("botsCreate.soon")} placement={"top"} touch={false}>
                                            <a href={"https://jelou.ai/contactanos"} rel="noreferrer" target="_blank">
                                                <div
                                                    className={`rounded-lg border-3 border-transparent bg-gray-20 p-5 focus:outline-none ${
                                                        channel === TYPES_CHANNEL.WEB && "border-3 border-primary-200"
                                                    }`}
                                                    id={TYPES_CHANNEL.WEB}
                                                >
                                                    <Web className="text-gray-15" width="3.75rem" height="3.75rem" />
                                                </div>
                                            </a>
                                        </Tippy>
                                        <div className="pt-2 text-15 font-medium text-gray-400 text-opacity-75">Web</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {(fbSelect || igSelect) && (
                            <div className="flex flex-col space-y-4 pt-4">
                                <div className="pt-3 text-sm font-bold text-gray-400">{"Selecciona tu página"}</div>
                                <SearchSelect className="w-full rounded-full" options={options} value={value} onChange={handleSelect} name="tipo" placeholder={t("botsChooseChannel.selectPage")} />
                            </div>
                        )}

                        {renderWhatsMsg && <div className="pt-6 text-sm font-bold text-gray-400">{t("botsChooseChannel.sendYouMessage")} +593 98 526 3429</div>}

                        {!isEmpty(errors) && <div className="mt-2 text-right">{renderErrors(errors)}</div>}
                        <div className="mt-14 flex flex-col justify-end md:flex-row">
                            <div className="mt-6 md:mt-0">
                                <button onClick={back} className="w-32 rounded-20 border-1 border-transparent bg-gray-10 p-2 text-base font-bold text-gray-400 focus:outline-none" disabled={loading}>
                                    {t("botsChooseChannel.back")}
                                </button>
                            </div>
                            <div className="ml-4 mt-6 md:mt-0">
                                <button onClick={handleSubmit} className="button-primary w-32" disabled={loading}>
                                    {loadingSubmit ? <BeatLoader color={"white"} size={"0.625rem"} /> : `${t("botsChooseChannel.next")}`}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChooseChannel;
