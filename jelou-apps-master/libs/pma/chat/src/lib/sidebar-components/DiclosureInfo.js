import { ClipLoader } from "react-spinners";
import { Disclosure } from "@headlessui/react";

import { DownIcon, MessageIcon, RightIcon, TeamIcon } from "@apps/shared/icons";

export default function DiclosureInfo({ loading, children, titleButton = "", isProfil = false } = {}) {
    return (
        <Disclosure defaultOpen as="aside" className="text-gray-400">
            {({ open }) => (
                <>
                    <Disclosure.Button className="flex w-full items-center justify-between border-b-1.5 border-t-1.5 border-gray-100 border-opacity-25 px-6 py-2 focus:outline-none focus:ring-transparent">
                        <div className="flex flex-row items-center">
                            {isProfil ? (
                                <TeamIcon width="1.0625rem" height="0.75rem" className="mr-1 fill-current" />
                            ) : (
                                <MessageIcon
                                    fill="text-gray-400"
                                    width="1.0625rem"
                                    height="0.875rem"
                                    fillOpacity="0.60"
                                    className="mr-1 fill-current"
                                />
                            )}
                            <div className="text-xs font-semibold text-gray-400 xxl:text-sm">{titleButton}</div>
                        </div>
                        <div className="flex justify-end">
                            {open ? (
                                <DownIcon className="select-none fill-current text-gray-400 outline-none" width="1.25rem" height="1.25rem" />
                            ) : (
                                <RightIcon className="select-none fill-current text-gray-400 outline-none" width="1.25rem" height="1.25rem" />
                            )}
                        </div>
                    </Disclosure.Button>
                    <Disclosure.Panel className="pt-4 pb-2 pl-8 text-xs text-gray-500">
                        <div className="bg-white outline-none">
                            {loading ? (
                                <div className="flex w-full justify-center">
                                    <ClipLoader size={"2rem"} color="#00B3C7" />
                                </div>
                            ) : (
                                children
                            )}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
}
