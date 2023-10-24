import styled from "styled-components";

export const Styles = styled.div`
    display: block;
    max-width: 100%;
    .tableWrap {
        display: block;
        max-width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        width: 100%;
    }
    table {
        width: 100%;
        border-spacing: 0;
        table-layout: auto;
        border-collapse: separate;
        tr {
            height: 4rem;
            :last-child {
                td {
                    border-bottom: 0px !important;
                }
            }
            color: #727c94;
        }
        th,
        td {
            margin: 0;
            padding: 0.5rem;
            width: 1%;
            text-overflow: ellipsis;
            min-height: 6rem;
            &.collapse {
                width: 0.0000000001%;
            }
            &:last-child {
                position: sticky;
                left: 0;
                cursor: default;
                span {
                    padding-right: 0.5rem;
                    white-space: nowrap;
                    /* border-right: 1px solid rgba(166, 180, 208, 0.25); */
                }
                border-left: 1px solid rgba(166, 180, 208, 0.25) !important;
            }
        }
        td {
            border-bottom: 1px solid rgba(166, 180, 208, 0.25) !important;
        }
        th {
            min-width: fit-content;
            border-top: 1px solid rgba(166, 180, 208, 0.25) !important;
            color: #a6b4d0;
            font-size: 0.938rem;
            font-weight: bold;
            z-index: 10;
            position: sticky;
            top: 0;
            &:last-child {
                border-left: 1px solid rgba(166, 180, 208, 0.25) !important;
            }
        }
    }
    .pagination {
        padding: 0.5rem;
    }
`;
