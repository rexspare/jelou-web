import dayjs from "dayjs";
import get from "lodash/get";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { useParams } from "react-router-dom";

import { BlueFlagIcon, FlagIcon, GreenFlagIcon, RedFlagIcon, SpinnerIcon, StarFillIcon, StarIcon1, YellowFlagIcon } from "@apps/shared/icons";
import { RenderButton } from "libs/pma/emails/src/lib/email/RenderButton";
import { SeeEmail } from "libs/pma/emails/src/lib/email/SeeEmail";
import { getEmail, getTableRowEmail } from "./service/email";

const PUBLIC_EMAIL_KEY = "public-email";

const PrioritiesFlags = {
    urgent: RedFlagIcon,
    high: YellowFlagIcon,
    normal: GreenFlagIcon,
    low: BlueFlagIcon,
};

const PublicEmailView = () => {
    const { botId, emailId } = useParams();
    const scrollUpRef = useRef();
    const { t } = useTranslation();

    const {
        data: messages,
        isLoading: isLoadingMessages,
        isError: isErrorMessages,
    } = useQuery([PUBLIC_EMAIL_KEY, botId, emailId], () => getEmail({ botId, emailId }), {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    const {
        data: currentEmail,
        isLoading: isLoadingCurrentEmail,
        isError: isErrorCurrentEmail,
    } = useQuery([PUBLIC_EMAIL_KEY, emailId], () => getTableRowEmail({ emailId }), {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    if (isErrorMessages || isErrorCurrentEmail) {
        return (
            <main className="mx-auto my-20 w-[60rem]">
                <div className="grid h-screen place-content-center text-primary-200">
                    <p className="text-center text-xl font-medium">
                        {t("pma.Oops! Something went wrong! Help us improve your experience by sending an error report.")}
                    </p>
                </div>
            </main>
        );
    }

    const isClosed = get(currentEmail, "status", "") === "closed";
    const Start = get(currentEmail, "isFavorite", false) ? (
        <StarFillIcon height="1.2rem" width="1.2rem" className="fill-current text-[#D39C00]" />
    ) : (
        <StarIcon1 height="1.2rem" width="1.2rem" className={`fill-current text-gray-400 ${isClosed ? "" : "hover:text-gray-500"}`} />
    );

    const Flag = PrioritiesFlags[get(currentEmail, "priority")] ?? FlagIcon;

    return (
        <main className="mx-auto my-20 w-[60rem]">
            {isLoadingMessages && isLoadingCurrentEmail ? (
                <div className="grid h-screen place-content-center text-primary-200">
                    <SpinnerIcon width={25} heigth={25} />
                </div>
            ) : (
                <>
                    <header className="flex items-center gap-3 border-b-1 border-gray-375/20 pb-4">
                        <span className="block text-xl font-bold text-primary-200">{`#${get(currentEmail, "number", "")}`}</span>
                        <RenderButton status={get(currentEmail, "status", "")} />
                        <span title="Solo lectura">{Start}</span>
                        <span title="Solo lectura">
                            <Flag width="1.2rem" height="1.2rem" className="text-gray-400" />
                        </span>
                        <p className="text-gray-400">
                            <span className="font-semibold">{t("pma.Remitente")}</span>
                            <span className="text-gray-400">
                                : {get(currentEmail, "user.name", get(currentEmail, "user.names", ""))}{" "}
                                <small>{`<${get(currentEmail, "user.email", "")}>`}</small>
                            </span>
                        </p>
                        <p className="text-gray-400">
                            <span className="font-semibold">{t("clients.assignedTo")}</span>
                            <span className="text-gray-400">: {get(currentEmail, "assignedTo.names", get(currentEmail, "assignedTo.name", ""))}</span>
                        </p>
                        <p className="text-gray-400">
                            <span className="font-semibold">{t("pma.Expiración")}</span>
                            <span className="text-gray-400">: {dayjs(get(currentEmail, "dueAt")).format("DD/MM/YYYY HH:mm")}</span>
                        </p>
                    </header>
                    <SeeEmail
                        isPublicEmail={true}
                        disableAddTag={false}
                        currentEmail={currentEmail}
                        scrollUpRef={scrollUpRef}
                        selectedRow={currentEmail}
                        sortedMessages={messages}
                    />
                </>
            )}
        </main>
    );
};

export const PmaEmailsPublicEmailView = () => {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <PublicEmailView />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};
