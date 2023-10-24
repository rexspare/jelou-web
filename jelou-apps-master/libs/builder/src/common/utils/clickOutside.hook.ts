import { useEffect, RefObject } from "react";

type ClickOutside = {
    ref: RefObject<HTMLElement>;
    clickOutsideCallback: () => void;
};

export const useClickOutside = ({ ref, clickOutsideCallback }: ClickOutside) => {
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (ref.current && !ref.current.contains(event.target)) {
                clickOutsideCallback();
            }
        };

        document.addEventListener("click", handleClickOutside);
        document.addEventListener("contextmenu", handleClickOutside);
        document.addEventListener("auxclick", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
            document.removeEventListener("contextmenu", handleClickOutside);
            document.removeEventListener("auxclick", handleClickOutside);
        };
    }, [ref]);
};
