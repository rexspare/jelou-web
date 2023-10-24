import Tippy from "@tippyjs/react";
import { useState, useEffect, useRef } from "react";

const size = 24;

const ListItem = ({ Icon, initialData, nodeType, text, showText, dragImage, isContextual, showTooltip }) => {
    const [dragging, setDragging] = useState(false);
    const [img, setImg] = useState(null);
    const liRef = useRef(null);
    const height = liRef.current?.offsetHeight;

    useEffect(() => {
        const image = new Image();
        image.src = dragImage;
        image.onload = () => setImg(image);
    }, []);

    const handleDragStart = (evt) => {
        const data = JSON.stringify({ initialData, nodeType });
        evt.dataTransfer.setData("text/plain", data);
        evt.dataTransfer.effectAllowed = "move";

        if (img) {
            evt.dataTransfer.setDragImage(img, 25, 25);
        }

        setDragging(true);
    };

    const handleDragEnd = () => {
        setDragging(false);
    };

    const menuStyles = isContextual ? "flex-row justify-start gap-x-2 text-sm px-4 h-[52px]" : "flex-col justify-center gap-y-1 text-10";
    const itemSize = isContextual ? "w-full" : showText ? "min-h-[48px] py-1 w-full" : "h-[2.625rem] w-[2.625rem]";
    const dragginStyles = dragging ? "border-dashed border-gray-200 bg-gray-400" : "";

    return (
        <div className="w-full">
            <Tippy content={text} theme="jelou" placement="right" disabled={!showTooltip}>
                <li
                    draggable={true}
                    ref={liRef}
                    style={{ height }}
                    className={`flex cursor-[grab] ${menuStyles} ${itemSize} items-center rounded-[8px] border-2 border-transparent text-gray-400 hover:bg-[#f1f6f7] ${dragginStyles}`}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    {!dragging ? <Icon width={size} height={size} /> : null}
                    {!dragging && (showText || isContextual) && <p className="text-center font-semibold leading-none text-gray-400">{text}</p>}
                </li>
            </Tippy>
            <img src={dragImage} rel="preload" as="image" alt="" width={size} height={size} className="hidden" />
        </div>
    );
};

export function ActionsList({ list, showText = false, isContextual = false, showTooltip = true } = {}) {
    return (
        list &&
        list.length > 0 &&
        list.map((item) => {
            const { id, ...props } = item;
            return <ListItem key={id} {...props} showText={showText} isContextual={isContextual} showTooltip={showTooltip} />;
        })
    );
}
