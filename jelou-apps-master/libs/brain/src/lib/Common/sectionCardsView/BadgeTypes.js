import { useTranslation } from "react-i18next";
import Tippy from "@tippyjs/react";
import isEmpty from "lodash/isEmpty";
import { DATASOURCE_TYPES } from "../../constants";

const BadgeTypes = ({ types }) => {
    const { t } = useTranslation();

    return (
        <div className="flex gap-x-1">
            {isEmpty(types) ? (
                <div className="flex h-fit items-center rounded-lg bg-gray-400 bg-opacity-[.16]">
                    <span className="px-2 py-0.75 text-sm font-bold text-gray-400">-</span>
                </div>
            ) : types.length > 2 ? (
                <>
                    {types.slice(0, 2).map((type, index) => {
                        return (
                            <div key={`type-${type}-${index}`} className="flex h-fit items-center rounded-lg bg-primary-200 bg-opacity-[.16]">
                                <span className="px-2 py-0.75 text-sm font-bold text-primary-200">
                                    {
                                        type === DATASOURCE_TYPES.TEXT
                                        ? t("common.text")
                                        : type === DATASOURCE_TYPES.FILE
                                        ? t("common.file")
                                        : type === DATASOURCE_TYPES.WORKFLOW
                                        ? t("common.flow")
                                        : type === DATASOURCE_TYPES.WEBPAGE
                                        ? t("common.webpage")
                                        : type
                                    }
                                </span>
                            </div>
                        );
                    })}
                    <Tippy
                        theme="light"
                        placement="top"
                        touch={false}
                        content={types.slice(2).map((type, index) => (
                            <div className="text-gray-400" key={index}>
                                {
                                    type === DATASOURCE_TYPES.TEXT
                                    ? t("common.text")
                                    : type === DATASOURCE_TYPES.FILE
                                    ? t("common.file")
                                    : type === DATASOURCE_TYPES.WORKFLOW
                                    ? t("common.flow")
                                    : type === DATASOURCE_TYPES.WEBPAGE
                                    ? t("common.webpage")
                                    : type
                                }
                            </div>
                        ))}>
                        <div className="flex h-fit items-center rounded-lg bg-primary-200 bg-opacity-[.16]">
                            <span className="px-2 py-0.75 text-sm font-bold text-primary-200">+{types.length - 2}</span>
                        </div>
                    </Tippy>
                </>
            ) : (
                types.map((type, index) => {
                    return (
                        <div key={`type-${type}-${index}`} className="flex h-fit items-center rounded-lg bg-primary-200 bg-opacity-[.16]">
                            <span className="px-2 py-0.75 text-sm font-bold text-primary-200">
                                {
                                    type === DATASOURCE_TYPES.TEXT
                                    ? t("common.text")
                                    : type === DATASOURCE_TYPES.FILE
                                    ? t("common.file")
                                    : type === DATASOURCE_TYPES.WORKFLOW
                                    ? t("common.flow")
                                    : type === DATASOURCE_TYPES.WEBPAGE
                                    ? t("common.webpage")
                                    : type
                                }
                            </span>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default BadgeTypes;
