import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

export function HistoryEvent({ eventLife, isLast }) {
    const { createdAt, payload, event } = eventLife;
    const { operator } = payload;
    const { names } = operator;
    const { t } = useTranslation();

    // fecha del evento
    const dateAt = dayjs(createdAt).format("DD/MM/YYYY");
    const timeAt = dayjs(createdAt).format("HH:mm:ss");

    const { titleEvent, newStateEvnt, oldStateEvnt } = EventsAndChanges({ events: event, payload, t });

    return (
        <section className="my-3 ml-3 flex gap-2 ">
            <div>
                <div>
                    <p className="text-13 text-gray-400">{titleEvent}</p>
                    <p className={isLast ? "flex gap-1 text-13 font-semibold text-primary-200" : "flex gap-1 text-13 font-semibold text-gray-500"}>
                        <span>{oldStateEvnt}</span> a <span>{newStateEvnt}</span>
                    </p>
                </div>
                <p className="flex gap-2 text-xs font-normal text-gray-400">
                    <time>{dateAt}</time>
                    <time>{timeAt}</time>
                </p>
                <p className=" text-13 text-gray-400 text-opacity-65">
                    <span>{t("monitoring.by")} </span> {names}
                </p>
            </div>
        </section>
    );
}

function EventsAndChanges({ events, payload, t }) {
    const TYPES_EVENTS = {
        CHANGE_TICKET_DUE_DATE: (payload) => {
            const { newDate, oldDate } = payload;
            const newDateAt = dayjs(newDate).format("DD/MM/YYYY");
            const oldDateAt = dayjs(oldDate).format("DD/MM/YYYY");
            const titleEvent = t("pma.Cambio en la fecha de vencimiento");

            return { titleEvent, newStateEvnt: newDateAt, oldStateEvnt: oldDateAt };
        },
        CHANGE_TICKET_STATUS: (payload) => {
            const { newStatus, oldStatus } = payload;

            const TYPES_EVENTS_STATUS = {
                new: t("emailStatus.new"),
                pending: t("emailStatus.pending"),
                open: t("emailStatus.open"),
                closed: t("emailStatus.closed"),
                resolved: t("emailStatus.resolved"),
                draft: t("emailStatus.draft"),
            };

            const newStateEvnt = TYPES_EVENTS_STATUS[newStatus];
            const oldStateEvnt = TYPES_EVENTS_STATUS[oldStatus];
            const titleEvent = t("monitoring.stateChange");

            return { titleEvent, newStateEvnt, oldStateEvnt };
        },
        ASSIGNATION: t("pma.Email asignado a otro operador"),
        TRANSFER: t("pma.Email transferido a otro operador"),
    };
    return TYPES_EVENTS[events](payload);
}
