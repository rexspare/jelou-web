import React from "react";

export function renderHtml(html) {
    return (
        <div
            dangerouslySetInnerHTML={{
                __html: html,
            }}></div>
    );
}
