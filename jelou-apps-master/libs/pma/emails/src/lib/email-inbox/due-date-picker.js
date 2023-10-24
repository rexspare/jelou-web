import { Transition } from "@headlessui/react";
import dayjs from "dayjs";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePopper } from "react-popper";
import { first } from "lodash";
import { SyncLoader } from "react-spinners";
import { useOnClickOutside } from "@apps/shared/hooks";
import { PeriodPicker } from "@apps/pma/ui-shared";
import { JelouApiV1 } from "@apps/shared/modules";
import { addEmail, updateCurrentEmail } from "@apps/redux/store";
import { renderMessage } from "@apps/shared/common";
import { useTranslation } from "react-i18next";
import { MESSAGE_TYPES } from "@apps/shared/constants";

const DueDatePicker = (props) => {
    const { original } = props;
    const { t } = useTranslation();
    const [dueDateLoading, setDueDateLoading] = useState(false);
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const dispatch = useDispatch();

    const setDueDate = async (date, row) => {
        setDueDateLoading(true);
        const { _id: keyId } = row;
        const updatedCurrentRoom = { ...row, dueAt: date };
        await JelouApiV1.put(`support-tickets/${keyId}`, {
            sort: "DESC",
            limit: 10,
            dueAt: date,
        })
            .then(() => {
                dispatch(updateCurrentEmail(updatedCurrentRoom));
                dispatch(addEmail(updatedCurrentRoom));
                setDueDateLoading(false);
                renderMessage(t("pma.Fecha de expiracion actualizada con exito"), MESSAGE_TYPES.SUCCESS);
            })
            .catch(({ response }) => {
                const { data } = response;
                const validationError = first(get(data, "validationError.dueAt", []));
                const languageError = get(validationError, `${lang}`);
                renderMessage(languageError, MESSAGE_TYPES.ERROR);
                setDueDateLoading(false);
            });
        setDueDateLoading(false);
    };

    const actualDate = dayjs();
    const dueDate = dayjs(get(original, "dueAt"));
    const dueFinal = dayjs(dueDate).hour(23).minute(59).second(59).format();
    const actualDateFinal = dayjs(actualDate).hour(23).minute(59).second(59).format();
    const differenceDays = dayjs(dueFinal).diff(actualDateFinal, "day");
    const disabled = get(original, "status", "") === "closed";

    const [showMenu, setShowMenu] = useState(false);
    const ref = useRef(null);
    useOnClickOutside(ref, () => setShowMenu(false));
    const [popperElement, setPopperElement] = useState(null);
    const [referenceElement, setReferenceElement] = useState(null);

    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        modifiers: [
            {
                name: "offset",
                options: {
                    offset: [0, 15],
                },
            },
        ],
        placement: "left",
    });

    return dueDateLoading ? (
        <div className="flex pl-6">
            <SyncLoader color={"#00B3C7"} size={"0.24rem"} />
        </div>
    ) : (
        <div ref={ref}>
            <button
                disabled={get(original, "status", "") === "closed"}
                ref={setReferenceElement}
                onClick={() => {
                    setShowMenu(!showMenu);
                }}
                className="flex w-full flex-col text-left">
                {!isEmpty(dueDate) && get(original, "status", "") !== "closed" ? (
                    differenceDays < 0 ? (
                        <span className={"font-bold text-secondary-250"}>{t(`pma.Expirado`)}</span>
                    ) : differenceDays === 0 && differenceDays > -1 ? (
                        <span className="font-bold text-secondary-250">{t(`pma.Expira hoy`)}</span>
                    ) : differenceDays > 0 && differenceDays < 4 ? (
                        <span className="font-bold text-[#FF8A00]">{`${differenceDays === 1 ? "Falta" : "Faltan"} ${differenceDays} ${
                            differenceDays === 1 ? t("pma.dia") : t("pma.dias")
                        }`}</span>
                    ) : differenceDays > 3 ? (
                        <span className="font-bold text-secondary-425">{`Faltan ${differenceDays} ${
                            differenceDays === 1 ? t("pma.dia") : t("pma.dias")
                        }`}</span>
                    ) : (
                        ""
                    )
                ) : (
                    ""
                )}
                {!isEmpty(dueDate) && differenceDays < 1 ? (
                    <span className={`${disabled ? "text-gray-400" : "text-secondary-250"}`}>{dayjs(dueDate).locale(lang).format("DD MMMM")}</span>
                ) : !isEmpty(dueDate) && differenceDays > 0 && differenceDays < 4 ? (
                    <span className={`${disabled ? "text-gray-400" : "text-[#FF8A00]"}`}>{dayjs(dueDate).locale(lang).format("DD MMMM")}</span>
                ) : !isEmpty(dueDate) && differenceDays > 3 ? (
                    <span className={`${disabled ? "text-gray-400" : "text-secondary-425"} `}>{dayjs(dueDate).locale(lang).format("DD MMMM")}</span>
                ) : (
                    <span className={"w-full"}>-</span>
                )}
            </button>
            <Transition
                show={showMenu}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
                className="absolute z-50 -translate-x-28">
                <PeriodPicker
                    styles={styles}
                    attributes={attributes}
                    setShowMenu={setShowMenu}
                    expirationDate={new Date(dueDate)}
                    setDueDate={setDueDate}
                    setPopperElement={setPopperElement}
                    actualDateFinal={actualDateFinal}
                    row={original}
                />
            </Transition>
        </div>
    );
};

export default DueDatePicker;
