import { SelectFormInput, SocialIcon } from "@apps/shared/common";
import { CHANNELS } from "@apps/shared/constants";
import { CheckCircleIconPrimary, EditButtonIcon } from "@apps/shared/icons";
import axios from "axios";
import { TYPES_CHANNEL } from "libs/bots/ui-shared/src/lib/modal/contants";
import DeleteButton from "libs/brain/src/lib/Common/deleteButton";
import NameComponent from "libs/brain/src/lib/Modal/nameComponent";
import { CHANNEL, NAME_MAX_LENGTH, NAME_MIN_LENGTH } from "libs/brain/src/lib/constants";
import { useEffect, useState } from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { useTranslation } from "react-i18next";
import { Control, InputCustom, OptionCustom } from "../TypesComponents/CustomSelect";

const MetaChannels = ({ onChangeName, channelSelected, enableEdition, handleOnClick, openDeleteModal }) => {
    const { t } = useTranslation();

    const [listPages, setListPages] = useState([]);
    const [currentPage, setCurrentPage] = useState({});
    const [pageInstagramFromMeta, setPageInstagramFromMeta] = useState(null);

    const { NX_REACT_APP_CLIENT_ID_META, NX_REACT_APP_CLIENT_SECRET_META, NX_REACT_APP_META_API } = process.env;

    const handleAuthWithMeta = async (auth) => {
        if (auth) {
            const {
                data: { access_token },
            } = await axios.get(
                NX_REACT_APP_META_API +
                    `oauth/access_token?grant_type=fb_exchange_token&client_id=${NX_REACT_APP_CLIENT_ID_META}&client_secret=${NX_REACT_APP_CLIENT_SECRET_META}&fb_exchange_token=${auth.accessToken}`
            );
            const { data: response } = await axios.get(NX_REACT_APP_META_API + `me/accounts?fields=access_token,picture,name&access_token=${access_token}`);
            setListPages(response.data.map((op) => ({ ...op, value: op.id, label: op.name })));
            if (channelSelected.type === TYPES_CHANNEL.INSTAGRAM) {
                const findPage = response.data.find((p) => p.id === channelSelected.metadata.from_page_id);
                setPageInstagramFromMeta(currentPage);
                setCurrentPage({
                    label: findPage.name,
                    value: findPage.id,
                    picture: findPage.picture,
                });
            }
        }
    };

    useEffect(() => {
        setCurrentPage({
            label: channelSelected.metadata.name_page,
            value: channelSelected.metadata.page_id,
            picture: { data: { url: channelSelected.metadata.url } },
        });
    }, []);

    const handleChangePage = async ({ optionSelected }) => {
        setCurrentPage(optionSelected);
        if (channelSelected.type === TYPES_CHANNEL.INSTAGRAM) {
            const {
                data: { instagram_business_account },
            } = await axios.get(NX_REACT_APP_META_API + `${optionSelected?.id}?fields=instagram_business_account{name,profile_picture_url}&access_token=${optionSelected?.access_token}`);
            setPageInstagramFromMeta({
                label: instagram_business_account?.name,
                value: instagram_business_account?.id,
                picture: { data: { url: instagram_business_account?.profile_picture_url } },
            });
            onChangeName({
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
        if (channelSelected.type === TYPES_CHANNEL.FACEBOOK) {
            await axios.post(`https://graph.facebook.com/${optionSelected.id}/subscribed_apps?subscribed_fields=messages,messaging_postbacks&access_token=${optionSelected.access_token}`);
            onChangeName({
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

    const disableChannel = () => {
        onChangeName({
            target: {
                name: "metadata",
                value: {
                    ...channelSelected.metadata,
                    state: 0,
                },
            },
        });
        handleOnClick();
    };

    return (
        <div className="p-10 py-8">
            <div className="flex w-1/2 flex-col space-y-4">
                <div className="flex flex-row items-center gap-x-4">
                    <div className="w-full text-sm">
                        <NameComponent
                            title={t("common.channelName")}
                            placeholder={CHANNEL.SINGULAR_CAPITALIZED}
                            onChange={onChangeName}
                            itemValues={channelSelected}
                            maxLength={NAME_MAX_LENGTH}
                            length={channelSelected.name?.length}
                            minLength={NAME_MIN_LENGTH}
                        />
                    </div>
                </div>
            </div>
            <div className="my-8 flex flex-col gap-5">
                <div className="flex w-1/2 flex-row justify-between ">
                    <span className="text-base font-bold text-gray-610">
                        {t("common.pages")} {t("common.of")} {channelSelected.type === TYPES_CHANNEL.FACEBOOK ? CHANNELS.FACEBOOK : CHANNELS.INSTAGRAM}
                    </span>
                    <FacebookLogin
                        appId="358763682688306"
                        fields="name,email,picture"
                        scope="pages_show_list,pages_messaging,pages_read_engagement,pages_messaging_subscriptions,instagram_basic,instagram_manage_messages,pages_manage_metadata,public_profile,instagram_manage_comments,instagram_manage_insights"
                        autoLoad={false}
                        callback={handleAuthWithMeta}
                        render={(props) => (
                            <button
                                type="button"
                                disabled={props.isDisabled}
                                className="rounded-full border-1 border-primary-200 px-4 py-2 text-sm font-semibold leading-5 text-primary-200"
                                onClick={props.onClick}
                            >
                                {t("brain.changePage")}
                            </button>
                        )}
                    />
                </div>
                <div className="flex w-1/2 flex-col">
                    {!listPages.length ? (
                        <div className="flex w-full flex-row items-center gap-x-3 rounded-10 border-1 border-neutral-200 px-2 ">
                            <img className="h-14 w-14 scale-75  rounded-full" src={currentPage?.picture?.data?.url} alt="" />
                            <span className="border-none text-sm font-medium text-gray-610">{currentPage?.label}</span>
                        </div>
                    ) : (
                        <>
                            <SelectFormInput
                                value={currentPage}
                                isSearchable={true}
                                placeholder={t("datum.placeholders.type")}
                                onChange={handleChangePage}
                                options={listPages}
                                isDisable={!listPages.length}
                                components={{ Input: InputCustom, Control, Option: OptionCustom }}
                                inputDefault
                            />
                            {channelSelected.type === TYPES_CHANNEL.INSTAGRAM && (
                                <div className="my-3 flex flex-col items-center">
                                    <span className="mb-4 ml-2 w-full font-bold text-gray-610">Cuenta de Instagram asociada</span>
                                    <div className="flex w-full flex-row items-center gap-x-3 rounded-10 border-1 border-neutral-200 p-2">
                                        {pageInstagramFromMeta?.picture && (
                                            <div className="relative">
                                                <img className="h-10 w-10 rounded-full border-1 border-neutral-200" src={pageInstagramFromMeta?.picture?.data?.url || null} alt="" />
                                                <div className="absolute bottom-0 right-0 -mb-1 -mr-1 overflow-hidden rounded-full border-2 border-transparent">
                                                    <SocialIcon type={"INSTAGRAM"} size="1rem" />
                                                </div>
                                            </div>
                                        )}
                                        <span className="border-none text-sm font-medium text-gray-400">{pageInstagramFromMeta?.label || "-----------"}</span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
                <div className="my-4 flex w-full flex-col gap-5 border-t-1 border-gray-34 py-8">
                    <div className="flex w-1/2 flex-col space-y-2">
                        <span className="text-base font-bold text-gray-610">{t("common.disableChannel")}</span>
                        <span className="mb-2 text-sm text-gray-400">{t("brain.disableChannelInstruction")}</span>
                    </div>
                    <div className="flex flex-row items-center gap-x-2">
                        <button onClick={disableChannel} className="rounded-full border-1 border-primary-200 px-3 py-2 text-sm font-bold text-primary-200">
                            {t("common.disableChannel")}
                        </button>
                        <DeleteButton onClick={openDeleteModal} buttonText={`${t("common.delete")} ${t(CHANNEL.SINGULAR_LOWER)}`} showIcon={true} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MetaChannels;
