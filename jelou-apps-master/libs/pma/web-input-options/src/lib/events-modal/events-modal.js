import { useOnClickOutside } from "@apps/shared/hooks";
import { Transition } from "@headlessui/react";
import React, { Fragment, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";
import Fuse from "fuse.js";
import isEmpty from "lodash/isEmpty";
import { SearchIcon } from "@apps/shared/icons";
import { useTranslation } from "react-i18next";

export default function EventsModal({ closeEventsModal, customEvents, sendingEvent, handleSendEvent, showEventModal }) {
    const eventModalRef = useRef();
    useOnClickOutside(eventModalRef, closeEventsModal);
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState(customEvents);

    if (sendingEvent) {
        return (
            <div className="absolute bottom-0 left-0 z-100 mb-16 ml-2 flex max-h-xxsm w-72 items-center justify-center overflow-x-auto rounded-lg bg-white p-6 shadow-box">
                <ClipLoader size={30} color="#00b3c7" />
            </div>
        );
    }
    const inputStyle = "input input-tag h-8";

    // Search the name of the event and filter the list of events
    const searchEvent = ({ target }) => {
        let { value } = target;
        setSearchTerm(value);

        const fuseOptions = {
            keys: ["name", "description"],
            threshold: 0.4,
        };

        const fuse = new Fuse(customEvents, fuseOptions);
        const result = fuse.search(value);
        let eventsResults = [];

        result.map((event) => {
            return eventsResults.push(event.item);
        });

        console.log(eventsResults);
        setSearchResults(eventsResults);
    };

    const getFilteredEvents = () => {
        if (isEmpty(searchResults)) {
            return customEvents;
        }
        return searchResults;
    };

    const filteredEvents = getFilteredEvents();

    return (
        <div ref={eventModalRef}>
            <Transition
                show={showEventModal}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1">
                <div className="absolute bottom-0 left-0 z-100 mb-16 ml-2 w-70 overflow-x-auto rounded-lg bg-white shadow-box md:mb-20 md:w-72">
                    <div className="max-h-xxsm overflow-y-auto">
                        {isEmpty(searchResults) && !isEmpty(searchTerm) ? (
                            <div className="w-full items-center px-4 py-3 text-left text-sm sm:text-15 md:text-base">
                                {t("pma.No se encontro evento")}
                            </div>
                        ) : (
                            filteredEvents.map((event) => {
                                return (
                                    <button
                                        onClick={() => handleSendEvent(event)}
                                        className="group w-full cursor-pointer items-center px-4 py-2 text-left hover:bg-primary-600">
                                        <span className="block text-sm text-primary-200 sm:text-15 md:mb-1">{event.name}</span>
                                        <p className="text-11 leading-4 text-[#9ca3af] sm:text-xs md:leading-5">{event.description}</p>
                                    </button>
                                );
                            })
                        )}
                    </div>
                    <div className="flex border-t-default border-gray-light p-4">
                        <div className="relative w-full">
                            <div className="absolute top-0 left-0 bottom-0 ml-4 flex items-center">
                                <SearchIcon className="fill-current" width="15" height="15" />
                            </div>
                            <div className="z-10">
                                <input
                                    autoFocus
                                    id="search"
                                    type="search"
                                    className={inputStyle}
                                    placeholder={t("Buscar evento")}
                                    value={searchTerm}
                                    onChange={searchEvent}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    );
}
