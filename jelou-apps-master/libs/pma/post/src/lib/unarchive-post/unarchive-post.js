import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

import { LeaveIcon } from "@apps/shared/icons";
import { FormModal } from "@apps/pma/ui-shared";
import { JelouApiV1 } from "@apps/shared/modules";
import { checkIfOperatorIsOnline } from "@apps/shared/utils";
import { addArchivedPost, setCurrentPost, setShowDisconnectedModal } from "@apps/redux/store";

const UnarchivePost = (props) => {
    const { closeLeaveModal, post } = props;
    const { t } = useTranslation();
    const [recovering, setRecovering] = useState(false);
    const dispatch = useDispatch();
    const currentPost = useSelector((state) => state.currentPost);
    const { operatorId = "" } = useSelector((state) => state.userSession);
    const statusOperator = useSelector((state) => state.statusOperator);
    const companyId = get(post, "company.id", "");
    const messageId = get(post, "messageId");

    const navigate = useNavigate();

    let names = get(post, "from.names", t("pma.este usuario"));
    if (isEmpty(names)) {
        names = get(post, "from.names", t("pma.este usuario")).split("-")[0];
    }

    function recoverPost() {
        if (checkIfOperatorIsOnline(statusOperator)) {
            dispatch(setShowDisconnectedModal(true));
            return;
        }
        setRecovering(true);

        let paramsObj = {
            operatorId: operatorId,
            origin: "induced_by_operator",
        };

        JelouApiV1.post(`/companies/${companyId}/reply/${messageId}/start`, paramsObj)
            .then(async (resp) => {
                const { data } = resp;
                let status = get(data, "status", 1);
                if (status !== 0) {
                    closeLeaveModal(true);
                    setRecovering(false);
                    sessionStorage.setItem("unarchiveRoom", currentPost._id);
                    dispatch(setCurrentPost());
                    dispatch(addArchivedPost(currentPost));
                    navigate("/pma/posts");
                } else {
                    console.error(get(data, "error.clientMessages.es", data.message));
                }
                setRecovering(false);
            })
            .catch((error) => {
                setRecovering(false);
                console.log("error ", error);
            });
    }

    return (
        <FormModal canOverflow={true} themeColor="primary-200" onClose={closeLeaveModal}>
            <div className="flex w-full flex-col pb-4">
                <div className="justify-left flex flex-col md:flex-row">
                    <div className="mr-0 hidden w-1/2 flex-col justify-center md:mr-10 md:flex">
                        <LeaveIcon className="mx-auto" width="18.875rem" height="19.875rem" fill="none" />
                    </div>
                    <div className="flex flex-col justify-center space-y-3 text-left md:w-1/2 md:pr-8">
                        <span className="md:max-w-132 pr-3 text-2xl font-bold leading-8 text-primary-200">{`${t(`pma.Estás a punto de recuperar una publicación de`)} ${names}`}</span>
                        <div className="text-base font-bold text-gray-450">{t("pma.¿Te gustaría continuar?")}</div>
                    </div>
                </div>
                <div className="bg-modal-footer mt-0 flex w-full items-center justify-center rounded-b-lg pr-10 pt-2 font-bold md:justify-end xxl:pt-8">
                    <button className="mr-4 flex w-32 justify-center rounded-3xl border-transparent bg-gray-10 px-5 py-3 font-bold text-gray-400 focus:outline-none" onClick={closeLeaveModal}>
                        {t("pma.No")}
                    </button>
                    {recovering ? (
                        <button className="flex w-32 justify-center rounded-3xl border-transparent bg-primary-200 px-5 py-3 font-bold text-white focus:outline-none">
                            <BeatLoader size={"0.625rem"} color="#ffff" />
                        </button>
                    ) : (
                        <button
                            className="hover:bg-primary-hover flex w-32 justify-center rounded-3xl border-transparent bg-primary-200 px-5 py-3 font-bold text-white focus:outline-none"
                            onClick={recoverPost}
                        >
                            {t("pma.Si")}
                        </button>
                    )}
                </div>
            </div>
        </FormModal>
    );
};
export default UnarchivePost;
