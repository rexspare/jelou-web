import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import { ITEM_TYPES } from "../../../constants";
import { useBlocks } from "../../../services/brainAPI";
import RowsSkeleton from "../../../Common/rowsSkeleton";
import Block from "./block";

const GenericDatasourceComponent = (props) => {
    const { sourceId, datasource, fetchBlocks, setHasBlocks, setHasFlows } = props;
    const { t } = useTranslation();
    const showTesterChat = useSelector((state) => state.showTesterChat);
    const [selectedBlockIndex, setSelectedBlockIndex] = useState(null);
    const [editableBlockIndex, setEditableBlockIndex] = useState(null);
    const [blockId, setBlockId] = useState(null);
    const [blocks, setBlocks] = useState([]);
    const rawBlockId = localStorage.getItem("blockId");

    const { data, isFetching, refetch } = useBlocks({ sourceId, fetchData: fetchBlocks });

    const selectBlock = (blockIndex) => {
        const blockElement = document.getElementById(`block-container-${blockIndex}`);
        if (blockElement) {
            blockElement.scrollIntoView({ behavior: "smooth" });
            setSelectedBlockIndex(blockIndex);
        }
    };

    const handleGoToBlock = (index) => {
        selectBlock(index);
    };

    useEffect(() => {
        setHasFlows(false);
    }, []);

    useEffect(() => {
        if (showTesterChat) {
            const parsedBlockId = JSON.parse(rawBlockId);
            if (parsedBlockId) {
                setBlockId(parsedBlockId);
            }
        } else {
            localStorage.removeItem("blockId");
        }

        if (!isFetching) {
            const blocks = get(data, "data", []);
            const isArray = Array.isArray(blocks);
            if (!isEmpty(blocks)) {
                setHasBlocks(true);
                isArray ? setBlocks(blocks) : setBlocks([blocks]);
            }
        }
    }, [isFetching, data]);

    useEffect(() => {
        if (!isEmpty(datasource) && !isEmpty(sourceId) && (datasource?.type !== ITEM_TYPES.FLOW ||  datasource?.type !== ITEM_TYPES.SKILL)) {
            refetch();
        }
    }, [datasource, sourceId]);

    useEffect(() => {
        if (!isEmpty(blocks)) {
            const testerChatBlockIndex = blocks.findIndex((block) => block.id === blockId);
            if (testerChatBlockIndex !== -1) {
                selectBlock(testerChatBlockIndex);
            }
        }
    }, [blockId, blocks]);

    if (isFetching) {
        return (
            <>
                <div className="no-scrollbar sticky top-0 w-1/4 flex-row space-y-2 overflow-y-auto border-r-1 border-neutral-200 pr-8">
                    <RowsSkeleton />
                </div>
                <div className="w-3/4">
                    <RowsSkeleton />
                </div>
            </>
        );
    }

    return (
        <>
            <div className="no-scrollbar sticky top-0 w-1/4 flex-row space-y-2 overflow-y-auto border-r-1 border-neutral-200 pr-8">
                {blocks.map((block, index) => {
                    const blockNumber = (index + 1).toString().padStart(2, "0");
                    const isSelected = index === selectedBlockIndex;
                    return (
                        <button
                            className={`${
                                isSelected ? "1 border-1 border-neutral-200 font-bold text-gray-610" : ""
                            } w-full  rounded-lg px-7 py-2 text-left text-gray-400 hover:border-1 hover:border-neutral-200 hover:font-bold hover:text-gray-610 focus:border-1 focus:border-neutral-200 focus:font-bold focus:text-gray-610`}
                            type="button"
                            key={index}
                            onClick={() => {
                                handleGoToBlock(index);
                            }}>
                            <span className="mr-2 text-gray-400 font-bold line-clamp-2">{block.title || "-"}</span>
                            <span className="mr-2 text-gray-300 capitalize block">{`${t(ITEM_TYPES.BLOCK)} ${blockNumber}`}</span>
                        </button>
                    );
                })}
            </div>
            <div className="w-3/4">
                {blocks.map((block, idx) => {
                    const isSelected = idx === selectedBlockIndex;
                    const isEditable = idx === editableBlockIndex;
                    return (
                        <div
                            key={`block-${idx}`}
                            id={`block-container-${idx}`}
                            className={`${blocks?.length === 1 ? "h-full" : ""} ${
                                blocks?.length > 1 && idx !== blocks?.length - 1 ? "border-b-1 border-neutral-200" : ""
                            } ${idx > 0 ? "mt-11 pt-1" : ""} ${idx === blocks?.length - 1 ? "pb-10":""}`}>

                            <Block
                                index={idx}
                                renderedBlock={block}
                                isBlockSelected={isSelected}
                                isBlockEditable={isEditable}
                                sourceId={sourceId}
                                blocksQuantity={blocks?.length}
                                setSelectedBlockIndex={setSelectedBlockIndex}
                                editableBlockIndex={editableBlockIndex}
                                setEditableBlockIndex={setEditableBlockIndex}
                                refetch={refetch}
                            />
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default GenericDatasourceComponent;
