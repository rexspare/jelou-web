import { Transition } from "@tailwindui/react";
import { withTranslation } from "react-i18next";
import React, { useState, useEffect, useRef } from "react";

import { CloseIcon } from "@apps/shared/icons";
import { useOnClickOutside } from "@apps/shared/hooks";

const MicModalNotification = (props) => {
    const { t } = props;
    const ref = useRef();
    const [browserLink, setBrowserLink] = useState("");

    const browserSupport = {
        opera: "https://help.opera.com/en/latest/web-preferences/",
        firefox:
            "https://support.mozilla.org/en-US/kb/how-manage-your-camera-and-microphone-permissions#:~:text=Changing%20microphone%20permissions,-Click%20the%20menu&text=Preferences.-,Click%20Privacy%20%26%20Security%20from%20the%20left%20menu.,down%20to%20the%20Permissions%20section.&text=button%20for%20the%20Microphone%20option,saved%20Allow%20or%20Block%20permission.",
        safari: "https://support.apple.com/guide/mac-help/control-access-to-your-microphone-on-mac-mchla1b1e1fe/mac",
        edge: "https://support.microsoft.com/en-us/windows/windows-10-camera-microphone-and-privacy-a83257bc-e990-d54a-d212-b5e41beba857",
        chrome: "https://support.google.com/chrome/answer/2693767?co=GENIE.Platform%3DDesktop&hl=en",
    };

    useEffect(() => {
        const browser = getBrowser();
        setBrowserLink(browserSupport[browser]);
    }, []);

    const getBrowser = () => {
        // Opera 8.0+
        // var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(" OPR/") >= 0;
        // if (isOpera) {
        //     return "opera";
        // }
        // Firefox 1.0+
        var isFirefox = typeof InstallTrigger !== "undefined";

        if (isFirefox) {
            return "firefox";
        }

        // Safari 3.0+ "[object HTMLElementConstructor]"
        var isSafari =
            /constructor/i.test(window.HTMLElement) ||
            (function (p) {
                return p.toString() === "[object SafariRemoteNotification]";
            })(!window["safari"] || (typeof safari !== "undefined" && window["safari"].pushNotification));
        if (isSafari) {
            return "safari";
        }
        // Internet Explorer 6-11
        var isIE = /*@cc_on!@*/ false || !!document.documentMode;

        // Edge 20+
        var isEdge = !isIE && !!window.StyleMedia;
        if (isEdge) {
            return "edge";
        }

        // Chrome 1 - 79
        var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
        if (isChrome) {
            return "chrome";
        }
    };

    useOnClickOutside(ref, () => props.setOpenMicModal(false));

    return (
        <div ref={ref}>
            <Transition
                show={!props.micPermission && props.openMicModal}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
                className="border absolute bottom-0 right-0 z-100 mb-20 mr-6 w-56 rounded-lg border-black border-opacity-10 bg-white">
                <div className="relative">
                    <div
                        className={`absolute right-0`}
                        onClick={() => {
                            props.setOpenMicModal(false);
                        }}>
                        <span className="border-buttons mr-2 mt-2 flex cursor-pointer items-center text-gray-400 hover:text-gray-600">
                            <CloseIcon className="mx-auto fill-current" width="0.5rem" height="0.5rem" />
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <div className="w-full border-b-default py-4 text-center text-sm font-medium">{t("pma.Audio deshabilitado")}</div>
                        <a href={browserLink} target="_blank" rel="noreferrer">
                            <div className="mb-2 cursor-pointer py-2 px-4 text-left text-xs">
                                <div className="my-2 leading-4">{t("pma.Haz click aquí para saber cómo habilitarlo")}</div>
                                <img className="rounded-default shadow-md" src="https://i.imgur.com/BTBvg4l.png" alt="" />
                            </div>
                        </a>
                    </div>
                </div>
            </Transition>
        </div>
    );
};

export default withTranslation()(MicModalNotification);
