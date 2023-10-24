import styled from "styled-components";

export const Styles = styled.div`
    display: block;
    max-width: 100%;

    .tableWrap {
        display: block;
        width: 100%;
    }

    table {
        width: 100%;
        border-spacing: 0;
        table-layout: auto;
        collapse: separate;
        tr {
            :last-child {
                td {
                    border-bottom: 0px !important;
                }
            }
        }

        th,
        td {
            margin: 0;
            padding: 0.5rem;
            text-overflow: ellipsis;
            &.collapse {
                width: 0.0000000001%;
            }
            :first-child {
                span {
                    padding-right: 0.5rem;
                    white-space: nowrap;
                }
                border-right: 1px solid rgba(166, 180, 208, 0.25) !important;
            }
            :nth-child(5) {
                width: 7rem;
            }
            :last-child {
                width: 6rem;
            }
        }

        td {
            color: #727c94;
            border-bottom: 1px solid rgba(166, 180, 208, 0.25) !important;
        }
        th {
            min-width: 9rem;
            position: sticky;
            top: 0;
            border-bottom: 1px solid rgba(166, 180, 208, 0.25) !important;
            color: #a6b4d0;
            font-size: 0.938rem;
            z-index: 5;
            font-weight: bold;
            &:first-child {
                border-right: 1px solid rgba(166, 180, 208, 0.25) !important;
            }
        }

        thead,
        tbody tr {
            display: table;
            width: 100%;
            table-layout: fixed;
        }
    }

    .pagination {
        padding: 0.5rem;
    }
`;
