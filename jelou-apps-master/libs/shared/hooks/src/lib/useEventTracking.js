import { useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";

function useEventTracking() {
    const userSession = useSelector((state) => state.userSession);

    const trackEvent = (eventName, additionalProps = {}) => {
        const eventProps = {
            Company: userSession?.Company.name,
            IsUserImpersonated: !isEmpty(userSession?.impersonatedUser),
            ...additionalProps,
        };

        if (window.plausible === undefined) return;

        window.plausible(eventName, { props: eventProps });
    };

    return trackEvent;
}

export default useEventTracking;
