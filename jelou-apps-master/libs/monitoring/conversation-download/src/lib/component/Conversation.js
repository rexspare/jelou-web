import { Messages } from "libs/monitoring/ui-shared/src";
import { ConversationSkeleton } from "@apps/shared/common";

export function Conversation({ currentRoom = {}, messages = [] } = {}) {
    let loadingSkeleton = [];

    for (let i = 0; i < 8; i++) {
        loadingSkeleton.push(<ConversationSkeleton key={i} />);
    }

    return <Messages setLoadingMessages={() => null} messages={messages} loadingSkeleton={loadingSkeleton} currentRoom={currentRoom} />;
}
