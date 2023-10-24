import React from "react";
import toUpper from "lodash/toUpper";
import { toast } from "react-toastify";
import { DesactivateIcon } from "@apps/shared/icons";

export default function RenderMessage(message, type) {
    console.log("RenderMessage", message);
    switch (toUpper(type)) {
        case "ERROR":
            return toast.error(
                <div className="relative flex items-center justify-between">
                    <div className="flex">
                        <div className="text-15">{message}</div>
                    </div>

                    {/* <div className="flex pl-10">
                        <DesactivateIcon width="1.1875rem" height="1.1875rem" />
                    </div> */}
                </div>,
                {
                    closeButton: false,
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

                    {/* <div className="flex  pl-10">
                        <svg width="1.125rem" height="1.125rem" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M10.6491 9.00013L17.6579 1.99094C18.114 1.53502 18.114 0.797859 17.6579 0.341939C17.202 -0.11398 16.4649 -0.11398 16.0089 0.341939L8.99989 7.35114L1.99106 0.341939C1.53493 -0.11398 0.798002 -0.11398 0.342092 0.341939C-0.114031 0.797859 -0.114031 1.53502 0.342092 1.99094L7.35093 9.00013L0.342092 16.0093C-0.114031 16.4653 -0.114031 17.2024 0.342092 17.6583C0.5693 17.8858 0.868044 18 1.16657 18C1.4651 18 1.76363 17.8858 1.99106 17.6583L8.99989 10.6491L16.0089 17.6583C16.2364 17.8858 16.5349 18 16.8334 18C17.132 18 17.4305 17.8858 17.6579 17.6583C18.114 17.2024 18.114 16.4653 17.6579 16.0093L10.6491 9.00013Z"
                                fill="#596859"
                            />
                        </svg>
                    </div> */}
                </div>,
                {
                    // closeButton: false,
                    position: toast.POSITION.BOTTOM_RIGHT,
                }
            );
        default:
            return null;
    }
}
