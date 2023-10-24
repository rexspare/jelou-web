 import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";

import first from "lodash/first";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import orderBy from "lodash/orderBy";
import toUpper from "lodash/toUpper";

import { deleteConversation } from "@apps/redux/store";
import { Modal, ReactSelect } from "@apps/shared/common";
import { useOnClickOutside } from "@apps/shared/hooks";
import { CloseIcon, JelouLogoIcon, WarningIcon } from "@apps/shared/icons";
import { JelouApiV1 } from "@apps/shared/modules";
import { filterByKey } from "@apps/shared/utils";

export function TransferModal(props) {
  const {
    setForward,
    conversation,
    textObj = {},
    view,
    teamOptions,
    setActualCases,
    setRecoverCases,
    setQueueCases,
    // , recoverCases, setRecoverCases
  } = props;
  const company = useSelector((state) => state.company);
  const userSession = useSelector((state) => state.userSession);
  const bots = useSelector((state) => state.botsMonitoring);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [operators, setOperators] = useState([]);
  const [valueToTransfer, setValueToTransfer] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.userSession?.lang) ?? "es";

  const { t } = useTranslation();

  const botSelected = filterByKey(bots, "id", get(conversation, "bot.id")) ? first(filterByKey(bots, "id", get(conversation, "bot.id"))) : [];

  const byTeam = get(botSelected, "properties.operatorView.byTeam")
    ? get(botSelected, "properties.operatorView.byTeam")
    : get(botSelected, "properties.operatorView.byTeam", false);

  const byScopes = get(botSelected, "properties.operatorView.hasTeamAssignationScope")
    ? get(botSelected, "properties.operatorView.hasTeamAssignationScope")
    : get(botSelected, "properties.operatorView.hasTeamAssignationScope", false);

  const noOptionsMessage = () => {
    if (byTeam || byScopes) {
      return t("No se encontró equipo");
    } else {
      return t("No se encontró operador");
    }
  };

  // const placeholder = byTeam || byScopes ? t("Seleccionar team") : t("Seleccionar operador");
  const placeholder = t("Seleccionar operador"); // for monitoring view we only show operators

  const wrapperRef = useRef(null);

  const getOperatorsOnline = () => {
    setLoadingMessage(true);

    JelouApiV1.get(`/company/${company.id}/operators`, {
      params: {
        active: 1,
        status: "online",
        ...(!isEmpty(teamOptions) ? { teams: [teamOptions.map((team) => team.id)] } : {}),
      },
    })
      .then((res) => {
        if (res.data === "Servicio no disponible") {
          return;
        }

        const data = parseOperators(res.data);
        setOperators(data);
        setLoadingMessage(false);
      })
      .catch((err) => {
        console.log("==ERROR", err);
        setLoadingMessage(false);
      });
  };

  const parseOperators = (operatorsArray) => {
    const operatorSelected = get(conversation, "operator.providerId", "");
    let operators = [];
    let operatorTeam = "";
    operatorsArray.forEach((operator) => {
      if (!isEmpty(operator.team)) {
        operatorTeam = ` - ${operator.team}`;
      }
      if (operator.providerId !== operatorSelected) {
        operators.push({
          id: `${operator.providerId}`,
          name: `${operator.names}${operatorTeam}`,
          companyId: operator.companyId,
          operatorId: operator.id,
        });
      }
    });

    return operators;
  };

  const handleClickInside = (event) => {
    if (!(wrapperRef.current && !wrapperRef.current.contains(event.target))) {
      getOperatorsOnline();
    }
  };

  useEffect(() => {
    // Bind the event listener
    document.addEventListener("mousedown", handleClickInside);
    document.addEventListener("touchstart", handleClickInside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickInside);
      document.removeEventListener("touchstart", handleClickInside);
    };
  }, []);

  const getOptions = () => {
    return orderBy(operators, ["name"], ["asc"]); //for monitoring view we only show operators

    ///---///
    // if (byTeam || byScopes) {
    //     return teamOptions;
    // } else {
    //     return operators;
    // }
    ///---///
  };

  const onClose = () => {
    setForward(false);
    setValueToTransfer(null);
  };

  const ref = useRef();
  useOnClickOutside(ref, onClose);

  const handler = (e) => {
    if (e.keyCode === 27) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("keyup", handler);
    return () => {
      document.removeEventListener("keyup", handler);
    };
  }, []);

  const handleChange = (opt) => {
    setValueToTransfer(opt);
  };

  const submitChange = () => {
    setLoading(true);
    let botId = get(conversation, "bot.id", {});

    const userId = get(conversation, "user.id", {});
    const teamId = get(valueToTransfer, "id", {});
    const _id = get(conversation, "_id", "");
    if (!botId && !userId) {
      return;
    }
    const id = get(valueToTransfer, "id", "");

    const operatorId = get(valueToTransfer, "operatorId", "");
    let adminId = get(userSession, "id", "");
    const botType = get(conversation, "bot.type", {});

    switch (view) {
      case "ACTUAL_CASES":
        JelouApiV1.post(`/conversations/${botId}/transfer`, {
          userId,
          operatorId: id,
          // ...(byScopes || byTeam ? { teamId } : { operatorId: id }),
        })
          .then((res) => {
            const { data } = res;
            const type = get(data, "data.type", "");
            if (type === "OPERATOR_NOT_FOUND") {
              setError(true);
              setErrorMessage(t("monitoring.Operador no encontrado"));
              // toast.error(`No se pudo encontrar operadores en línea`, {
              //     autoClose: true,
              //     position: toast.POSITION.BOTTOM_RIGHT,
              // });
            } else {
              setActualCases((prevState) => {
                return prevState.filter((state) => state._id !== _id);
              });
            }
            setLoading(false);
            setSuccess(true);
            onClose();
            setSuccessMessage(t("monitoring.Se ha transferido la conversación correctamente"));
            // dispatch(deleteConversation(_id));
          })
          .catch((err) => {
            console.error("ERROR", err);
            setValueToTransfer(null);
            setLoading(false);
          });
        break;
      case "RECOVER_CASES":
        setLoading(true);
        // const conversationNotAttendedClientId = get(tempCase, "id", "");

        JelouApiV1.post(`/company/${company.id}/conversationsNotAttended/manual_assignation_not_attended`, {
          conversationNotAttendedId: _id,
          adminId: adminId.toString(),
          operatorId,

          // ...(byTeam ? { teamId } : { operatorId }),
        })
          .then((res) => {
            const { data } = res;
            const statusMessage = get(data, "statusMessage", "");
            if (toUpper(statusMessage) === "FAILED") {
              setError(true);
              const errorStatus = get(data, "error.status", "");
              if (toUpper(errorStatus) === "NOT_ASSIGNED") {
                const errorMessageFallback = get(data, "assignationDetails.failedReason", "");
                const errorMessage = get(data, "clientMessages.es", errorMessageFallback);
                setErrorMessage(errorMessage);
              } else {
                const message = first(data.message);
                setErrorMessage(message);
              }
              setTimeout(function () {
                onClose();
              }, 4500);
            } else {
              setSuccess(true);
              setSuccessMessage("monitoring.Conversación asignada correctamente");
              // const roomId = _id;
              // setRecoverCases(deleteById(recoverCases, roomId, "_id"));
              setRecoverCases((prevState) => {
                return prevState.filter((state) => state._id !== _id);
              });
              setTimeout(function () {
                onClose();
              }, 2000);
            }
            setValueToTransfer(null);
            setLoading(false);
          })
          .catch((err) => {
            console.error("ERROR", err);
            setValueToTransfer(null);
            setLoading(false);
          });
        break;

      case "QUEUE_CASES":
        switch (toUpper(botType)) {
          case "TWITTER_REPLIES":
          case "FACEBOOK_FEED":
            return JelouApiV1.get(`/company/${company.id}/tickets/take`, {
              params: {
                ticketId: _id,
                type: "reply",
                ...(!isEmpty(operators) ? { operatorId } : {}),
                ...(!isEmpty(teamId) ? { teamId: get(conversation, "assignationMethod.teamId", "") } : {}),
              },
            })
              .then((res) => {
                const { data } = res;
                const type = get(data, "data.type", "");
                if (type === "OPERATOR_NOT_FOUND") {
                  console.log("OH NO!");
                } else {
                  setQueueCases((prevState) => {
                    return prevState.filter((state) => state._id !== _id);
                  });
                }
                setLoading(false);
                setSuccess(true);
                onClose();
                dispatch(deleteConversation(_id));
                setSuccessMessage("monitoring.Conversación asignada correctamente");
              })
              .catch((err) => {
                console.error("ERROR", err);
                setValueToTransfer(null);
                setLoading(false);
                const { response } = err;
                const msg = get(response, "data.error.clientMessages", {});
                setError(true);
                setErrorMessage(get(msg, lang, "No se pudo asignar el caso, intente nuevamente"));

                setLoading(false);
              });
          default:
            return JelouApiV1.get(`/company/${company.id}/tickets/take`, {
              params: {
                ticketId: _id,
                ...(!isEmpty(operators) ? { operatorId } : {}),
                ...(!isEmpty(teamId) ? { teamId: get(conversation, "assignationMethod.teamId", "") } : {}),
              },
            })
              .then((res) => {
                const { data } = res;
                const type = get(data, "data.type", "");
                if (type === "OPERATOR_NOT_FOUND") {
                  console.log("OH NO!");
                } else {
                  setQueueCases((prevState) => {
                    return prevState.filter((state) => state._id !== _id);
                  });
                }
                setLoading(false);
                setSuccess(true);
                onClose();
                dispatch(deleteConversation(_id));
                setSuccessMessage("monitoring.Conversación asignada correctamente");
              })
              .catch((err) => {
                console.error("ERROR", err);
                setValueToTransfer(null);
                setLoading(false);
                const { response } = err;
                const msg = get(response, "data.error.clientMessages", {});
                setError(true);
                setErrorMessage(get(msg, lang, "No se pudo asignar el caso, intente nuevamente"));
              });
        }
      default:
        break;
    }
  };

  const disabled = valueToTransfer === null ? true : false;

  return (
    <Modal>
      <div className="fixed inset-x-0 top-0 z-120 overflow-auto sm:inset-0 sm:flex sm:items-center sm:justify-center">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 z-20 bg-gray-490/75" />
        </div>
        <div className="min-w-3 transform rounded-3xl bg-white px-6 pb-4 pt-5 shadow-modal transition-all" ref={ref}>
          <div className="mb-3 flex items-center justify-between pb-4">
            <div className="flex items-center">
              <div className="bg-primary mr-2 flex items-center justify-center rounded-full md:mr-4">
                <JelouLogoIcon width="1.875rem" height="2.5rem" />
              </div>
              <div className="max-w-md text-xl font-bold text-gray-400">{textObj.title ? textObj.title : t("monitoring.Transferir")}</div>
            </div>
            <span onClick={onClose}>
              <CloseIcon className="cursor-pointer fill-current text-gray-400 hover:text-gray-400" width="1rem" height="1rem" />
            </span>
          </div>
          {success && (
            <div className="mb-4 flex h-14 items-center rounded-default bg-whatsapp-200 px-4 font-bold text-whatsapp-350">
              <svg width="25" height="25" className="mr-4" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18.0256 8.53367C18.4071 8.91514 18.4071 9.5335 18.0256 9.91478L11.4742 16.4663C11.0928 16.8476 10.4746 16.8476 10.0931 16.4663L6.97441 13.3474C6.59294 12.9662 6.59294 12.3478 6.97441 11.9665C7.35569 11.585 7.97405 11.585 8.35533 11.9665L10.7836 14.3948L16.6445 8.53367C17.0259 8.15239 17.6443 8.15239 18.0256 8.53367ZM25 12.5C25 19.4094 19.4084 25 12.5 25C5.59063 25 0 19.4084 0 12.5C0 5.59063 5.59158 0 12.5 0C19.4094 0 25 5.59158 25 12.5ZM23.0469 12.5C23.0469 6.67019 18.329 1.95312 12.5 1.95312C6.67019 1.95312 1.95312 6.67095 1.95312 12.5C1.95312 18.3298 6.67095 23.0469 12.5 23.0469C18.3298 23.0469 23.0469 18.329 23.0469 12.5Z"
                  fill="#0CA010"
                />
              </svg>
              {!isEmpty(textObj) ? textObj.success : t(successMessage)}
            </div>
          )}

          {error && (
            <div className="mb-4 flex items-center rounded-default bg-red-300 px-4 py-2 font-bold text-red-675">
              <WarningIcon width="1.563rem" height="1.563rem" className="mr-4 fill-current text-red-675" />
              {t(errorMessage)}
            </div>
          )}

          <div className="flex justify-center">
            <div className="mx-auto w-full max-w-sm pb-5">
              <div className="mt-2">
                <div className="border-b-default border-gray-100/25" ref={wrapperRef}>
                  <ReactSelect
                    className="w-full"
                    value={valueToTransfer}
                    onChange={handleChange}
                    name="operator"
                    options={orderBy(getOptions(), ["name"], ["asc"])}
                    placeholder={t(placeholder)}
                    loading={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                  />
                </div>
                <div className="flex w-full justify-center pt-5">
                  <button type="submit" className="button-primary w-32" disabled={disabled || loading} onClick={submitChange}>
                    {loading ? <BeatLoader color={"white"} size={"0.625rem"} /> : !isEmpty(textObj) ? textObj.button : t("Transferir")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default TransferModal;
