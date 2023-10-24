import isEmpty from "lodash/isEmpty";
import { useSelector } from "react-redux";

import { ExternalLinkIcon } from "@apps/shared/icons";
import { useTranslation } from "react-i18next";

const ORIGINS_LINKS = {
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
};

const GenerateLink = ({ origin, username }) => (
    <a
        href={`${origin}/${username}`}
        target="_blank"
        rel="noreferrer"
        className="flex items-center text-gray-400 text-opacity-75 hover:text-primary-200 hover:underline">
        @{username} <ExternalLinkIcon />
    </a>
);

function RenderURLWidget({ lastKnownUrl }) {
    return (
        <a
            href={lastKnownUrl}
            target="_blank"
            rel="noreferrer"
            className="h-full w-52 whitespace-normal break-all text-gray-400 text-opacity-75 hover:text-primary-200 hover:underline">
            {lastKnownUrl}
        </a>
    );
}

function RenderMetadata({ listDataUser = [] } = {}) {
    return (
        listDataUser &&
        listDataUser.map(
            (item) =>
                (isNaN(item.value) === false || !isEmpty(item.value)) && (
                    <div className="flex flex-col" key={item.id}>
                        <span className="font-semibold text-gray-400">{item.label}</span>
                        {item?.customElement ? item.customElement : <span className="w-47 truncate text-gray-400 text-opacity-75">{item.value}</span>}
                    </div>
                )
        )
    );
}

export function MetadataTwitter({ metadata = {} } = {}) {
    const { t } = useTranslation();
    if (isEmpty(metadata)) return t("pma.notInfo");

    const { names = "", username = "", followers = "", following = "", id = "" } = metadata;

    const listDataUser = [
        {
            id: 6,
            label: t("pma.id"),
            value: id,
        },
        {
            id: 1,
            label: t("pma.name"),
            value: names,
        },
        {
            id: 3,
            label: t("pma.username"),
            value: username,
            customElement: <GenerateLink origin={ORIGINS_LINKS.twitter} username={username} />,
        },
        {
            id: 4,
            label: t("pma.followers"),
            value: followers,
        },
        {
            id: 5,
            label: t("pma.following"),
            value: following,
        },
    ];

    return <RenderMetadata listDataUser={listDataUser} />;
}

export function MetadataWhatsApp({ metadata = {} } = {}) {
    const { t } = useTranslation();
    if (isEmpty(metadata)) return t("pma.notInfo");

    const { names = "", id = "", country = "", countryCode = "", phoneNumberCode = "" } = metadata;

    const listDataUser = [
        {
            id: 3,
            label: t("pma.id"),
            value: id,
        },
        {
            id: 1,
            label: t("pma.name"),
            value: names,
        },
        {
            id: 2,
            label: t("pma.phone"),
            value: id,
        },
        {
            id: 4,
            label: t("pma.country"),
            value: country,
        },
        {
            id: 5,
            label: t("pma.countryCode"),
            value: countryCode,
        },
        {
            id: 6,
            label: t("pma.phoneNumberCode"),
            value: phoneNumberCode,
        },
    ];

    return <RenderMetadata listDataUser={listDataUser} />;
}

export function MetadataFacebook({ metadata = {} } = {}) {
    const { t } = useTranslation();
    if (isEmpty(metadata)) return t("pma.notInfo");
    const { names = "", id = "" } = metadata;

    const listDataUser = [
        {
            id: 2,
            label: t("pma.id"),
            value: id,
        },
        {
            id: 1,
            label: t("pma.name"),
            value: names,
        },
    ];

    return <RenderMetadata listDataUser={listDataUser} />;
}

export function MetadataInstagram({ metadata = {} } = {}) {
    const { t } = useTranslation();
    if (isEmpty(metadata)) return t("pma.notInfo");

    const { names = "", username = "", id = "" } = metadata;

    const listDataUser = [
        {
            id: 3,
            label: t("pma.id"),
            value: id,
        },
        {
            id: 1,
            label: t("pma.name"),
            value: names,
        },
        {
            id: 2,
            label: t("pma.username"),
            value: username,
            customElement: <GenerateLink origin={ORIGINS_LINKS.instagram} username={username} />,
        },
    ];

    return <RenderMetadata listDataUser={listDataUser} />;
}

export function MetadataWidget({ metadataRoom = null } = {}) {
    const { t } = useTranslation();
    const widgetMetadata = useSelector((state) => state.widgetMetadata);

    if (isEmpty(metadataRoom) && isEmpty(widgetMetadata)) {
        const listDataUser = [
            {
                id: 1,
                label: t("pma.lastKnownUrl"),
                value: t("pma.URLNotKnow"),
            },
        ];

        return <RenderMetadata listDataUser={listDataUser} />;
    }

    const metadata = Object.keys(widgetMetadata).length === 0 ? metadataRoom : widgetMetadata;
    const { lastKnownUrl = "" } = metadata;

    const _listDataUser = [
        {
            id: 1,
            label: t("pma.lastKnownUrl"),
            value: lastKnownUrl,
            customElement: <RenderURLWidget lastKnownUrl={lastKnownUrl} />,
        },
    ];

    return <RenderMetadata listDataUser={_listDataUser} />;
}
