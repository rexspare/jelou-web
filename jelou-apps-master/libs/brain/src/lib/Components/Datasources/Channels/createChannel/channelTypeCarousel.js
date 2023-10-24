import { useTranslation } from "react-i18next";
import { Disclosure } from "@headlessui/react";
import capitalize from "lodash/capitalize";

import { WSChannelIcon, FBChannelIcon, IGChannelIcon } from "@apps/shared/icons";
import { CHANNEL_TYPES } from "libs/brain/src/lib/constants";
import ChannelDescription from "./channelDescription";

const ChannelTypeCarousel = (props) => {
    const { handleSelectChannel, channelSelected } = props;
    const { t } = useTranslation();

    const CHANNELS = [
        {
            id: CHANNEL_TYPES.WHATSAPP,
            name: capitalize(CHANNEL_TYPES.WHATSAPP),
            disabled: false,
            icon: <WSChannelIcon width="48" height="48" className="fill-current" />,
            description: <ChannelDescription channel={CHANNEL_TYPES.WHATSAPP} />,
        },
        {
            id: CHANNEL_TYPES.FACEBOOK,
            name: capitalize(CHANNEL_TYPES.FACEBOOK),
            disabled: false,
            icon: <FBChannelIcon width="48" height="48" />,
            description: <ChannelDescription channel={CHANNEL_TYPES.FACEBOOK} />,
        },
        {
            id: CHANNEL_TYPES.INSTAGRAM,
            name: capitalize(CHANNEL_TYPES.INSTAGRAM),
            disabled: false,
            icon: <IGChannelIcon width="48" height="48" className="fill-current" />,
            description: <ChannelDescription channel={CHANNEL_TYPES.INSTAGRAM} />,
        },
        {
            id: CHANNEL_TYPES.WEB,
            name: capitalize(CHANNEL_TYPES.WEB),
            disabled: false,
            icon: (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.00576 18.0525C6.35423 19.9143 6 21.9158 6 24C6 26.0842 6.35423 28.0857 7.00577 29.9475C7.01704 29.9828 7.02935 30.0176 7.04266 30.0519C9.52827 37.0159 16.1821 42 24 42C33.9411 42 42 33.9411 42 24C42 14.0589 33.9411 6 24 6C16.1821 6 9.52829 10.9841 7.04267 17.9481C7.02935 17.9824 7.01704 18.0172 7.00576 18.0525ZM18.1432 10.9118C15.4028 12.14 13.1183 14.2035 11.6138 16.7784H16.1397C16.4929 15.0753 16.97 13.5141 17.5521 12.1544C17.7359 11.7253 17.9328 11.3098 18.1432 10.9118ZM15.5956 20.4431H10.1094C9.81903 21.5805 9.66467 22.7722 9.66467 24C9.66467 25.2278 9.81903 26.4195 10.1094 27.5569H15.5954C15.4874 26.4054 15.4311 25.2155 15.4311 24.001C15.4311 22.7858 15.4874 21.5952 15.5956 20.4431ZM19.278 27.5569C19.1596 26.4248 19.0958 25.234 19.0958 24.001C19.0958 22.7672 19.1597 21.5758 19.2782 20.4431H28.7218C28.8403 21.5758 28.9042 22.7672 28.9042 24.001C28.9042 25.234 28.8404 26.4248 28.722 27.5569H19.278ZM16.1392 31.2216H11.6138C13.1181 33.7961 15.4021 35.8594 18.1419 37.0876C17.932 36.6904 17.7355 36.2758 17.5521 35.8475C16.9697 34.4874 16.4925 32.9255 16.1392 31.2216ZM29.8581 37.0876C32.5979 35.8594 34.8819 33.7961 36.3862 31.2216H31.8608C31.5075 32.9255 31.0303 34.4874 30.4479 35.8475C30.2645 36.2758 30.068 36.6904 29.8581 37.0876ZM28.1067 31.2216C27.8239 32.4073 27.4758 33.4783 27.079 34.4051C26.5276 35.6931 25.918 36.6182 25.3344 37.1947C24.7587 37.7634 24.3099 37.9023 24 37.9023C23.6901 37.9023 23.2413 37.7634 22.6656 37.1947C22.082 36.6182 21.4724 35.6931 20.921 34.4051C20.5242 33.4783 20.1761 32.4073 19.8933 31.2216H28.1067ZM32.4045 27.5569H37.8906C38.181 26.4195 38.3353 25.2278 38.3353 24C38.3353 22.7722 38.181 21.5805 37.8906 20.4431H32.4044C32.5126 21.5952 32.5689 22.7858 32.5689 24.001C32.5689 25.2155 32.5126 26.4054 32.4045 27.5569ZM31.8603 16.7784H36.3862C34.8817 14.2035 32.5972 12.1399 29.8568 10.9118C30.0672 11.3098 30.2641 11.7253 30.4479 12.1544C31.03 13.5141 31.5071 15.0753 31.8603 16.7784ZM28.1062 16.7784H19.8938C20.1765 15.5935 20.5244 14.5231 20.921 13.5968C21.4724 12.3089 22.082 11.3838 22.6656 10.8073C23.2413 10.2386 23.6901 10.0997 24 10.0997C24.3099 10.0997 24.7587 10.2386 25.3344 10.8073C25.918 11.3838 26.5276 12.3089 27.079 13.5968C27.4756 14.5231 27.8235 15.5935 28.1062 16.7784Z"
                        fill="#374361"
                    />
                </svg>
            ),
            description: <ChannelDescription channel={CHANNEL_TYPES.WEB} />,
        },
    ];

    return (
        <div className="text-sm text-gray-400">
            <div className="font-base mb-5">{`${t("common.createChannelInstruction")}`}</div>
            <div className="mb-5 flex flex-col">
                <div className="flex flex-row gap-x-5 overflow-x-auto pb-2 pr-2">
                    {CHANNELS.map((channel, idx) => (
                        <Disclosure key={idx}>
                            <div className="flex flex-col">
                                <div className="flex flex-col">
                                    <Disclosure.Button
                                        disabled={channel.disabled}
                                        onClick={() => handleSelectChannel(channel)}
                                        className={`flex h-[7.625rem] w-[9.5625rem] flex-col items-center justify-center rounded-[0.4375rem] ${
                                            channel.disabled
                                                ? "border-neutral-100 text-gray-350 grayscale"
                                                : "text-gray-610 hover:border-primary-200 hover:font-bold"
                                        } border-default  ${
                                            channel.id === channelSelected.id ? "border-primary-200 font-bold" : "border-neutral-200"
                                        }`}>
                                        {channel.icon}
                                        <div className="mt-2 text-center">{channel.name}</div>
                                    </Disclosure.Button>
                                </div>
                            </div>
                        </Disclosure>
                    ))}
                </div>
                <div className="pt-4 pb-2 text-sm text-gray-500">{channelSelected?.description}</div>
            </div>
        </div>
    );
};

export default ChannelTypeCarousel;
