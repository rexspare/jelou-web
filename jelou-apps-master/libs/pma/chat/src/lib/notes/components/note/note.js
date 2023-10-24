import Tippy from "@tippyjs/react";
import { useSelector } from "react-redux";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
// import { CircularProgressbar } from "react-circular-progressbar";

import isNil from "lodash/isNil";

import { DateContext } from "@apps/context";
// import { PencilIcon } from "@apps/shared/icons";
import MoreOptions from "../more-options/more-options";

export function Note(props) {
    const {
        note,
        index,
        editExistingNote,
        // editNote,
        // countName,
        // closeNote,
        // storedNote,
        // updateNote,
        // originalNote,
        // updatingNote,
        // handleNewNote,
        // percentageName,
        // MAXIMUM_CHARACTERS_NAME,
        // MAXIMUM_CHARACTERS_TITLE,
    } = props;
    const dayjs = useContext(DateContext);
    const userSession = useSelector((state) => state.userSession);

    const [visible, setVisible] = useState(false);

    const { title, content, createdAt, createdBy, updatedAt } = note;
    const { t } = useTranslation();

    const show = () => {
        if (createdBy?.providerId !== userSession?.providerId) {
            setVisible(true);
        }
    };
    const hide = () => setVisible(false);

    return (
        <Tippy
            theme={"tomato"}
            content={<span className="text-gray-400">{t("pma.Para poder ejercer acción en esta nota comunícate con el operador que la creó.")}</span>}
            visible={visible}
            onClickOutside={hide}
            touch={false}
        >
            <div onMouseEnter={() => show()} onMouseLeave={() => hide()} className={`flex w-full flex-col overflow-hidden rounded-12 border-default border-[#DCDEE4] ${index === 0 && "mt-4"}`}>
                <div className="flex w-full items-center justify-between bg-[#EFF1F4] py-2 px-2">
                    <h1 className="text-xs font-semibold text-gray-400">{`${createdBy?.names} · ${dayjs(createdAt).format("MMM DD, YYYY - HH:mm")} ${
                        !isNil(updatedAt) ? `· ${t("common.Editado")}` : ""
                    }`}</h1>
                    {createdBy?.providerId === userSession?.providerId && <MoreOptions note={note} editExistingNote={editExistingNote} />}
                </div>
                <div className="px-2 py-2">
                    <h1 className="text-sm font-bold text-gray-400">{title}</h1>
                    <p className="text-sm text-gray-400">{content}</p>
                </div>
            </div>
        </Tippy>
    );
    // editNote && originalNote?._id === note?._id ? (
    //     <div className={`flex w-full flex-col overflow-hidden rounded-12 border-default border-primary-200 ${index === 0 && "mt-4"}`}>
    //         <div className="flex w-full items-center justify-between bg-primary-350 py-2 px-2">
    //             <h1 className="text-xs font-semibold text-primary-200">{`${createdBy?.names} · ${dayjs(createdAt).format("MMM DD, YYYY - HH:mm")} ${
    //                 !isNil(updatedAt) ? `· ${t("common.Editado")}` : ""
    //             }`}</h1>
    //         </div>
    //         <div className="px-2 py-2">
    //             <textarea
    //                 name="title"
    //                 onChange={handleNewNote}
    //                 maxLength={55}
    //                 rows={2}
    //                 className="h-[2.2rem] w-full resize-none border-transparent bg-transparent p-0 align-middle text-sm font-bold text-gray-400 placeholder:text-gray-400 placeholder:text-opacity-75 focus:border-transparent focus:ring-transparent">
    //                 {storedNote.title}
    //             </textarea>
    //             <textarea
    //                 name="content"
    //                 className={`mb-2 flex w-full resize-y justify-between rounded-9 border-default p-0 text-sm text-[#374361] placeholder:text-[#B0B6C2] focus:!border-transparent focus:ring-transparent ${
    //                     countName !== 0 && countName === MAXIMUM_CHARACTERS_NAME
    //                         ? "!border-red-950 bg-red-1010 bg-opacity-10"
    //                         : "border-transparent bg-transparent focus:border-[#DCDEE4]"
    //                 }`}
    //                 onChange={handleNewNote}
    //                 type="text"
    //                 maxLength={MAXIMUM_CHARACTERS_NAME}
    //                 value={storedNote.content}
    //                 cols="36"
    //                 rows="4"
    //             />
    //             <div className="flex items-end justify-end">
    //                 <span className="pr-1 text-xs text-[#959DAF]">{countName + `/${MAXIMUM_CHARACTERS_NAME}`}</span>
    //                 <div className="" style={{ width: 18, height: 18 }}>
    //                     <CircularProgressbar value={percentageName} />
    //                 </div>
    //             </div>
    //         </div>

    //         <div className="mb-2 flex justify-center space-x-2">
    //             <button
    //                 onClick={() => closeNote()}
    //                 className="h-8 rounded-full border-transparent bg-[#EFF1F4] px-6 text-sm font-medium text-gray-400 focus:outline-none">
    //                 {t("pma.Cancelar")}
    //             </button>
    //             <button
    //                 onClick={() => updateNote()}
    //                 className="flex h-8 items-center rounded-full border-transparent bg-primary-200 px-6 text-sm font-medium text-white hover:bg-primary-100 focus:outline-none">
    //                 {updatingNote && (
    //                     <svg className="mr-2 h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
    //                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    //                         <path
    //                             fill="currentColor"
    //                             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    //                     </svg>
    //                 )}
    //                 {t("pma.Guardar")}
    //             </button>
    //         </div>
    //     </div>
    // ) :
}
export default Note;
