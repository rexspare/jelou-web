import { CharacterCounter, SelectFormInput, SocialIcon } from "@apps/shared/common";
import { WarningIcon2 } from "@apps/shared/icons";
import axios from "axios";
import { TYPES_CHANNEL } from "libs/bots/ui-shared/src/lib/modal/contants";
import { CHANNEL_TYPES, NAME_MAX_LENGTH } from "libs/brain/src/lib/constants";
import { useEffect, useState } from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { useTranslation } from "react-i18next";
import InstagramRequirements from "../../../../assets/InstagranRequirements.png";
import { Control, InputCustom, OptionCustom } from "./CustomSelect";

const { NX_REACT_APP_CLIENT_ID_META, NX_REACT_APP_CLIENT_SECRET_META, NX_REACT_APP_META_API } = process.env;

const ChannelMeta = (props) => {
    const { handleChange, channelValues, setIsAuthWithMeta, isAuthWithMeta, channelSelected, instagramRequirementsView } = props;
    const [step, setStep] = useState("");

    useEffect(() => {
        setStep(instagramRequirementsView && channelSelected.id === TYPES_CHANNEL.INSTAGRAM ? 0 : 1);
    }, [instagramRequirementsView]);

    const handleAuthWithMeta = async (auth) => {
        if (auth) {
            const {
                data: { access_token },
            } = await axios.get(
                NX_REACT_APP_META_API +
                    `oauth/access_token?grant_type=fb_exchange_token&client_id=${NX_REACT_APP_CLIENT_ID_META}&client_secret=${NX_REACT_APP_CLIENT_SECRET_META}&fb_exchange_token=${auth.accessToken}`
            );
            const { data: response } = await axios.get(NX_REACT_APP_META_API + `me/accounts?fields=access_token,picture,name&access_token=${access_token}`);
            setIsAuthWithMeta({
                ...auth,
                pages: response.data.map((op) => ({ ...op, value: op.id, label: op.name })),
            });
            setStep((prev) => prev + 1);
        }
    };

    const STEPS = {
        0: <PreRequirements />,
        1: <FirstStepMeta handleChange={handleChange} channelValues={channelValues} handleAuthWithMeta={handleAuthWithMeta} />,
        2: <SecondStepMeta isAuthWithMeta={isAuthWithMeta} handleChange={handleChange} channelSelected={channelSelected} />,
    };

    return STEPS[step];
};

export default ChannelMeta;

function PreRequirements() {
    const { t } = useTranslation();
    return (
        <div className="flex w-full flex-col gap-y-3">
            <span className="text-primary-610 font-bold">{t("common.Requirements")}</span>
            <span className="font-normal text-gray-500">{t("brain.Para configurar el canal de Instagram debes tener en cuenta las siguientes instrucciones:")}</span>
            <ul className="space-y-2">
                <li className="ml-5 list-disc">
                    {t("brain.La página de Instagram que deseas conectar con el canal de Jelou debe de estar vinculada con una página de Facebook.")} <br />
                    {t("brain.Para saber cómo vincular una pagina de instagram a facebook ingrese")}
                    <a className="text-primary-200 underline" href="https://help.instagram.com/176235449218188" target="_blank" rel="noreferrer">
                        {t("common.here")}.
                    </a>
                </li>
                <li className="ml-5 list-disc">
                    {t("brain.Debes dar acceso a los mensajes de tu página de instagram.")} <br />
                </li>
            </ul>
            <div className="mb-3 flex w-full items-center justify-center">
                <img src={InstagramRequirements} alt="Instagram requirements" style={{ width: `100%`, height: `100%` }} />
            </div>
        </div>
    );
}

