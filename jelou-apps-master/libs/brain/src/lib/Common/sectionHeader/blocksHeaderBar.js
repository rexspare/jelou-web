import Tippy from "@tippyjs/react";
import isEmpty from "lodash/isEmpty";

import { TRUNCATION_CHARACTER_LIMITS } from "../../constants";
import ConditionalTruncateTippy from "../conditionalTruncateTippy";

const BlocksHeaderBar = ({ header, secondaryHeader, actionClick, tertiaryHeader, isHeaderLong, datastoreId, hasFlows, isSkill }) => {
    return (
        <>
            <span>/</span>
            {isHeaderLong ? (
                <Tippy theme="light" placement="auto" touch={false} trigger="mouseenter" content={<span className="font-bold text-gray-400">{header}</span>}>
                    <span className="trucate w-72 overflow-hidden">{header}</span>
                </Tippy>
            ) : (
                <span
                    className="cursor-pointer"
                    onClick={ secondaryHeader ? actionClick : null}
                >{header}</span>
            )}
            {!isEmpty(secondaryHeader) && (
                <>
                    <span className={hasFlows || isSkill ? "font-bold" : ""}>/</span>
                    <ConditionalTruncateTippy
                        actionClick={secondaryHeader ? actionClick : null}
                        text={secondaryHeader}
                        charactersLimit={TRUNCATION_CHARACTER_LIMITS.HEADER}
                        textStyle={hasFlows || isSkill ? "font-bold text-primary-200" : ""}
                    />
                </>
            )}
            {!isEmpty(tertiaryHeader) && (
                <>
                    <span className="font-bold">/</span>
                    <ConditionalTruncateTippy text={tertiaryHeader} charactersLimit={TRUNCATION_CHARACTER_LIMITS.HEADER} textStyle={"font-bold text-primary-200"} />
                </>
            )}
        </>
    );
};

export default BlocksHeaderBar;
