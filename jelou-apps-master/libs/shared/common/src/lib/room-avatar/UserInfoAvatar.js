import { ArrowIcon } from "@apps/shared/icons";
import RoomAvatar from "./room-avatar";

export const UserInfoAvatar = ({ avatarUrlDefault = "", channel = "", metadata = {}, nameOfProfile = "" } = {}) => {
    return (
        <div className="flex items-center pl-8 ">
            <ArrowIcon className="flex mr-2 fill-current mid:hidden" width="1.25rem" height="0.938rem" />
            <div className="flex">
                <RoomAvatar src={metadata["profilePicture"] || avatarUrlDefault} name={nameOfProfile} type={channel} showIcon={true} />
            </div>
            <div className="flex flex-col">
                <span
                    className={`leading-normal ${
                        nameOfProfile && nameOfProfile.length > 35 && "w-64 truncate xxl:w-72"
                    } text-13 font-bold text-gray-400 sm:text-sm 2xl:text-15`}>
                    {nameOfProfile}
                </span>
            </div>
        </div>
    );
};
