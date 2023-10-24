import isArray from "lodash/isArray";
import isEmpty from "lodash/isEmpty";
import trim from "lodash/trim";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { CloseIcon1 } from "@apps/shared/icons";

function AddFrom({ title, from, tipTapRef, setFrom, blackListEmails, setShowError, showError = false }) {
    const { t } = useTranslation();
    const input = useRef();
    const [voidInput, setVoidInput] = useState(false);

    useEffect(() => {
        if (from.length > 0) setShowError(false);
    }, [from]);

    const scrollToTag = (targetRef) => {
        if (targetRef.current) {
            if (targetRef.current) {
                targetRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        }
    };

    useEffect(() => {
        if (showError) {
            scrollToTag(tipTapRef);
        }
    }, [showError]);

    const notify = (message) => {
        return toast.error(message, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    useEffect(() => {
        if (voidInput) {
            input.current.value = "";
            setVoidInput(false);
        }
    }, [voidInput]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isArray(input.current.value.split(","))) {
            input.current.value.split(",").forEach((item) => {
                checkIfBlackList(item);
            });
        } else {
            if (!isEmpty(trim(input.current.value))) {
                checkIfBlackList(input.current.value);
            }
        }
    };

    const checkIfBlackList = (item) => {
        if (!isEmpty(trim(item))) {
            setFrom((pre) => {
                if (!pre.includes(item)) {
                    if (!pre.includes(item)) {
                        return [...pre, trim(item)];
                    }
                } else {
                    notify(`${t("pma.Ya agregaste como destinatario el siguiente email")}: ` + item);
                    return [...pre];
                }
            });
            setVoidInput(true);
        }
    };
    const deleteFrom = (index) => {
        const newFrom = from.filter((item, i) => i !== index);
        setFrom(newFrom);
    };

    const disableFrom = from.length > 0;

    return (
        <div className="flex">
            <div className="flex w-full">
                <div className="flex">
                    <div className="flex items-center space-x-2 whitespace-pre-line">
                        <span className="text-sm font-medium text-gray-400">{t(title)}:</span>
                        {from.map((ticket, index) => {
                            return (
                                <div
                                    className="relative flex items-center justify-between rounded-[1.25rem] bg-[#00b3c719] px-3 py-1 text-sm text-primary-200"
                                    key={index}>
                                    <span className="mr-2">{ticket}</span>
                                    <button
                                        className="ml-1 flex cursor-pointer rounded-full text-xs font-bold text-black focus:outline-none"
                                        key={index}
                                        onClick={() => deleteFrom(index)}>
                                        <CloseIcon1 className="fill-current text-gray-400" width="0.4375rem" height="0.4375rem" />
                                    </button>
                                </div>
                            );
                        })}

                        <form onSubmit={handleSubmit}>
                            <input
                                onBlur={handleSubmit}
                                className={`relative ${
                                    isEmpty(from) && showError ? `rounded-md border-default border-red-500 shadow-input` : ""
                                } flex items-center justify-between border-transparent p-0 pl-3 text-sm text-gray-400 focus:border-transparent focus:ring-transparent disabled:!bg-white`}
                                ref={input}
                                id="email"
                                type="email"
                                autoFocus
                                multiple
                                disabled={disableFrom}
                            />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddFrom;
