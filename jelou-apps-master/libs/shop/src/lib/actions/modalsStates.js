import { MODAL_ACTIONS_TYPES } from "../hooks/constants.structureCols";

export const modalsActions = (state, action) => {
    switch (action.type) {
        case MODAL_ACTIONS_TYPES.SHOW_MODAL: {
            return {
                ...state,
                [action.payload]: true,
            };
        }
        case MODAL_ACTIONS_TYPES.HIDE_MODAL: {
            return {
                ...state,
                [action.payload]: false,
            };
        }

        default:
            return state;
    }
};

export const actionShowModal = (typeModal) => ({
    type: MODAL_ACTIONS_TYPES.SHOW_MODAL,
    payload: typeModal,
});

export const actionHideModal = (typeModal) => ({
    type: MODAL_ACTIONS_TYPES.HIDE_MODAL,
    payload: typeModal,
});
