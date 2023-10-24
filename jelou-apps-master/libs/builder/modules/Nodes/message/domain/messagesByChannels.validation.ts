import { currentChannelStore } from "@builder/Stores/currentchannel";
import { SERVICES_LIST_NODES } from "@builder/ToolBar/constants.toolbar";
import { ChannelTypes } from "@builder/modules/Channels/domain/channels.domain";
import { BLOCK_TYPES } from "@builder/modules/Nodes/message/domain/constants.message";

/**
 * Show caption media block by channel
 *
 * Rules:
 * - Solo en WS acepta caption en video e imagen
 */

const CAPTIONS_RULES = [
    {
        CHANNELS: [ChannelTypes.WHATSAPP],
        ACCEPT_CAPTION: [BLOCK_TYPES.IMAGE, BLOCK_TYPES.VIDEO],
    },
    {
        CHANNELS: [ChannelTypes.WEB],
        ACCEPT_CAPTION: [BLOCK_TYPES.IMAGE],
    },
];

export function showCaptionMediaBlock(blockType: BLOCK_TYPES) {
    const currentTypeChannel = currentChannelStore.getState().currentTypeChannel;

    let showCaption = false;
    CAPTIONS_RULES.forEach(({ CHANNELS, ACCEPT_CAPTION }) => {
        if (CHANNELS.includes(currentTypeChannel)) {
            showCaption = ACCEPT_CAPTION.includes(blockType);
        }
    });

    return showCaption;
}

/**
 * Show nodes messages by channel
 *
 * Rules:
 * - No hay audio en fb - ig
 * - No hay locations en FB- IG
 * - Mensaje de lista solo hay en WS
 * - Stickers solo hay en WS
 * - Contacto solo hay en WS
 * - No hay Quick Reply en WEB
 * - En WS no hay botones
 */
const MESSAGE_RULES = [
    {
        CHANNELS: [ChannelTypes.WHATSAPP],
        BANNER: [BLOCK_TYPES.QUICK_REPLY],
    },
    {
        CHANNELS: [ChannelTypes.WEB],
        BANNER: [BLOCK_TYPES.QUICK_REPLY, BLOCK_TYPES.LIST, BLOCK_TYPES.STICKER, BLOCK_TYPES.CONTACT],
    },
    {
        CHANNELS: [ChannelTypes.FACEBOOK, ChannelTypes.INSTAGRAM],
        BANNER: [BLOCK_TYPES.LIST, BLOCK_TYPES.STICKER, BLOCK_TYPES.CONTACT, BLOCK_TYPES.AUDIO, BLOCK_TYPES.LOCATION],
    },
    {
        CHANNELS: [ChannelTypes.OMNICHANNEL],
        BANNER: [BLOCK_TYPES.AUDIO, BLOCK_TYPES.LOCATION, BLOCK_TYPES.STICKER, BLOCK_TYPES.CONTACT, BLOCK_TYPES.LIST, BLOCK_TYPES.QUICK_REPLY],
    },
];

export function validatedMessageListNodes() {
    let listMessageNodes = [...SERVICES_LIST_NODES];
    const currentTypeChannel = currentChannelStore.getState().currentTypeChannel;

    MESSAGE_RULES.forEach(({ BANNER, CHANNELS }) => {
        if (CHANNELS.includes(currentTypeChannel)) {
            listMessageNodes = listMessageNodes.filter((item) => !BANNER.includes(item.initialData as BLOCK_TYPES));
        }
    });

    return listMessageNodes;
}
