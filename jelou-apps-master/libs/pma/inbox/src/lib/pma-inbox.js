import { PmaSidebar } from "@apps/pma/sidebar";
import InboxRoom from "./inbox-room/inbox-room";
import React, { useEffect } from "react";
import { unsetCurrentRoom } from "@apps/redux/store";

const PmaInbox = (props) => {
    const { sendCustomText, rooms, currentRoom, company, bots, messages } = props;

    useEffect(() => {
        return () => {
            unsetCurrentRoom();
        };
    }, []);

    return (
        <div className="flex flex-1 flex-col overflow-y-hidden p-0 mid:pt-4">
            <div className="flex w-full flex-1 overflow-x-hidden">
                <PmaSidebar />
                <InboxRoom
                    rooms={rooms}
                    currentRoom={currentRoom}
                    company={company}
                    bots={bots}
                    sendCustomText={sendCustomText}
                    messages={messages}
                />
            </div>
        </div>
    );
};

export default PmaInbox;
