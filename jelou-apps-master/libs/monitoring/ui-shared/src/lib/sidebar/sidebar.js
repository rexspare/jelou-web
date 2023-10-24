import Room from "../room/room";
import isEmpty from "lodash/isEmpty";
import { useSelector } from "react-redux";
import { withTranslation } from "react-i18next";
import { SidebarSkeleton } from "@apps/shared/common";
import { ArrowIcon, DeleteConversationIcon } from "@apps/shared/icons";

const DELTE_CONVERSATION_PERMISSION = "monitoring:delete_conversation";

const Sidebar = ({
    t,
    maxPage,
    setMess,
    pageLimit,
    setPageLimit,
    conversations,
    setLoadingChangeChat,
    isLoadingConversations,
    isDeletedConversations,
    setIsDeletedConversations,
    setIsLoadingConversations,
}) => {
    const permissions = useSelector((state) => state.permissions);
    const permissionsDeleteConversation = permissions.find((permission) => permission === DELTE_CONVERSATION_PERMISSION);

    let loadingSkeleton = [];

    for (let i = 0; i < 8; i++) {
        loadingSkeleton.push(<SidebarSkeleton key={i} />);
    }

    const handleDeleteConversations = () => {
        setIsLoadingConversations(true);
        setPageLimit(1);
        setIsDeletedConversations((preState) => !preState);
    };

    return (
        <div className="xxl:w-96 relative mr-0 flex w-full flex-col border-l-1 border-r-1 border-gray-100 border-opacity-25 bg-white lg:w-72 lg:rounded-bl-xl">
            {isDeletedConversations === false && (
                <div className="flex h-12 w-full items-center border-b-1 border-gray-100 border-opacity-25 px-6 sm:px-4">
                    <div className="flex items-center font-semibold text-primary-200">
                        <div className="mr-2 text-13 sm:text-base">{t("clients.conversations")}</div>
                    </div>
                </div>
            )}
            {permissionsDeleteConversation && (
                <div
                    onClick={handleDeleteConversations}
                    className="flex h-20 w-full cursor-pointer items-center border-b-1 border-gray-100 border-opacity-25 px-6 sm:px-4">
                    <div className="flex items-center gap-4 text-red-950">
                        {isDeletedConversations && <ArrowIcon width="1rem" height="1.0625rem" className="fill-current" />}
                        <div className="flex items-center gap-2">
                            <DeleteConversationIcon width={18} />
                            <h3 className="text-base font-semibold">{t("clients.deletedChats")}</h3>
                        </div>
                    </div>
                </div>
            )}
            <div className="relative mb-12 h-full overflow-y-auto">
                {isLoadingConversations
                    ? loadingSkeleton
                    : !isEmpty(conversations)
                    ? conversations.map((conversation) => {
                          const { deleted, _id } = conversation;
                          return (
                              <Room room={conversation} key={_id} setMess={setMess} setLoadingChangeChat={setLoadingChangeChat} isDeleted={deleted} />
                          );
                      })
                    : null}
            </div>
            <div className="sm:mb-15 fixed bottom-0 mb-12 flex h-12 w-full items-center justify-between bg-primary-600 px-4 lg:absolute lg:mb-0 lg:rounded-bl-xl">
                <button
                    className="inline-flex items-center p-2 text-sm font-normal text-primary-200 hover:text-primary-100 focus:outline-none"
                    disabled={pageLimit === 1}
                    onClick={() => setPageLimit(pageLimit - 1)}>
                    {t("Anterior")}
                </button>
                <button
                    className="inline-flex items-center p-2 text-sm font-normal text-primary-200 hover:text-primary-100 focus:outline-none"
                    disabled={pageLimit === maxPage}
                    onClick={() => setPageLimit(pageLimit + 1)}>
                    <span className="text-right">{t("Siguiente")}</span>
                </button>
            </div>
        </div>
    );
};
export default withTranslation()(Sidebar);
