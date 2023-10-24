import { useState } from "react";
import Avatar from "react-avatar";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import dayjs from "dayjs";
import "dayjs/locale/es";
import emojiStrip from "emoji-strip";

import { SocialIcon } from "@apps/shared/common";

function PorHashTag(props) {
    const { srcVacio, byHashtagChoose, data, bot, t, inputCheckboxClassName } = props;
    const [checked, setChecked] = useState(true);
    return (
        <div className="absolute top-[11%] w-[53%]">
            <table className="w-full">
                <thead className="flex w-full items-center justify-start border-b-2 border-gray-34 text-gray-700">
                    <tr className="flex items-center text-center">
                        <th scope="col" className=" px-3 py-4">
                            <div className="flex w-[20vw] items-center  justify-between ">
                                <h4 className="font-bold text-gray-400">
                                    {t("MassAchivePost.titleHash") + " "}
                                    <span className="text-primary-200">{byHashtagChoose}</span>
                                </h4>
                                {/* <button>
                                            <MenuDoot />
                                        </button> */}
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody className="flex h-[31rem] w-full flex-col justify-start overflow-y-scroll">
                    {data.map(({ from, bubble, sender, senderId }) => {
                        let name = get(from, "names", "");
                        let src = get(from, "profilePicture", "");
                        let hour = get(sender, "createdAt", "");
                        let imgPost = get(bubble, "mediaUrl", "");
                        const bubbleText = get(bubble, "text", "");
                        return (
                            <tr className="border-b-2 border-gray-34 bg-white" key={sender.referenceId}>
                                <td className="px-3 py-4">
                                    <input
                                        checked={checked}
                                        onChange={() => setChecked(true)}
                                        id="mergeBubbles"
                                        name="mergeBubbles"
                                        type="checkbox"
                                        className={inputCheckboxClassName + " bg-gray-400 disabled:cursor-not-allowed disabled:opacity-25"}
                                        disabled
                                    />
                                </td>
                                <td className="px-3 py-4">
                                    <div className="flex items-center">
                                        <span className="relative inline-block">
                                            <div className="relative">
                                                <Avatar
                                                    src={isEmpty(src) ? srcVacio : src}
                                                    name={emojiStrip(isEmpty(name) ? "Desconocido" : name)}
                                                    className={`mr-3 `}
                                                    fgColor={"#767993"}
                                                    size="2.438rem"
                                                    round={true}
                                                    color={"#D7EAFF"}
                                                    textSizeRatio={2}
                                                />
                                                <div className="absolute bottom-0 right-0 mr-1 -mb-1 overflow-hidden rounded-full border-2 border-transparent">
                                                    <SocialIcon type={get(bot, "type", "")} />
                                                </div>
                                            </div>
                                        </span>
                                        <div className="flex w-[19rem] flex-col">
                                            <div className="flex">
                                                <h3 className="break-words font-bold">{from.names}</h3>
                                            </div>
                                            <div className="flex w-full justify-start">
                                                <div className="">
                                                    {!isEmpty(imgPost) ? <img className="rounded-[5px]" src={imgPost} style={{ width: "40px", height: "40px" }} alt="ImgPost" /> : ""}
                                                </div>
                                                <div className="h-auto w-[16rem] break-words pl-2 text-left">
                                                    <p>{bubbleText}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <button className="messajes">
                                            <IconChat />
                                        </button> */}
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-gray-400">{hour ? dayjs(hour).format("DD-MM-YY HH:mm") : " "}</span>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default PorHashTag;
