import type { ListBoxElement } from "@builder/common/Headless/Listbox";

import { FacebookIcon } from "@builder/Icons/Facebook.Icon";
import { InstagramIcon } from "@builder/Icons/Instagram.Icon";
import { OmniCanalIcon } from "@builder/Icons/OmniCanal.Icon";
import { WebIcon } from "@builder/Icons/Web.Icon";
import { WhatsappIcon } from "@builder/Icons/Whatsapp.Icon";

import { ChannelTypes } from "./channels.domain";

const size = 30;

export const CHANNELS_OPTIONS_LIST: ListBoxElement<ChannelTypes>[] = [
    {
        id: 0,
        name: "Omnicanal",
        Icon: () => <OmniCanalIcon width={size} height={size} />,
        value: ChannelTypes.OMNICHANNEL,
    },
    {
        id: 1,
        name: "WhatsApp",
        Icon: () => <WhatsappIcon width={size} height={size} />,
        value: ChannelTypes.WHATSAPP,
    },
    {
        id: 2,
        name: "Facebook",
        Icon: () => <FacebookIcon width={size} height={size} />,
        value: ChannelTypes.FACEBOOK,
    },
    {
        id: 3,
        name: "Instagram",
        Icon: () => <InstagramIcon width={size} height={size} />,
        value: ChannelTypes.INSTAGRAM,
    },
    {
        id: 4,
        name: "Web",
        Icon: () => <WebIcon width={size} height={size} />,
        value: ChannelTypes.WEB,
    },
];

export const CHANNELS_ICONS = {
    [ChannelTypes.OMNICHANNEL]: OmniCanalIcon,
    [ChannelTypes.WHATSAPP]: WhatsappIcon,
    [ChannelTypes.FACEBOOK]: FacebookIcon,
    [ChannelTypes.INSTAGRAM]: InstagramIcon,
    [ChannelTypes.WEB]: WebIcon,
};
