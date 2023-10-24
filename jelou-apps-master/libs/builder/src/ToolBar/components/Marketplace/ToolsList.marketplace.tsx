import Tippy from "@tippyjs/react";
import get from "lodash/get";
import { useSelector } from "react-redux";

import { MarcketplaceTools } from "@builder/modules/Marketplace/domin/marketplace.domain";
import { getThumbnailsIcon } from "@builder/shared/utils";

type CompanySelector = {
    company: {
        properties: {
            builder?: {
                app_id: string;
                app_token: string;
            };
        };
    };
};

type MarketplaceToolListPorps = {
    marketPlaceTools: MarcketplaceTools[];
    onImportTool: (version: string, toolName: string) => void;
};

export function MarketplaceToolsList({ marketPlaceTools, onImportTool }: MarketplaceToolListPorps) {
    const company = useSelector<CompanySelector, CompanySelector["company"]>((state) => state.company);
    const appIdCredentials = get(company, "properties.builder.app_id", "");

    return (
        <ul className="grid h-[45rem] auto-rows-min grid-cols-2 gap-y-6 gap-x-10 overflow-y-scroll pt-8 pr-[0.7rem]">
            {marketPlaceTools.map((item) => {
                const { author, snapshot, _id } = item;
                const { email } = author;
                const { name, ownerId, configuration } = snapshot.Tool;

                const isOwnerTool = appIdCredentials === ownerId;
                const { thumbnail } = configuration;
                const Icon = getThumbnailsIcon(thumbnail);

                return (
                    <li key={_id} className="grid h-20 grid-cols-[2rem_14.5rem_6rem] items-center gap-3 border-b-1 border-gray-34 pb-8">
                        <Icon width={32} height={32} />
                        <div>
                            <p className="text-13 font-semibold text-gray-610 line-clamp-2">{name}</p>
                            <p className="truncate text-13 font-medium text-gray-400">{email}</p>
                        </div>

                        <button onClick={() => onImportTool(_id, name)} disabled={isOwnerTool} className="disabled:cursor-not-allowed disabled:opacity-50">
                            <Tippy disabled={!isOwnerTool} theme="jelou" placement="top" animation="shift-away" content="Eres dueño de este tool">
                                <span
                                    className={`rounded-full border-1 border-primary-200 py-[0.3125rem] px-4 text-13 font-bold text-primary-200 transition-all duration-300 ease-out ${
                                        !isOwnerTool ? "hover:bg-primary-200 hover:text-white" : ""
                                    }`}
                                >
                                    OBTENER
                                </span>
                            </Tippy>
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}
