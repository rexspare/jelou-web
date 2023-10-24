import { useEffect, useRef, useState } from "react";

export default function useNearScreen({ once = true } = {}) {
    const [isNearScreen, setShow] = useState(false);
    const elementOfObserver = useRef();

    useEffect(
        function () {
            const handleOnChange = (entries, observer) => {
                const element = entries[0];
                if (element.isIntersecting) {
                    setShow(true);
                    once && observer.disconnect();
                } else {
                    !once && setShow(false);
                }
            };

            const observer = new IntersectionObserver(handleOnChange, {
                rootMargin: "200px",
            });

            observer.observe(elementOfObserver.current);

            return () => observer.disconnect();
        },
        [once]
    );

    return { isNearScreen, elementOfObserver };
}
