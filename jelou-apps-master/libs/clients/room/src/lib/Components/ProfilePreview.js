import { Menu, Transition } from "@headlessui/react";
import Tag from "./Tag";
import isEmpty from "lodash/isEmpty";
import React, { Fragment, useState } from "react";
import { KebabIcon } from "@apps/shared/icons";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { ProfileModal } from "@apps/clients/ui-shared";

const ProfilePreview = (props) => {
    const { roomAvatar, name, detail, tags, storedParams } = props;
    const currentRoomClients = useSelector((state) => state.currentRoomClients);
    const [openProfile, setOpenProfile] = useState(false);
    const { t } = useTranslation();

    function showProfile() {
        setOpenProfile(true);
    }

    function closeProfile() {
        setOpenProfile(false);
    }

    const preventFocus = (e) => {
        e.preventDefault();
        return false;
    };

    return (
        <div className="relative mx-3 mb-10 flex">
            <Menu as="div" className="absolute top-0 right-0 mt-4 mr-2 pt-2">
                <Menu.Button className="absolute top-0 right-0 h-10 w-10 rounded-full border-gray-400 pl-4">
                    <KebabIcon width="20" height="20" stroke={"#727C94"} />
                </Menu.Button>

                <ProfileModal openProfile={openProfile} closeProfile={closeProfile} profile={currentRoomClients} params={storedParams} />

                <Transition.Child
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="ring-1 ring-opacity-5 text-semibold divide-y absolute right-0 z-40 mt-10 w-40 origin-top-right divide-gray-400/75 rounded-xl bg-white shadow-global ring-black focus:outline-none">
                        <div className="px-1 py-1 ">
                            <Menu.Item>
                                <button
                                    onClick={showProfile}
                                    onMouseDown={preventFocus}
                                    className={`group  flex w-full items-center px-2 py-2 text-sm text-gray-400 hover:rounded-xl hover:bg-gray-400 hover:bg-opacity-15 focus:outline-none`}
                                >
                                    {t("clients.viewInfo")}
                                </button>
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition.Child>
            </Menu>
            <div className="flex w-full flex-col items-center">
                <div className="relative mt-8 flex">
                    <img className="h-18 w-18 items-center rounded-full" src={roomAvatar} alt="view"></img>
                </div>
                <div className="mt-3 mb-5 flex flex-col items-center leading-normal text-gray-400">
                    <span className="text-15 font-bold">{name}</span>
                    <span className="text-xs font-medium">{detail}</span>
                </div>
                <div className="flex flex-wrap-reverse justify-center space-x-1 space-y-2 overflow-x-auto">
                    {!isEmpty(tags, []) &&
                        tags.map((tag, index) => {
                            return (
                                <div className="h-5 flex-none" key={index}>
                                    <Tag tag={tag} key={index} />
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
};
export default ProfilePreview;
