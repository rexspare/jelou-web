import React from "react";
import { ClipLoader } from "react-spinners";
import { withTranslation } from "react-i18next";

const OnlineToast = ({ online, reconnecting, reconnected, t }) => {
    if (!online) {
        return (
            <div className="fixed top-0 z-50 flex w-full items-center justify-center py-4">
                <div className="mx-2 flex h-14 w-full max-w-sm items-center rounded-md bg-red-300 px-6 font-normal sm:mx-0">
                    {t("pma.Tu computadora perdió conexión a internet")}
                </div>
            </div>
        );
    }

    if (reconnecting) {
        return (
            <div className="fixed top-0 z-50 flex w-full items-center justify-center py-4">
                <div className="mx-2 flex h-14 w-full max-w-sm items-center justify-between rounded-md bg-yellow-200 px-6 font-normal sm:mx-0">
                    {t("pma.Reconectando...")}
                    <ClipLoader color="black" size={"1.25rem"} />
                </div>
            </div>
        );
    }

    if (reconnected) {
        return (
            <div className="fixed top-0 z-50 flex w-full items-center justify-center py-4">
                <div className="mx-2 flex h-14 w-full max-w-sm items-center justify-between rounded-md bg-green-990 px-6 font-normal sm:mx-0">
                    {t("pma.Tu computadora está conectado a internet")}
                </div>
            </div>
        );
    }

    return <div></div>;
};

export default withTranslation()(OnlineToast);
