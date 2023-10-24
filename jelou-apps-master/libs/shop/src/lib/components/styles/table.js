import styled from "styled-components";

export const notificationsStyle = {
    success: "bg-green-100 text-green-960",
    error: "bg-red-200 text-red-950",
    warning: "bg-red-200 text-red-950",
    // warning: "bg-yellow-1010 text-yellow-1020",
};

export const styleStatusTable = {
    canceled: "bg-red-1010 bg-opacity-25 text-red-950",
    failed: "bg-red-1010 bg-opacity-25 text-red-950",
    pending: "bg-yellow-1010 bg-opacity-40 text-yellow-1020",
    success: "bg-green-960 bg-opacity-10 text-green-960",
};
export const statusMessage = {
    success: "bg-green-960 bg-opacity-10 text-green-960",
    error: "bg-red-100 border border-red-400 text-red-700",
};
export const orderStyle = {
    backgroundColor: "#ffffff",
    borderBottomWidth: "0.0625rem",
    borderColor: "rgba(166, 180, 208, 0.25)",
    borderTopWidth: "0.094rem",
    color: "#00B3C7",
    cursor: "pointer",
    fontSize: "0.9375rem",
    fontWeight: "bold",
    lineHeight: "1rem",
    whiteSpace: "nowrap",
    // paddingBottom: "0.5rem",
    // paddingLeft: "1.5rem",
    // paddingRight: "1rem",
    // paddingTop: "0.5rem",
    textAlign: "left",
};

export const headerStyles = {
    backgroundColor: "#ffffff",
    borderBottomWidth: "0.0625rem",
    borderColor: "rgba(166, 180, 208, 0.25)",
    borderTopWidth: "0.094rem",
    color: "rgba(112, 124, 149, 1)",
    cursor: "pointer",
    fontSize: "0.9375rem",
    fontWeight: "bold",
    lineHeight: "1rem",
    whiteSpace: "nowrap",
    // paddingBottom: "0.5rem",
    // paddingLeft: "1.5rem",
    // paddingRight: "1rem",
    // paddingTop: "0.5rem",
    textAlign: "left",
};

export const cellStyles = {
    backgroundColor: "#ffffff",
    color: "rgba(112, 124, 149, 1)",
    fontSize: "0.9375rem",
    fontWeight: "regular",
    // lineHeight: "2rem",
    // paddingBottom: "0.5rem",
    // paddingLeft: "1.5rem",
    // paddingRight: "1rem",
    // paddingTop: "0.5rem",
    textAlign: "left",
    // whiteSpace: "nowrap",
};
export const Styles = styled.div`
    display: block;
    /* min-width: 100%; */
    min-height: 40rem;
    overflow-x: scroll;
    position: relative;
    height: 69vh;

    .tableWrap {
        display: block;
        /* max-width: 100%; */
        overflow-x: scroll;
        overflow-y: hidden;
    }

    table {
        max-width: 100%;
        border-spacing: 0;
        table-layout: auto;

        thead:first-child {
            position: sticky;
            top: 0;
            z-index: 10;
        }

        thead th {
            min-width: 8rem;

            &:first-child {
                min-width: 28rem;
            }
        }

        th,
        td {
            margin: 0;
            padding: 0;
            padding-left: 1.5rem;
            padding-right: 0.5rem;
            width: 1%;
            &.collapse {
                width: 0.0000000001%;
            }
            &:first-child {
                left: 0;
                position: sticky;
                padding-right: 0.5rem;
                border-right: 1px solid rgba(166, 180, 208, 0.25);

                /* color: #727c94; */
                /* font-weight: bold !important; */
                /* font-size: 15px !important; */
            }

            /* :last-child {
                border-left: 1px solid rgba(166, 180, 208, 0.25) !important;
            }  */
        }

        td {
            color: #727c94;
            font-size: 14px;
            font-weight: 400;
            /* padding-left: 1.5rem; */
            /* padding-right: 1.5rem;  */
            /* border-bottom: 1px solid rgba(166, 180, 208, 0.25) !important; */
        }
    }
`;
