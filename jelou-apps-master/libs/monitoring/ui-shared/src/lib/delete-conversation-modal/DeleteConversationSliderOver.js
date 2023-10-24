import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { MessageIcon } from "@apps/shared/icons";
import { UserInfoAvatar } from "@apps/shared/common";
import { DeleteSlideOver } from "../deleteSlideOver/DeleteSlideOver";

export const DeleteConversationSliderOver = ({ open, setOpen, room }) => {
    const { t } = useTranslation();
    const { bot = {}, user = {}, avatarUrl = "", type: typeCurrentRoom = null, channel: currentRoomChannel = null } = room;

    const { names = "" } = user;
    const { type: typeBot = null } = bot;
    const name = names || t("pma.Desconocido");
    const channel = String(currentRoomChannel ?? typeBot ?? typeCurrentRoom ?? "").toLowerCase();

    const users = useSelector((state) => state.users);

    const {
        _id,
        createdAt,
        deletedAt = null,
        deletedReason = null,
        deletedBy: { userId } = {},
        operator: { names: operatorNames = "" },
    } = room || {};

    const conversationDeletedBy = users.find((user) => user.id === userId)?.names || t("origin.system");

    return (
        <DeleteSlideOver open={open} setOpen={setOpen}>
            <div className="flex w-full h-20 px-2 border-gray-100 border-opacity-25 border-b-1 sm:px-3">
                <UserInfoAvatar metadata={{}} channel={channel} nameOfProfile={name} avatarUrlDefault={avatarUrl} type={typeCurrentRoom ?? typeBot} />
            </div>

            <div className="flex items-center justify-center w-full h-10 gap-3 border-gray-100 border-opacity-25 border-b-1">
                <MessageIcon width="1.2rem" height="1.2rem" fill="#B8BDC9" />
                <span className="text-sm font-semibold">{t("clients.deletedChatTitle")}</span>
            </div>

            <div className="flex flex-col gap-5 mt-6 ml-16 text-left">
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">{t("clients.deletedChatID")}</span>
                    <span className="text-sm font-normal">{_id}</span>
                </div>

                <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">{t("clients.deletedChatOperator")}</span>
                    <span className="text-sm font-normal">{operatorNames}</span>
                </div>

                <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">{t("clients.deletedChatCreationDate")}</span>
                    <span className="text-sm font-normal">{dayjs(createdAt).format("DD-MM-YYYY HH:ss")}</span>
                </div>

                {deletedAt && (
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-red-800">{t("clients.deletedChatDeletionDate")}</span>
                        <span className="text-sm font-normal">{dayjs(deletedAt).format("DD-MM-YYYY HH:ss")}</span>
                    </div>
                )}

                <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-red-800">{t("clients.deletedChatBy")}</span>
                    <span className="text-sm font-normal">{conversationDeletedBy}</span>
                </div>

                {deletedReason && (
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold">{t("clients.deletedChatReason")}</span>
                        <span className="text-sm font-normal">{deletedReason}</span>
                    </div>
                )}
            </div>
        </DeleteSlideOver>
    );
};
