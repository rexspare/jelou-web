import { useEffect } from "react";

// Hook
export default function useOnClickInside(ref, handler) {
    useEffect(() => {
        const listener = (event) => {
            // Do nothing if clicking ref's element or descendent elements
            if (!ref?.current || ref.current?.contains(event.target)) {
                return;
            }

            handler(event);
        };

        // Bind the event listener
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchend", listener);

        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchend", listener);
        };
    }, [ref, handler]);
}
