import { Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef } from "react";

import { CloseIcon } from "@builder/Icons";
import { TitleNode } from "./TitleNode";
import { useSliderOver } from "./sliderOver.hook";

type Props = {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    nodeId: string;
};

export function SlideOverCustom({ open, onClose, children, nodeId }: Props) {
    const { bgColor, maxWidth, textColor } = useSliderOver({ nodeId });
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const listener = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        const clickListener = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                const isOtherNode = !(event.target as HTMLElement).classList.contains("react-flow__pane");

                if (!isOtherNode) {
                    onClose();
                }
            }
        };

        window.addEventListener("keydown", listener);
        document.addEventListener("click", clickListener);

        return () => {
            window.removeEventListener("keydown", listener);
            document.removeEventListener("click", clickListener);
        };
    }, []);

    return (
        <Transition.Root show={open} as={Fragment} ref={modalRef}>
            <div className="relative z-10">
                <div className="absolute inset-y-0 right-0 overflow-hidden">
                    <div style={{ maxWidth }} className="pointer-events-none fixed inset-y-0 right-0 flex w-full">
                        <Transition.Child
                            as={Fragment}
                            enter="transform transition ease-in-out duration-300"
                            enterFrom="translate-x-full"
                            enterTo="translate-x-0"
                            leave="transform transition ease-in-out duration-300"
                            leaveFrom="translate-x-0"
                            leaveTo="translate-x-full"
                        >
                            <div className="pointer-events-auto w-full bg-white shadow-xl">
                                <div
                                    style={{
                                        backgroundColor: bgColor,
                                        color: textColor,
                                    }}
                                    className="flex h-16 items-center justify-between border-b-1 border-solid border-gray-230 px-6 text-[#747C92]"
                                >
                                    <TitleNode nodeId={nodeId} />
                                    <button
                                        type="button"
                                        className="focus:ring-2 flex h-9 w-9 items-center justify-center rounded-md hover:bg-[#F4FBFC]/50 focus:outline-none focus:ring-transparent"
                                        onClick={onClose}
                                    >
                                        <span className="sr-only">Close panel</span>
                                        <CloseIcon width={24} height={24} />
                                    </button>
                                </div>
                                {children}
                            </div>
                        </Transition.Child>
                    </div>
                </div>
            </div>
        </Transition.Root>
    );
}
