import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import isEmpty from "lodash/isEmpty";

import { CHANNELS } from "@apps/shared/constants";
import DiclosureInfo from "./DiclosureInfo";
import { MetadataFacebook, MetadataInstagram, MetadataTwitter, MetadataWhatsApp, MetadataWidget } from "./Metadata";
import { useDetailsConversation } from "@apps/shared/hooks";
import { Tag } from "@apps/pma/ui-shared";
import { UserInfoAvatar } from "@apps/shared/common";

const Profile = ({ currentRoom } = {}) => {
    const { t } = useTranslation();
    const storedParams = useSelector((state) => state.storedParams);
    const {
        avatarUrl = "",
        bot = {},
        channel: currentRoomChannel = null,
        createdAt = null,
        type: typeCurrentRoom = null,
        updateAt = null,
        user = {},
    } = currentRoom;

    const { name: nameUserData = "" } = storedParams;
    const { names = "" } = user;

    const { type: typeBot = null } = bot;

    const name = nameUserData || names || t("pma.Desconocido");

    const channel = String(currentRoomChannel ?? typeBot ?? typeCurrentRoom ?? "").toLowerCase();
    const { detailConversation, loadingProfile } = useDetailsConversation(currentRoom);
    const { metadata = {}, tags = [] } = detailConversation;

    return (
        <section>
            <aside className="py-5">
                <UserInfoAvatar
                    avatarUrlDefault={avatarUrl}
                    channel={channel}
                    metadata={metadata}
                    nameOfProfile={name}
                    type={typeCurrentRoom ?? typeBot}
                />

                <div className="flex flex-wrap-reverse gap-1 mt-2 ml-8 space-y-2 overflow-y-scroll max-h-18">
                    {!isEmpty(tags) &&
                        tags.map((tag, index) => {
                            return (
                                <div className="flex-none h-6 mr-1" key={index}>
                                    <Tag tag={tag} key={index} isList={true} />
                                </div>
                            );
                        })}
                </div>
            </aside>

            <div className="space-y-2">
                <DiclosureInfo loading={loadingProfile} titleButton={t("pma.clientsInfo")} isProfil={true}>
                    <div className="space-y-3 overflow-y-scroll text-sm max-h-32">
                        {channel === CHANNELS.FACEBOOK && <MetadataFacebook metadata={metadata} />}
                        {channel === CHANNELS.FACEBOOK_FEED && <MetadataFacebook metadata={metadata} />}
                        {channel === CHANNELS.INSTAGRAM && <MetadataInstagram metadata={metadata} />}
                        {channel === CHANNELS.TWITTER && <MetadataTwitter metadata={metadata} />}
                        {channel === CHANNELS.WHATSAPP && <MetadataWhatsApp metadata={metadata} />}
                        {channel === CHANNELS.WIDGET && <MetadataWidget metadataRoom={metadata} />}
                    </div>
                </DiclosureInfo>

                <DiclosureInfo loading={loadingProfile} titleButton={t("pma.conversationInfo")}>
                    <div className="space-y-3 text-sm h-52">
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-400">{t("pma.channel")}</span>
                            <span className="text-gray-400 text-opacity-75">{channel === "widget" ? "WEB" : channel}</span>
                        </div>
                        {createdAt && (
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-400">{t("pma.initConversation")}</span>
                                <span className="text-gray-400 text-opacity-75">{dayjs(createdAt).format("DD/MM/YYYY - HH:mm:ss")}</span>
                            </div>
                        )}
                        {updateAt && (
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-400">{t("pma.lastConversation")}</span>
                                <span className="text-gray-400 text-opacity-75">{dayjs(updateAt).format("DD/MM/YYYY - HH:mm:ss")}</span>
                            </div>
                        )}
                    </div>
                </DiclosureInfo>
            </div>
        </section>
    );
};
export default Profile;
