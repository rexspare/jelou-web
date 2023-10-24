export const STRUCTURE_ACTIONS = {
    UPDATE_PRODUCT: "update_product",
    SEE_PRODUCT: "see_product",
    SEE_IMG_PRODUCT: "see_img_product",
    DELETE_PRODUCT: "delete_produtc",
    SEE_ORDER: "see_order",
    CANCEL_ORDER: "cancel_order",
    DELETE_CATEGORY: "delete_category",
    CREATE_PRODUCT: "create_product",
    DELETE_SUBSCRIPTION: "delete_subscription",
};

export const INITIALS_STATES_MODALS = {
    [STRUCTURE_ACTIONS.CREATE_PRODUCT]: false,
    [STRUCTURE_ACTIONS.DELETE_PRODUCT]: false,
    [STRUCTURE_ACTIONS.SEE_IMG_PRODUCT]: false,
    [STRUCTURE_ACTIONS.SEE_PRODUCT]: false,
    [STRUCTURE_ACTIONS.UPDATE_PRODUCT]: false,
    [STRUCTURE_ACTIONS.DELETE_SUBSCRIPTION]: false,
};

export const MODAL_ACTIONS_TYPES = {
    SHOW_MODAL: "SHOW_MODAL",
    HIDE_MODAL: "HIDE_MODAL",
};
