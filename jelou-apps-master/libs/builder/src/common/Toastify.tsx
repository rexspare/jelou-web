import type { TypeOptions } from "react-toastify";
import { toast } from "react-toastify";

export enum TYPE_ERRORS {
    DEFAULT = "default",
    ERROR = "error",
    SUCCESS = "success",
    WARNING = "warning",
    INFO = "info",
}

export function renderMessage(message: string, type: TypeOptions) {
    toast(message, {
        type,
        icon: false,
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        progress: undefined,
        closeButton: false,
    });
}
