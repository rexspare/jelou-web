import Tippy from "@tippyjs/react";
import isEmpty from "lodash/isEmpty";

import { EmptyDatastoreIcon, FacebookDSIcon, FileElipseIcon, FlowIcon, InstagramDSIcon, SkillIcon, TextoIcon, WebDSIcon, WebsiteIcon, WhatsappIcon } from "@apps/shared/icons";
import { t } from "i18next";
import { CHANNEL_TYPES, DATASOURCE_TYPES } from "../../constants";

const getIcon = {
    [DATASOURCE_TYPES.TEXT]: <TextoIcon width="3.25rem" height="3.25rem" />,
    [DATASOURCE_TYPES.WEBPAGE]: <WebsiteIcon width="3.25rem" height="3.25rem" />,
    [DATASOURCE_TYPES.WEBSITE]: <WebsiteIcon width="3.25rem" height="3.25rem" />,
    [DATASOURCE_TYPES.WORKFLOW]: (
        <div className="rounded-full bg-[#F71963]/15 p-3">
            <FlowIcon width="1.5rem" height="1.5rem" />
        </div>
    ),
    [DATASOURCE_TYPES.SKILL]: <SkillIcon width="3.25rem" height="3.25rem" />,
    [DATASOURCE_TYPES.FILE]: <FileElipseIcon width="3.25rem" height="3.25rem" />,
    [CHANNEL_TYPES.WHATSAPP]: <WhatsappIcon width="3.25rem" height="3.25rem" />,
    [CHANNEL_TYPES.FACEBOOK]: <FacebookDSIcon width="3.25rem" height="3.25rem" />,
    [CHANNEL_TYPES.INSTAGRAM]: <InstagramDSIcon width="3.25rem" height="3.25rem" />,
    [CHANNEL_TYPES.WEB]: <WebDSIcon width="3.25rem" height="3.25rem" />,
    empty: <EmptyDatastoreIcon width="3.25rem" height="3.25rem" />,
};
const getText = {
    [DATASOURCE_TYPES.TEXT]: t(DATASOURCE_TYPES.TEXT),
    [DATASOURCE_TYPES.FILE]: t(DATASOURCE_TYPES.FILE),
    [DATASOURCE_TYPES.WORKFLOW]: t(DATASOURCE_TYPES.WORKFLOW),
    [DATASOURCE_TYPES.SKILL]: DATASOURCE_TYPES.SKILL,
    [DATASOURCE_TYPES.WEBPAGE]: t(DATASOURCE_TYPES.WEBPAGE),
    [DATASOURCE_TYPES.WEBSITE]: t(DATASOURCE_TYPES.WEBSITE),
    [CHANNEL_TYPES.WHATSAPP]: t(CHANNEL_TYPES.WHATSAPP),
    [CHANNEL_TYPES.FACEBOOK]: [CHANNEL_TYPES.FACEBOOK],
    [CHANNEL_TYPES.WEB]: [CHANNEL_TYPES.WEB],
    [CHANNEL_TYPES.INSTAGRAM]: [CHANNEL_TYPES.INSTAGRAM],
    empty: "-",
};

const IconCard = ({ type }) => {
    const typeToRender = isEmpty(type) ? "empty" : type;

    return (
        <div className="mb-3 flex w-full">
            <Tippy
                theme="light"
                placement="top"
                touch={false}
                content={
                    <span className="font-normal text-gray-400">
                        {t("common.type")}: {getText[typeToRender]}
                    </span>
                }
            >
                <div>{getIcon[typeToRender]}</div>
            </Tippy>
        </div>
    );
};

export default IconCard;
