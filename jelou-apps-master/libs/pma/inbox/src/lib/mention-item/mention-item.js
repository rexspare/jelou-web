import React from "react";

const MentionItem = ({ entry, search, highlightedDisplay, index, focused }) => {
    const { names } = entry;
    const abbr = names
        .split(" ")
        .map(function (item) {
            return item[0];
        })
        .join("");

    return (
        <div className="flex items-center justify-between font-light">
            <div className="flex items-center">
                <div className="bg-light relative mr-2 flex h-6 w-6 items-center justify-center rounded-full text-xs uppercase text-white">
                    {abbr.slice(0, 2)}
                    <span className="ring-2 border absolute top-0 right-0 block h-2 w-2 rounded-full border-white bg-green-850 ring-white" />
                </div>
                {highlightedDisplay}
            </div>
        </div>
    );
};

export default MentionItem;
