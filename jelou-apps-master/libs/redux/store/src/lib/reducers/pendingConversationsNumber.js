import { SET_PENDING_CONVERSATIONS_NUMBER } from "../constants";
import initialState from "../initialState";

const pendingConversationsNumber = (state = initialState.pendingConversationsNumber, action) => {
    switch (action.type) {
        case SET_PENDING_CONVERSATIONS_NUMBER:
            return action.payload;
        default:
            return state;
    }
};

export default pendingConversationsNumber;
