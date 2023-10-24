import styled from "styled-components";

export const orderStyle = {
    borderBottomWidth: "0.094rem",
    borderColor: "rgba(166, 180, 208, 0.25)",
    color: "rgba(0, 179, 199, 1)",
    cursor: "pointer",
    fontSize: "0.9375rem",
    fontWeight: 700,
    lineHeight: "1.25rem",
    paddingBottom: "1rem",
    paddingLeft: "1.5rem",
    paddingRight: "1.5rem",
    paddingTop: "1rem",
    textAlign: "left",
};

export const headerStyles = {
    borderBottomWidth: "0.094rem",
    borderColor: "rgba(166, 180, 208, 0.25)",
    color: "rgba(112, 124, 149, 0.7)",
    cursor: "pointer",
    fontSize: "0.9375rem",
    fontWeight: 700,
    lineHeight: "1.25rem",
    paddingBottom: "1rem",
    paddingLeft: "1.5rem",
    paddingRight: "1.5rem",
    paddingTop: "1rem",
    textAlign: "left",
};

export const cellStyles = {
    cursor: "pointer",
    fontSize: "0.9375rem",
    fontWeight: 400,
    lineHeight: "1.25rem",
    paddingBottom: "1rem",
    paddingLeft: "1.5rem",
    paddingRight: "1.5rem",
    paddingTop: "1rem",
    textAlign: "left",
};

export const Styles = styled.div`
    display: block;
    max-width: 100%;

    .tableWrap {
        display: block;
        max-width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
    }

    table {
        width: 100%;
        border-spacing: 0;
        table-layout: auto;
        background-color: white;
        border-radius: 0.75rem;

        tr {
            :last-child {
                td {
                    border-bottom: 0px !important;
                }
            }
            &:hover {
                color: rgba(0, 179, 199, 1);
                /* background-color: rgba(230, 247, 249, 0.3); */
            }
            color: #727c94;
        }

        th,
        td {
            margin: 0;
            padding: 0.5rem;
            :first-child {
                width: 16rem;
                border-right: 1px solid rgba(166, 180, 208, 0.25) !important;
            }
            :last-child {
                width: ${(props) => (props.isDatabase ? "9rem" : "13rem")};
                border-left: 1px solid rgba(166, 180, 208, 0.25) !important;
            }
        }

        td {
            border-bottom: 1px solid rgba(166, 180, 208, 0.25) !important;
        }
    }

    .pagination {
        padding: 0.5rem;
    }
`;
