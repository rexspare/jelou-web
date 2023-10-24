import React, { useState, useEffect } from "react";
import Tippy from "@tippyjs/react";
import isEmpty from "lodash/isEmpty";

const ConditionalTruncateWithTooltip = (props) => {
  const {
    text,
    maxCharactersAllowed=0,
    maxLinesAllowed="2",
    textStyle="",
    componentType,
    placement="auto",
    width="",
    actionClick=null,
  } = props;

  const validComponentTypes = ["span", "div", "p", "h1", "h2", "h3"];
  const ComponentToRender = validComponentTypes.includes(componentType) ? componentType : "span";

  const [shouldApplyTippy, setShouldApplyTippy] = useState(false);

  useEffect(() => {
    setShouldApplyTippy(text && text.length > maxCharactersAllowed);
  }, [text]);


  if (shouldApplyTippy) {
    return (
      <Tippy
        theme="light"
        placement={placement}
        touch={false}
        trigger="mouseenter"
        content={<span className="font-bold text-gray-400">{text}</span>}
      >
        <ComponentToRender
          onClick={actionClick}
          className={`line-clamp-${maxLinesAllowed} ${!isEmpty(actionClick) && "cursor-pointer"} ${textStyle} ${width || "w-32"}`}
        >
          {text}
        </ComponentToRender>
      </Tippy>
    );
  } else {
    return (
      <ComponentToRender onClick={actionClick} className={`${!isEmpty(actionClick) && "cursor-pointer"} ${textStyle}`}>
        {text}
      </ComponentToRender>
    );
  }
};

export default ConditionalTruncateWithTooltip;
