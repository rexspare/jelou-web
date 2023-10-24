
/** Generate a button with a tooltip */

import { default as Tippy } from "@tippyjs/react";

const ButtonWithTippy = (props) => {
    const { onClick, icon, tooltipContent } = props;

    return (
        <Tippy
            theme="light"
            placement="top"
            trigger="mouseenter"
            arrow={false}
            touch={false}
            content={<span className="text-gray-400">{tooltipContent}</span>}>
            <button onClick={onClick}>{icon}</button>
        </Tippy>
    );
}

export default ButtonWithTippy;