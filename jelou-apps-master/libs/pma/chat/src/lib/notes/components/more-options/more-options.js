import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { KebabIcon } from "@apps/shared/icons";
import { useTranslation } from "react-i18next";

export function MoreOptions(props) {
    const { note, editExistingNote } = props;
    const { t } = useTranslation();

    return (
        <div className="mr-1 flex">
            <Menu as="div" className="relative">
                <Menu.Button className="flex items-center">
                    <KebabIcon width="20" height="20" stroke={"#727C94"} />
                </Menu.Button>

                <Transition.Child
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="ring-1 ring-opacity-5 text-semibold divide-y absolute right-0 mt-2 w-40 origin-top-right divide-gray-400/75 rounded-3 bg-white shadow-global ring-black focus:outline-none">
                        <div className="flex h-11 items-center">
                            <Menu.Item>
                                <button
                                    onClick={() => {
                                        editExistingNote(note);
                                    }}
                                    className={`group flex h-full w-full items-center pl-4 text-sm text-[#374361] hover:rounded-3 hover:bg-gray-400 hover:bg-opacity-15 focus:outline-none`}
                                >
                                    {t("pma.Editar")}
                                </button>
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition.Child>
            </Menu>
        </div>
    );
}
export default MoreOptions;
