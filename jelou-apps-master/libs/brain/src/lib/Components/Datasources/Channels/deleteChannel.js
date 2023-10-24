import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { toastMessage } from "@apps/shared/common";
import { MESSAGE_TYPES, TOAST_POSITION } from "@apps/shared/constants";
import { TrashIcon2, CloseIcon1 } from "@apps/shared/icons";
import { useDeleteChannel } from "../../../services/brainAPI";
import { CHANNEL, CHANNEL_TYPES, CHANNEL_TYPES_TRANSLATIONS } from "../../../constants";
import { Modal } from "../../../Modal";
import DeleteButton from "../../../Common/deleteButton";
import { useNavigate, useParams } from "react-router-dom";
import { isEmpty } from "lodash";

const DeleteChannnel = (props) => {
    const { openModal, closeModal, refetchChannels, channelSelected } = props;
    const { t } = useTranslation();
    const company = useSelector((state) => state.company);
    const [channelToBeDeleted, setChannelToBeDeleted] = useState("");
    const [channelTypeToRender, setChannelTypeToRender] = useState("");
    const navigate = useNavigate();
    const { channelId } = useParams();

    const { mutateAsync: deleteChannel, isLoading } = useDeleteChannel({
        datastoreId: channelSelected.brain_id,
        channelId: channelSelected.id,
        body: {
            client_id: company.clientId,
            client_secret: company.clientSecret,
        },
    });

    const handleDeleteChannel = async () => {
        if (channelToBeDeleted === channelSelected.name) {
            await deleteChannel(
                {},
                {
                    onSuccess: () =>
                        toastMessage({
                            messagePart1: `${t("common.itemDeleted")} ${t(CHANNEL.SINGULAR_LOWER)}`,
                            messagePart2: channelSelected.name,
                            type: MESSAGE_TYPES.SUCCESS,
                            position: TOAST_POSITION.TOP_RIGHT,
                        }),
                    onError: () =>
                        toastMessage({
                            messagePart1: `${t("common.itemNotDeleted")} ${t(CHANNEL.SINGULAR_LOWER)}`,
                            messagePart2: channelSelected.name,
                            type: MESSAGE_TYPES.ERROR,
                            position: TOAST_POSITION.TOP_RIGHT,
                        }),
                }
            );
            setChannelToBeDeleted("");
            refetchChannels();
            closeModal();
            !isEmpty(channelId) && navigate(-1);
        }
    };

    const handleChange = (e) => {
        setChannelToBeDeleted(e.target.value);
    };

    useEffect(() => {
        switch (channelSelected?.type) {
            case CHANNEL_TYPES.WHATSAPP:
                setChannelTypeToRender(CHANNEL_TYPES_TRANSLATIONS.WHATSAPP);
                break;
            case CHANNEL_TYPES.FACEBOOK:
                setChannelTypeToRender(CHANNEL_TYPES_TRANSLATIONS.FACEBOOK);
                break;
            case CHANNEL_TYPES.INSTAGRAM:
                setChannelTypeToRender(CHANNEL_TYPES_TRANSLATIONS.INSTAGRAM);
                break;
            default:
                setChannelTypeToRender(CHANNEL_TYPES_TRANSLATIONS.WEB);
                break;
        }
    }, [channelSelected]);

    return (
        <Modal
            closeModal={() => null}
            openModal={openModal}
            className="h-min w-auto rounded-20 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)]"
            classNameActivate="">
            <div className="max-w-[700px] w-full justify-start">
                <header className="right-0 top-0 flex items-center justify-between bg-semantic-error-light px-10 py-5">
                    <div className="flex items-center gap-x-3 text-semantic-error">
                        <TrashIcon2 width="28" height="28" />
                        <div className="font-semibold">{`${t("common.delete")} ${t(CHANNEL.SINGULAR_LOWER)}`}</div>
                    </div>
                    <button
                        onClick={() => {
                            setChannelToBeDeleted("");
                            closeModal();
                        }}>
                        <CloseIcon1 className="fill-current text-semantic-error" />
                    </button>
                </header>
                <section className="space-y-6 px-10 pt-8 pb-8">
                    <div>
                        {`${t("brain.deleteChannelDescription")} ${channelTypeToRender} `}
                        <span>
                            <span className="font-bold">{`"${channelSelected?.name}"`}</span>?
                        </span>
                    </div>
                    <div>
                        {`${t("brain.deleteChannelConfirmation")} `}
                        <span className="font-bold">{channelSelected?.name}</span>
                    </div>
                    <div className="flex h-11 w-full items-center rounded-lg border-1 border-neutral-200 px-4 py-1 font-medium text-gray-610">
                        <input
                            className="h-full w-full font-medium text-gray-610 placeholder:text-sm focus-visible:outline-none"
                            placeholder={t("common.enterChannelName")}
                            name={"name"}
                            value={channelToBeDeleted}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex justify-end gap-x-5">
                        <button
                            type="reset"
                            onClick={() => {
                                setChannelToBeDeleted("");
                                closeModal();
                            }}
                            className="px-5 py-2 h-9 w-28 flex justify-center items-center rounded-3xl bg-gray-10 font-bold text-gray-400">
                            {t("common.cancel")}
                        </button>
                        <DeleteButton
                            buttonText={t("common.deleteChannel")}
                            onClick={handleDeleteChannel}
                            redBackground={true}
                            isLoading={isLoading}
                        />
                    </div>
                </section>
            </div>
        </Modal>
    );
};

export default DeleteChannnel;
