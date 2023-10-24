import Tippy from "@tippyjs/react";

import { ManagedIcon, NotManagedIcon } from "@apps/shared/icons";
import { ORIGINS_ROOMS_ICONS } from "@apps/shared/constants";

export const OriginManagedIconsChats = ({ room, t }) => {
    const { wasReplied, origin } = room?.conversation || {};
    const { color: originColor, Icon: OrginIcon = null } = ORIGINS_ROOMS_ICONS[origin] ?? {};

    const { RepliedIcon, replieColor, replieTippyLabel } = wasReplied
        ? { RepliedIcon: ManagedIcon, replieColor: "#209F8B", replieTippyLabel: t("origin.managed") }
        : { RepliedIcon: NotManagedIcon, replieColor: "#C1272D", replieTippyLabel: t("origin.unmanaged") };

    const isMobileApp = {
        AndroidApp: function () {
            return navigator.userAgent.match(/\bAndroid\W+(?:\w+\W+){0,10}?Build\b/g);
        },
        iOSApp: function () {
            return navigator.userAgent.match(/\biPhone|iPad|iPod\W+(?:\w+\W+){0,10}?Build\b/g);
        },
    };

    const isMobile = isMobileApp.AndroidApp() || isMobileApp.iOSApp();

    if (isMobile) {
        return (
            <div className="mt-1 flex gap-3">
                {OrginIcon && (
                    <span style={{ color: originColor }} className="text-opacity-50 hover:text-opacity-100">
                        <OrginIcon width={15} height={15} />
                    </span>
                )}

                {RepliedIcon && (
                    <span style={{ color: replieColor }} className="text-opacity-50 hover:text-opacity-100">
                        <RepliedIcon width={15} height={15} />
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className="mt-1 flex gap-3">
            {OrginIcon && (
                <Tippy
                    arrow={false}
                    placement="top"
                    theme="badgeChat"
                    content={
                        <p
                            style={{ color: originColor, borderColor: originColor }}
                            className="flex items-center gap-2 rounded-10 border-1.5 bg-white p-2 font-medium">
                            <span className="text-grey-300">{t("origin.origin")}:</span> <OrginIcon width={15} height={15} /> {t(`origin.${origin}`)}
                        </p>
                    }>
                    <span style={{ color: originColor }} className="text-opacity-50 hover:text-opacity-100">
                        <OrginIcon width={15} height={15} />
                    </span>
                </Tippy>
            )}

            {RepliedIcon && (
                <Tippy
                    arrow={false}
                    placement="top"
                    theme="badgeChat"
                    content={
                        <p
                            style={{ color: replieColor, borderColor: replieColor }}
                            className="flex items-center gap-2 rounded-10 border-1.5 bg-white p-2 font-medium">
                            <RepliedIcon width={15} height={15} />
                            {replieTippyLabel}
                        </p>
                    }>
                    <span style={{ color: replieColor }} className="text-opacity-50 hover:text-opacity-100">
                        <RepliedIcon width={15} height={15} />
                    </span>
                </Tippy>
            )}
        </div>
    );
};
