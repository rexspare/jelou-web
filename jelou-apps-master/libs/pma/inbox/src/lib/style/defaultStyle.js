const defaultStyle = {
    control: {},

    "&multiLine": {
        control: {
            maxHeight: "7.813rem",
            overflow: "auto",
        },
        highlighter: {
            // border: "1px solid transparent",
        },
        input: {
            border: "0px solid transparent",
            boxShadow: "var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color)",
            color: "#727C94",
        },
    },

    "&singleLine": {
        display: "inline-block",
        width: "11.25rem",

        highlighter: {
            padding: 1,
            border: "0.125rem inset transparent",
        },
        input: {
            padding: 1,
            border: "0.125rem inset",
            color: "#727C94",
        },
    },

    suggestions: {
        zIndex: 9999,
        backgroundColor: "transparent",
        maxHeight: "25rem",
        overflow: "auto",
        boxShadow: "0rem 0rem 1.25rem #EAF0F7",
        border: "0.063rem solid rgba(0, 0, 0, 0.1)",
        borderRadius: "0.625rem",
        list: {
            backgroundColor: "white",
            fontSize: "0.85rem",
            overflow: "hidden",
            minWidth: "15.625rem",
            zIndex: 9999,
            color: "#727C94",
        },
        item: {
            padding: "0.75rem 1rem",
            "&focused": {
                backgroundColor: "#E7F6F8",
                color: "#00B3C7",
            },
        },
    },
};
export default defaultStyle;
