import isEmpty from "lodash/isEmpty";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { CHANNEL, CHANNEL_STATUS, CHANNEL_TYPES } from "../../constants";
import CardsLoading from "../cardsLoading";
import EmptyData from "../emptyData";
import DetailsCard from "./DetailsCard";
import IconCard from "./IconCard";
import NameCard from "./nameCard";
import OptionsCard from "./optionsCard";

const CardsView = ({ cardsData, searchData, setCardSelected, handleAddChannel, datastore, isLoading, moreOptionsItems, children }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const renderCardStatus = (card) => {
        switch (card?.type) {
            case CHANNEL_TYPES.WHATSAPP:
                return (
                    <div
                        className={`inline-flex items-center whitespace-nowrap rounded-md bg-opacity-[.16] py-0.75 px-4 text-sm font-bold ${
                            card?.metadata?.inProduction ? "bg-primary-200 text-primary-200" : "bg-semantic-error text-semantic-error"
                        }`}
                    >
                        {card?.metadata?.inProduction ? t("common.inProduction") : "Sandbox"}
                    </div>
                );
            default:
                return (
                    <div
                        className={`inline-flex items-center whitespace-nowrap rounded-md bg-opacity-[.16] py-0.75 px-4 text-sm font-bold ${
                            card?.status === CHANNEL_STATUS.ACTIVE ? "bg-primary-200 text-primary-200" : card?.status === CHANNEL_STATUS.NOT_ACTIVE ? "bg-semantic-error text-semantic-error" : ""
                        }`}
                    >
                        {card?.status === CHANNEL_STATUS.ACTIVE ? t("common.inProduction") : card?.status === CHANNEL_STATUS.NOT_ACTIVE ? "Sandbox" : card?.status}
                    </div>
                );
        }
    };

    if (isLoading) {
        return <CardsLoading />;
    }

    if (isEmpty(cardsData)) {
        return (
            <div className="my-10 flex h-4/5 w-full items-center justify-center">
                <EmptyData item={t(CHANNEL.PLURAL_LOWER)} itemName={datastore.name} onClick={handleAddChannel} isDatasource={true} buttonText={t(CHANNEL.SINGULAR_LOWER)} />
            </div>
        );
    }

    return (
        <>
            <div className="grid h-[calc(85vh-145px)] grid-flow-row auto-rows-[13rem] grid-cols-[repeat(auto-fill,_minMax(18.125rem,_1fr))] justify-center gap-6 overflow-y-scroll p-6 lg:h-[calc(85vh-145px)] xl:h-[calc(85vh-100px)] xxl:auto-rows-[15rem] 2xl:h-[calc(85vh-145px)]">
                {!isEmpty(searchData) &&
                    searchData.map((card, index) => (
                        <div key={`datastore-${index}`} className="relative">
                            <div
                                className="relative z-0 flex max-h-[15rem] min-h-[13rem] flex-col justify-around rounded-12 border-1 border-neutral-200 py-4 px-5 hover:cursor-pointer hover:border-primary-200/15 hover:shadow-data-card 2xl:h-[15rem]"
                                onClick={() => {
                                    setCardSelected(card);
                                    navigate(`${card?.id}/edit`);
                                }}
                            >
                                <div className="mb-3 flex items-start">
                                    <IconCard type={card?.type} />
                                    <div className="absolute top-0 right-0 mt-3 mr-1 flex items-center">
                                        {renderCardStatus(card)}
                                        <OptionsCard card={card} items={moreOptionsItems}></OptionsCard>
                                    </div>
                                </div>
                                <NameCard name={card.name} />
                                <DetailsCard items={card} justify={"between"} displayChannels={true} />
                            </div>
                        </div>
                    ))}
            </div>
            {children}
        </>
    );
};

export default CardsView;
