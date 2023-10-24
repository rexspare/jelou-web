import { TOAST_POSITION } from "@apps/shared/constants";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import { toast } from "react-toastify";

export function renderMessage(message, type) {
    switch (toUpper(type)) {
        case "ERROR":
            return toast.error(
                <div className="relative flex items-center justify-between">
                    <div className="flex">
                        <div className="text-15">{String(message)}</div>
                    </div>
                </div>,
                {
                    position: toast.POSITION.BOTTOM_RIGHT,
                }
            );

        case "SUCCESS":
            return toast.success(
                <div className="relative flex items-center justify-between">
                    <div className="flex">
                        <svg className="-mt-px ml-4 mr-2" width="1.563rem" height="1.563rem" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M18.0256 8.53367C18.4071 8.91514 18.4071 9.5335 18.0256 9.91478L11.4742 16.4663C11.0928 16.8476 10.4746 16.8476 10.0931 16.4663L6.97441 13.3474C6.59294 12.9662 6.59294 12.3478 6.97441 11.9665C7.35569 11.585 7.97405 11.585 8.35533 11.9665L10.7836 14.3948L16.6445 8.53367C17.0259 8.15239 17.6443 8.15239 18.0256 8.53367ZM25 12.5C25 19.4094 19.4084 25 12.5 25C5.59063 25 0 19.4084 0 12.5C0 5.59063 5.59158 0 12.5 0C19.4094 0 25 5.59158 25 12.5ZM23.0469 12.5C23.0469 6.67019 18.329 1.95312 12.5 1.95312C6.67019 1.95312 1.95312 6.67095 1.95312 12.5C1.95312 18.3298 6.67095 23.0469 12.5 23.0469C18.3298 23.0469 23.0469 18.329 23.0469 12.5Z"
                                fill="#0CA010"
                            />
                        </svg>
                        <div className="text-15">{message}</div>
                    </div>
                </div>,
                {
                    position: toast.POSITION.BOTTOM_RIGHT,
                }
            );
        default:
            return;
    }
}

export default renderMessage;

export function toastMessage({ messagePart1, messagePart2 = "", type, position = "" } = {}) {
    let toastPosition = toast.POSITION.BOTTOM_RIGHT;

    switch (position) {
        case TOAST_POSITION.TOP_RIGHT:
            toastPosition = toast.POSITION.TOP_RIGHT;
            break;
        case TOAST_POSITION.TOP_LEFT:
            toastPosition = toast.POSITION.TOP_LEFT;
            break;
        case TOAST_POSITION.TOP_CENTER:
            toastPosition = toast.POSITION.TOP_CENTER;
            break;
        case TOAST_POSITION.BOTTOM_RIGHT:
            toastPosition = toast.POSITION.BOTTOM_RIGHT;
            break;
        case TOAST_POSITION.BOTTOM_LEFT:
            toastPosition = toast.POSITION.BOTTOM_LEFT;
            break;
        case TOAST_POSITION.BOTTOM_CENTER:
            toastPosition = toast.POSITION.BOTTOM_CENTER;
            break;
        default:
            toastPosition = toast.POSITION.BOTTOM_RIGHT;
            break;
    }

    switch (toUpper(type)) {
        case "ERROR":
            return toast.error(
                <div className="relative flex items-center justify-between">
                    <div className="flex">
                        <svg className="-mt-px ml-4 mr-2" width="1.563rem" height="1.563rem" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M13 7.66667V13M13 18.3333H13.0133M25 13C25 19.6274 19.6274 25 13 25C6.37258 25 1 19.6274 1 13C1 6.37258 6.37258 1 13 1C19.6274 1 25 6.37258 25 13Z"
                                stroke="#F95A59"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <div className="justify-start text-gray-610">
                            <span className="text-15">{String(messagePart1)}</span>
                            {!isEmpty(messagePart2) && <span className="text-15 font-bold">{` "${messagePart2}"`}</span>}
                        </div>
                    </div>
                </div>,
                {
                    position: toastPosition,
                }
            );

        case "SUCCESS":
            return toast.success(
                <div className="relative flex items-center justify-between">
                    <div className="flex">
                        <svg className="-mt-px ml-4 mr-2" width="1.563rem" height="1.563rem" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M18.0256 8.53367C18.4071 8.91514 18.4071 9.5335 18.0256 9.91478L11.4742 16.4663C11.0928 16.8476 10.4746 16.8476 10.0931 16.4663L6.97441 13.3474C6.59294 12.9662 6.59294 12.3478 6.97441 11.9665C7.35569 11.585 7.97405 11.585 8.35533 11.9665L10.7836 14.3948L16.6445 8.53367C17.0259 8.15239 17.6443 8.15239 18.0256 8.53367ZM25 12.5C25 19.4094 19.4084 25 12.5 25C5.59063 25 0 19.4084 0 12.5C0 5.59063 5.59158 0 12.5 0C19.4094 0 25 5.59158 25 12.5ZM23.0469 12.5C23.0469 6.67019 18.329 1.95312 12.5 1.95312C6.67019 1.95312 1.95312 6.67095 1.95312 12.5C1.95312 18.3298 6.67095 23.0469 12.5 23.0469C18.3298 23.0469 23.0469 18.329 23.0469 12.5Z"
                                fill="#0CA010"
                            />
                        </svg>
                        <div className="justify-start text-gray-610">
                            <span className="text-15">{messagePart1}</span>
                            {!isEmpty(messagePart2) && <span className="text-15 font-bold">{` "${messagePart2}"`}</span>}
                        </div>
                    </div>
                </div>,
                {
                    position: toastPosition,
                }
            );
        default:
            return;
    }
}
