import dayjs from "dayjs";

export function HistoryEvent({ eventLife, isLast }) {
    const { createdAt, payload, event } = eventLife;
    const { operator } = payload;
    const { names } = operator;

    // fecha del evento
    const dateAt = dayjs(createdAt).format("DD/MM/YYYY");
    const timeAt = dayjs(createdAt).format("HH:mm:ss");

    const { titleEvent, newStateEvnt, oldStateEvnt } = EventsAndChanges({ events: event, payload });
    return (
        <section className="my-3 ml-3 flex gap-2 ">
            <div>
                <div>
                    <p className="text-base text-gray-400">{titleEvent}</p>
                    <p className={isLast ? "flex gap-1 text-13 font-semibold text-primary-200" : "flex gap-1 text-base font-semibold text-gray-500"}>
                        <span>{oldStateEvnt}</span> a <span>{newStateEvnt}</span>
                    </p>
                </div>
                <p className="flex gap-2 text-base font-normal text-gray-400">
                    <time>{dateAt}</time>
                    <time>{timeAt}</time>
                </p>
                <p className=" text-base text-gray-400 text-opacity-65">
                    <span>Por :</span> {names}
                </p>
            </div>
        </section>
    );
}

function EventsAndChanges({ events, payload }) {
    const TYPES_EVENTS = {
        CHANGE_TICKET_DUE_DATE: (payload) => {
            const { newDate, oldDate } = payload;
            const newDateAt = dayjs(newDate).format("DD/MM/YYYY");
            const oldDateAt = dayjs(oldDate).format("DD/MM/YYYY");
            const titleEvent = "Cambio en la fecha de vencimiento";

            return { titleEvent, newStateEvnt: newDateAt, oldStateEvnt: oldDateAt };
        },
        CHANGE_TICKET_STATUS: (payload) => {
            const { newStatus, oldStatus } = payload;

            const TYPES_EVENTS_STATUS = {
                new: "Nuevo",
                pending: "Pendiente",
                open: "Abierto",
                closed: "Cerrado",
                resolved: "Resuelto",
            };

            const newStateEvnt = TYPES_EVENTS_STATUS[newStatus];
            const oldStateEvnt = TYPES_EVENTS_STATUS[oldStatus];
            const titleEvent = "Cambio de estado";

            return { titleEvent, newStateEvnt, oldStateEvnt };
        },
        ASSIGNATION: "Tickts asignado a otro operador",
        TRANSFER: "Ticket transferido a otro operador",
    };

    return TYPES_EVENTS[events](payload);
}
