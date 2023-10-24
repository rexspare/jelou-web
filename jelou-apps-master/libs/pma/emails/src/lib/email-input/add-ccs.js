import isEmpty from "lodash/isEmpty";
import trim from "lodash/trim";
import toLower from "lodash/toLower";
import isArray from "lodash/isArray";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { CloseIcon1 } from "@apps/shared/icons";

function AddCCs({ title, cc, setCc, blackListEmails }) {
    const { t } = useTranslation();
    const input = useRef();
    const [voidInput, setVoidInput] = useState(false);

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
        const itemLower = toLower(item);

        if (!isEmpty(trim(itemLower))) {
            setCc((pre) => {
                if (!pre.includes(itemLower) && !blackListEmails.includes(itemLower)) {
                    if (!pre.includes(itemLower)) {
                        return [...pre, trim(item)];
                    }
                } else {
                    if (blackListEmails.includes(itemLower)) {
                        notify(`${t("pma.No está permitido enviar al siguiente destinatario")}: ` + item);
                    } else {
                        notify(`${t("pma.Ya agregaste como destinatario el siguiente email")}: ` + item);
                    }
                    return [...pre];
                }
            });
            setVoidInput(true);
        }
    };

    const deleteCc = (index) => {
        const newCc = cc.filter((item, i) => i !== index);
        setCc(newCc);
    };

    return (
        <div className="flex">
            <div className="flex w-full">
                <div className="flex">
                    <div className="flex items-center space-x-2 whitespace-pre-line">
                        <span className="text-sm font-medium text-gray-400">{t(title)}:</span>

                        <div className="grid grid-cols-4 items-center gap-2">
                            {cc.map((ticket, index) => {
                                return (
                                    <div className="relative flex items-center justify-between rounded-[1.25rem] bg-[#00b3c719] px-3 py-1 text-sm text-primary-200" key={index}>
                                        <span className="mr-2">{ticket}</span>
                                        <button className="ml-1 flex cursor-pointer rounded-full text-xs font-bold text-black focus:outline-none" key={index} onClick={() => deleteCc(index)}>
                                            <CloseIcon1 className="fill-current text-gray-400" width="7px" height="7px" />
                                        </button>
                                    </div>
                                );
                            })}
                            <form onSubmit={handleSubmit}>
                                <input
                                    onBlur={handleSubmit}
                                    className="relative flex items-center justify-between border-transparent p-0 pl-3 text-sm text-gray-400 focus:border-transparent focus:ring-transparent"
                                    ref={input}
                                    id="email"
                                    type="email"
                                    autoFocus
                                    multiple
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddCCs;
