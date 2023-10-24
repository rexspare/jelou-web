import { withTranslation } from "react-i18next";
import Tippy from "@tippyjs/react";

const Tag = (props) => {
    const { tag, isList = false, readOnly = false, addTagChat, removeTag = false, index, t } = props;
    return (
        <div key={index} className={`h-full`} style={{ cursor: isList && !readOnly && "pointer" }}>
            <div
                className={`flex h-full items-center rounded-full px-3 text-13 font-bold text-white`}
                onClick={() => {
                    if (isList && !readOnly) {
                        addTagChat(tag);
                    }
                }}
                style={{ backgroundColor: tag.color }}>
                <p className="flex-shrink-0">{tag.name.es}</p>
                {!isList && (
                    <Tippy content={t("Eliminar")} placement={"bottom"}>
                        <button
                            hidden={isList}
                            onClick={() => removeTag(tag.id)}
                            className="ml-1 flex cursor-pointer rounded-full border-transparent text-xs font-bold text-white focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </Tippy>
                )}
            </div>
        </div>
    );
};
export default withTranslation()(Tag);
