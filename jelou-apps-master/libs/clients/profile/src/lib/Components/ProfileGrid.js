import get from "lodash/get";
import sortBy from "lodash/sortBy";
import reverse from "lodash/reverse";
import React, { useContext, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";
import { useOnClickOutside } from "@apps/shared/hooks";
import { ProfileIcon } from "@apps/shared/icons";
import { Modal } from "@apps/shared/common";
import CardModal from "./CardModal";
import ProfileCard from "./ProfileCard";
import { useTranslation } from "react-i18next";
import { DateContext } from "@apps/context";

const ProfileGrid = (props) => {
    const { data, sortOrder, maxPage, pageLimit, setPageLimit, loadingCards, getStoredParams, loadingProfile, query, field } = props;
    const dayjs = useContext(DateContext);
    const { t } = useTranslation();
    const cardsRef = useRef();
    const [showModal, setShowModal] = useState(false);
    const [card, setCard] = useState([]);
    const modalRef = useRef();

    const getFilteredRooms = () => {
        if (sortOrder === "asc_alphabet") {
            return sortBy(data, ["names"]);
        }
        if (sortOrder === "desc_alphabet") {
            return reverse(sortBy(data, ["names"]));
        }

        if (sortOrder === "desc_client") {
            let ascending = [...data];
            ascending = ascending.sort(function (a, b) {
                return dayjs(b.createdAt, "DD/MM/YYYY / hh:mm:ss") - dayjs(a.createdAt, "DD/MM/YYYY / hh:mm:ss");
            });
            return ascending;
        }

        if (sortOrder === "asc_client") {
            let descending = [...data];
            descending = descending.sort(function (a, b) {
                return dayjs(a.createdAt, "DD/MM/YYYY / hh:mm:ss") - dayjs(b.createdAt, "DD/MM/YYYY / hh:mm:ss");
            });
            return descending;
        }
        return reverse(sortBy(data, ["names"]));
    };

    const filterRoom = getFilteredRooms();

    const onScroll = async (evt) => {
        try {
            const target = evt.target;

            const bottom = target.scrollHeight - target.scrollTop === target.clientHeight;
            if (bottom && pageLimit < maxPage) {
                const page = pageLimit + 1;
                setPageLimit(page);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleModal = (card) => {
        setShowModal(true);
        setCard(card);
        getStoredParams(card);
    };

    function closeProfile() {
        setShowModal(false);
    }

    useOnClickOutside(modalRef, () => setShowModal(false));

    return (
        <>
            <div className="my-5 grid grid-cols-5 gap-5 overflow-y-auto pb-10" ref={cardsRef} onScroll={onScroll}>
                {filterRoom.map((client, index) => (
                    <ProfileCard key={index} card={client} type={get(client, "botType", "")} handleModal={handleModal} query={query} field={field} />
                ))}
            </div>
            {showModal && (
                <Modal>
                    <div className="fixed inset-x-0 top-0 z-60 px-4 pt-8 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 z-20 bg-gray-490/75" />
                        </div>
                        <div className="mx-auto h-auto max-w-4xl overflow-y-auto" ref={modalRef}>
                            <CardModal card={card} loadingProfile={loadingProfile} closeProfile={closeProfile} onClose={closeProfile} />
                        </div>
                    </div>
                </Modal>
            )}
            {loadingCards && (
                <div className="my-5 flex items-end justify-center">
                    <ClipLoader size={"3.5rem"} color="#00B3C7" />
                </div>
            )}
            {!loadingCards && (
                <div className="my-2 flex w-full justify-end space-x-2 pr-2 text-base text-gray-400">
                    <ProfileIcon width="17" height="17" className="mt-1 fill-current text-gray-400" />
                    {t("clients.totalClients")}: {data.length}
                </div>
            )}
        </>
    );
};
export default ProfileGrid;