function FirstStepMeta(props) {
    const { handleChange, channelValues, handleAuthWithMeta, minLength = 3 } = props;
    const { t } = useTranslation();
    const length = channelValues?.name?.length;
    const [hasMinLength, setHasMinLength] = useState(false);

    useEffect(() => {
        setHasMinLength(length >= minLength);
    }, [length]);

    const showError = length > 0 && !hasMinLength;

    return (
        <div className="mb-4 flex w-full flex-col text-sm text-gray-610">
            <span className="mb-4 w-full text-sm text-gray-400">{t("brain.Escribe el nombre del nuevo canal e inicia sesión en tu cuenta de Facebook para vincularla")}</span>
            <label className="mb-[0.3rem] font-bold">
                <span className="ml-3 font-bold text-gray-610">{t("common.name")}</span>
                <div
                    className={`flex h-11 w-full rounded-lg border-1 px-4 py-3 font-medium text-gray-610 ${showError ? "border-semantic-error" : "border-neutral-200"}`}
                >
                    <input
                        className="h-full w-full font-medium text-gray-610 placeholder:text-sm focus-visible:outline-none"
                        placeholder={`${t("common.forExample")}`}
                        name={"name"}
                        onChange={handleChange}
                        maxLength={NAME_MAX_LENGTH}
                    />
                    {showError && <WarningIcon2 width="1.5rem" height="1.5rem" className="fill-current text-semantic-error" />}
                </div>
                <CharacterCounter
                    className={` ${showError ? "text-semantic-error" : "text-[#B0B6C2]"}`}
                    colorCircle={showError ? "#F95A59" : "#959DAF"}
                    count={channelValues?.name?.length}
                    max={NAME_MAX_LENGTH}
                    width={15}
                    height={15}
                    right
                />

                <div className="mt-2 w-full py-1">
                    <FacebookLogin
                        appId="358763682688306"
                        fields="name,email,picture"
                        scope="pages_show_list,pages_messaging,pages_read_engagement,pages_messaging_subscriptions,instagram_basic,instagram_manage_messages,pages_manage_metadata,public_profile,instagram_manage_comments,instagram_manage_insights"
                        isDisabled={!channelValues?.name?.length}
                        autoLoad={false}
                        callback={handleAuthWithMeta}
                        render={(props) => (
                            <button
                                type="button"
                                disabled={props.isDisabled}
                                className="rounded-xs bg-[#1375CF] px-6 py-2 text-sm font-semibold leading-5 text-[#F8FAFC] disabled:bg-gray-250"
                                onClick={props.onClick}
                            >
                                {t("common.facebookLogin")}
                            </button>
                        )}
                    />
                </div>
            </label>
        </div>
    );
}

function SecondStepMeta(props) {
    const { isAuthWithMeta, handleChange, channelSelected } = props;
    const { t } = useTranslation();
    const [pageValueFromMeta, setPageValueFromMeta] = useState(null);
    const [pageInstagramFromMeta, setPageInstagramFromMeta] = useState(null);

    const handleChangeSelect = async ({ optionSelected }) => {
        setPageValueFromMeta(optionSelected);
        if (channelSelected.id === CHANNEL_TYPES.INSTAGRAM) {
            const {
                data: { instagram_business_account },
            } = await axios.get(NX_REACT_APP_META_API + `${optionSelected?.id}?fields=instagram_business_account{name,profile_picture_url}&access_token=${optionSelected?.access_token}`);
            setPageInstagramFromMeta(instagram_business_account);
            handleChange({
                target: {
                    name: "metadata",
                    value: instagram_business_account
                        ? {
                              page_id: instagram_business_account?.id,
                              access_token: optionSelected.access_token,
                              name_page: instagram_business_account?.name,
                              url: instagram_business_account?.profile_picture_url,
                              from_page_id: optionSelected.id,
                          }
                        : undefined,
                },
            });
        }
        if (channelSelected.id === CHANNEL_TYPES.FACEBOOK) {
            await axios.post(`https://graph.facebook.com/${optionSelected.id}/subscribed_apps?subscribed_fields=messages,messaging_postbacks&access_token=${optionSelected.access_token}`);
            handleChange({
                target: {
                    name: "metadata",
                    value: {
                        page_id: optionSelected.id,
                        access_token: optionSelected.access_token,
                        name_page: optionSelected.label,
                        url: optionSelected.picture.data.url,
                    },
                },
            });
        }
    };

    return (
        <div className="mb-4 flex w-full flex-col text-sm text-gray-610">
            <span className="mb-4 w-full text-sm text-gray-400">{t("brain.Selecciona las páginas de Facebook que deseas vincular con el nuevo canal")}.</span>
            <div className="w-full">
                <SelectFormInput
                    value={pageValueFromMeta}
                    isSearchable={true}
                    placeholder={t("datum.placeholders.type")}
                    onChange={handleChangeSelect}
                    options={isAuthWithMeta.pages}
                    components={{ Input: InputCustom, Control, Option: OptionCustom }}
                    inputDefault
                />
            </div>
            {channelSelected.id === CHANNEL_TYPES.INSTAGRAM && (
                <div className="my-3 flex flex-col items-center">
                    <span className="mb-4 ml-2 w-full font-bold text-gray-610">Cuenta de Instagram asociada</span>
                    <div className="flex w-full flex-row items-center gap-x-3 rounded-10 border-1 border-neutral-200 p-2">
                        {pageInstagramFromMeta && (
                            <div className="relative">
                                <img className="h-10 w-10 rounded-full border-1 border-neutral-200" src={pageInstagramFromMeta?.profile_picture_url || null} alt="" />
                                <div className="absolute bottom-0 right-0 -mb-1 -mr-1 overflow-hidden rounded-full border-2 border-transparent">
                                    <SocialIcon type={"INSTAGRAM"} size="1rem" />
                                </div>
                            </div>
                        )}
                        <span className="border-none text-sm font-medium text-gray-400">{pageInstagramFromMeta?.name || "-----------"}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
