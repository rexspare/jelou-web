import { useFormattedCardTimestamps } from "../../hooks/helpers";
import BadgeTypes from "./BadgeTypes";

const DetailsCard = (props) => {
    const { displayChannels, items, justify = "between" } = props;
    const formatterCardTimestamps = useFormattedCardTimestamps(items);
    const cards = displayChannels ? formatterCardTimestamps : items;

    return (
        <>
            {cards.map((card, idx) => (
                <div key={idx} className={`flex w-full flex-row items-center gap-2 justify-${justify}`}>
                    <span className="text-sm font-medium text-gray-400">{card?.key}: </span>
                    {card?.badgeTypes ? (
                        <span className="py-1">
                            <BadgeTypes types={card?.value} />
                        </span>
                    ) : (
                        <span className="break-words text-sm text-gray-400">{card?.value}</span>
                    )}
                </div>
            ))}
        </>
    );
};

export default DetailsCard;
