import { EmptyDatastoreIcon, WhatsappIcon, FacebookDSIcon, TwitterDSIcon, InstagramDSIcon, WebDSIcon } from "@apps/shared/icons";
import { CHANNEL_TYPES } from "../../constants";

const getIcon = {
    [CHANNEL_TYPES.WHATSAPP]: <WhatsappIcon width="3.25rem" height="3.25rem" />,
    [CHANNEL_TYPES.FACEBOOK]: <FacebookDSIcon width="3.25rem" height="3.25rem" />,
    [CHANNEL_TYPES.TWITTER]: <TwitterDSIcon width="3.25rem" height="3.25rem" />,
    [CHANNEL_TYPES.FACEBOOK]: <FacebookDSIcon width="3.25rem" height="3.25rem" />,
    [CHANNEL_TYPES.INSTAGRAM]: <InstagramDSIcon width="3.25rem" height="3.25rem" />,
    [CHANNEL_TYPES.WEB]: <WebDSIcon width="3.25rem" height="3.25rem" />,
    empty: <EmptyDatastoreIcon width="3.25rem" height="3.25rem" />,
};

const MultipleIcons = ({ types = "empty" }) => {
    return (
        <div className="relative h-[3.25rem]">
            {types.map((t, i) => {
                return (
                    <div key={i} className="absolute left-0 top-0" style={{ transform: `translate( ${i * 53}%, 0)`, zIndex: `${10 - i}` }}>
                        <div>{getIcon[t]}</div>
                    </div>
                );
            })}
        </div>
    );
};

export default MultipleIcons;
