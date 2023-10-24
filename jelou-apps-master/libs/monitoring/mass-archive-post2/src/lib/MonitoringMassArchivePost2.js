import dayjs from "dayjs";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { ModalHeadlessSimple, renderMessage } from "@apps/shared/common";
import { ArchivedIcon, CloseIcon1 } from "@apps/shared/icons";
import FilterMassPostM from "./filter-mass-post-m/filter-mass-post-m";
import ResultMassPostMo from "./result-mass-post-mo/result-mass-post-mo";
import { getMsgArchive, PostMsgArchive } from "./services/archiveMass";
import throttle from "lodash/throttle";

import { renderMessage as renderToastMessage } from "@apps/shared/common";
import { MESSAGE_TYPES } from "@apps/shared/constants";

const ARCHIVE_TYPE = {
    HASHTAG: "1",
    THREAD: "2",
};
// const ASSIGNMENT_TYPE = {
//     IN_QUEUE: "IN_QUEUE,",
//     ASSIGNED: "ASSIGNED",
// };

export function MonitoringMassArchivePost2(props) {
    const { showModalPosts, setShowModalPosts } = props;
    const { t } = useTranslation();
    const bots = useSelector((state) => state.bots);
    const [bot, setBot] = useState(null);
    const [chooseHashtag, setChooseHashtag] = useState(false);
    const [chooseArchiveType, setChooseArchiveType] = useState(null);
    const [chooseAsgmtType, setChooseAsgmtType] = useState(null);
    const [byHashtagChoose, setByHashtagChoose] = useState(null);
    const [botsFilter, setBotsFilter] = useState([]);
    const company = useSelector((state) => state.company);
    const valueDefaul = useRef();
    const regexHashTag = /^([#]+[a-zA-Z0-9-@$?¡!\-_]+$)/;
    const [date, setDate] = useState([]);
    const [data, setData] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [errorData, setErroData] = useState(null);
    const [loadingArchivar, setLoadingArchivar] = useState(false);
    const [errorArchivar, setErrorArchivar] = useState(false);
    //? Estados Campos obligatorios
    const [camposObligatorios, setCamposObligatorios] = useState({
        archiveType: false,
        bot: false,
        asgmtType: false,
        date: false,
    });
    //? Estados Checkbox
    const [allCheck, setAllCheck] = useState(false);
    const [selected, setSelected] = useState([]);
    //? Objeto tipo de archivado
    const ArchiveType = [
        { id: "dcfArchiveType", name: t("MassAchivePost.selectTypeArchive1"), type: "1" },
        { id: "59ArchiveType", name: t("MassAchivePost.selectTypeArchive2"), type: "2" },
    ];
    //? Objeto tipo de asignacion
    const AsgmtType = [
        { id: "12njdhInqueue", name: t("MassAchivePost.selectAsgmtTyp1"), type: "IN_QUEUE" },
        { id: "hbhyq1Asgm", name: t("MassAchivePost.selectAsgmtTyp2"), type: "ASSIGNED" },
    ];
    //?estado botId peticion
    const [botId, setBotId] = useState(null);

    let initialFiltersModal = {
        bots: [],
        operators: [],
        date: [],
        globalSearch: [],
    };

    const [selectedOptionsConversation, setSelectedOptionsConversation] = useState(initialFiltersModal);

    const userSession = useSelector((state) => state.userSession);

    //?estados paginacion
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [actualPage, setActualPage] = useState(1);

    const [resPagination, setResPagination] = useState(null);

    const nextPage = useCallback(
        throttle(() => setPage((preStatePage) => preStatePage + 1), 1000),
        []
    );
    const previousPage = useCallback(
        throttle(() => setPage((preStatePage) => preStatePage - 1), 1000),
        []
    );

    const onChangeBot = (evt) => {
        const botId = evt.id;
        setSelectedOptionsConversation({ ...selectedOptionsConversation, bots: botId });
        setBot(evt);
    };

    const onChangeArchType = (evt) => {
        setChooseArchiveType(evt);
    };
    const onChangeAsgmtType = (evt) => {
        setChooseAsgmtType(evt.type);
    };

    const onChangeInputHashtag = (evt) => {
        setByHashtagChoose(evt.target.value);
    };

    const onCloseModal = () => {
        setShowModalPosts(false);
    };

    const botsFilters = () => {
        if (isEmpty(bots)) return;

        const botsArray = bots
            .filter((bot) => bot.type === "Facebook_Feed" || bot.type === "Twitter_replies")
            .map((bot) => ({ id: bot.id, name: bot.name, type: bot.type }));
        setBotsFilter(botsArray);
    };

    useEffect(() => {
        if (isEmpty(botsFilter)) botsFilters();
    }, [botsFilter, bots]);

    useEffect(() => {
        if (!isEmpty(resPagination)) {
            setTotal(resPagination.total);
            setTotalPages(resPagination.totalPages);
        }
    }, [resPagination]);

    useEffect(() => {
        setData([]);
        setSelected([]);
        setAllCheck(false);
        setByHashtagChoose("");
    }, [chooseArchiveType]);

    useEffect(() => {
        setData([]);
        setSelected([]);
        setAllCheck(false);
        setByHashtagChoose("");
        setBotId(get(bot, "id", null));
    }, [bot]);

    useEffect(() => {
        if (chooseHashtag) {
            valueDefaul.current.defaultValue = "#";
        }
    }, [chooseHashtag]);
    //TODO Objeto de Filtros
    const conversationFilter = [
        {
            id: 0,
            name: "AsgmtType",
            placeholderButtonLabel: "Asgmt",
            options: AsgmtType,
            value: get(chooseAsgmtType, "name", ""),
            placeholder: t("MassAchivePost.placeholderAsgmtTyp"),
            type: "MultiCheckBox",
            onChange: onChangeAsgmtType,
            defaultValue: "IN_QUEUE",
        },
        {
            id: 1,
            name: "bots",
            placeholderButtonLabel: "Bots",
            options: botsFilter,
            value: bot,
            placeholder: t("MassAchivePost.placeholderBot"),
            type: "MultiCheckBox",
            onChange: onChangeBot,
            defaultValue: null,
        },
        {
            id: 2,
            name: "ArchType",
            placeholderButtonLabel: "ArchType",
            options: ArchiveType,
            value: chooseArchiveType,
            placeholder: t("MassAchivePost.placeholderArchType"),
            type: "MultiCheckBox",
            onChange: onChangeArchType,
            defaultValue: null,
        },
        {
            id: 3,
            name: "byHashtag",
            placeholderButtonLabel: "byHashtag",
            value: byHashtagChoose,
            placeholder: t("MassAchivePost.placeholderHashTag"),
            type: "Input",
            onChange: onChangeInputHashtag,
            myRef: valueDefaul,
        },

        {
            id: 4,
            name: t("clients.date"),
            date: date,
            placeholder: t("clients.date"),
            type: "Date",
        },
    ];
    //TODO Funcion resetar paginado en 1
    const handlePageActual = () => {
        setActualPage(1);
    };
    //TODO Funcion validar campo obligatorio
    function validarCampoObligatorio(campoValor, campoNombre) {
        return isEmpty(campoValor);
    }

    //TODO Funcion Consultar publicación
    const onGetPosts = async (numPage) => {
        const comany_id = get(company, "id", null);
        const startAt = isEmpty(selectedOptionsConversation.date) ? "" : dayjs(selectedOptionsConversation.date[0]).startOf("day").toJSON();
        const endAt = isEmpty(selectedOptionsConversation.date) ? "" : dayjs(selectedOptionsConversation.date[1]).endOf("day").toJSON();

        setSelected([]);
        setAllCheck(false);
        if (!comany_id) {
            renderMessage(t("MassAchivePost.errorCompany"), MESSAGE_TYPES.ERROR);
        }
        // //?Validacion campos obligatorios

        const obligatorios = {
            archiveType: validarCampoObligatorio(chooseArchiveType, "Tipo de archivo"),
            bot: validarCampoObligatorio(botId, "ID del bot"),
            asgmtType: validarCampoObligatorio(chooseAsgmtType, "Tipo de asignación"),
            date: validarCampoObligatorio(startAt, "Fecha de inicio"),
        };
        setCamposObligatorios(obligatorios);

        //? Condicion que no permite hace consultas en campos vacios
        if (isEmpty(chooseArchiveType) || isEmpty(botId) || isEmpty(chooseAsgmtType) || isEmpty(startAt)) {
            renderToastMessage(t("MassAchivePost.errorSelect"), MESSAGE_TYPES.ERROR);
            setData([]);
            return;
        }

        //? Condicion consulta por hashtag
        if (chooseArchiveType.type === ARCHIVE_TYPE.HASHTAG) {
            if (isEmpty(byHashtagChoose) || !regexHashTag.test(byHashtagChoose)) {
                renderToastMessage(t("MassAchivePost.warningHasgtag"), MESSAGE_TYPES.ERROR);
                setByHashtagChoose("#");
                setData([]);
                return;
            }

            let result = await getMsgArchive({
                botId,
                keyWord: byHashtagChoose,
                comany_id,
                endAt,
                startAt,
                numPage,
                setErroData,
                setLoadingData,
                chooseAsgmtType,
            });
            setData(get(result, "results", null));
            setResPagination(get(result, "pagination", null));
            if (isEmpty(result.results)) {
                renderToastMessage(t("MassAchivePost.warningSearch"), MESSAGE_TYPES.SUCCESS);
                return;
            }
        }
        //? Condicion consulta por Hilo
        if (chooseArchiveType.type === ARCHIVE_TYPE.THREAD) {
            let result = await getMsgArchive({ botId, comany_id, endAt, numPage, setErroData, setLoadingData, startAt, chooseAsgmtType });
            setData(get(result, "results", null));
            setResPagination(get(result, "pagination", null));
            if (isEmpty(result.results)) {
                renderToastMessage(t("MassAchivePost.warningSearch"), MESSAGE_TYPES.SUCCESS);
                return;
            }
        }
    };
    //TODO Funcion Archivar publicacion
    const onArchivar = async () => {
        if (isEmpty(data)) {
            renderToastMessage(t("MassAchivePost.errorSendArchive2"), MESSAGE_TYPES.ERROR);
            return;
        }

        if (chooseArchiveType.type === ARCHIVE_TYPE.THREAD) {
            if (isEmpty(selected)) {
                renderToastMessage(t("MassAchivePost.errorSendArchive"), MESSAGE_TYPES.ERROR);
                return;
            }

            Promise.allSettled(selected.map((id) => PostMsgArchive({ botId, parentId: id, setLoadingArchivar, setErrorArchivar, userSession }))).then(
                (results) => {
                    let errors = results.filter((result) => result.status === "rejected");
                    if (errors.length > 0) {
                        renderToastMessage(t("MassAchivePost.errorSendArchive3"), MESSAGE_TYPES.ERROR);
                        setData([]);
                        setSelected([]);
                        setAllCheck(false);
                        onCloseModal();
                    } else {
                        renderToastMessage(selected.length + " " + t("MassAchivePost.sendPostArchiveHilo"), MESSAGE_TYPES.SUCCESS);
                        setSelected([]);
                        setAllCheck(false);
                        onCloseModal();
                    }
                }
            );
            setData([]);
            setSelected([]);
        }
        if (chooseArchiveType.type === ARCHIVE_TYPE.HASHTAG) {
            if (isEmpty(byHashtagChoose) || !byHashtagChoose.startsWith("#") || !regexHashTag.test(byHashtagChoose)) {
                setData([]);
                renderToastMessage(t("MassAchivePost.warningHasgtag"), MESSAGE_TYPES.ERROR);
                return;
            }
            try {
                const result = await PostMsgArchive({ botId, wordKey: byHashtagChoose, setLoadingArchivar, setErrorArchivar, userSession });
                const numModify = get(result, "data.repliesUpdated.modifiedCount", "");
                renderToastMessage(numModify + " " + t("MassAchivePost.sendPostArchiveHash"), MESSAGE_TYPES.SUCCESS);
                onCloseModal();
            } catch (error) {
                renderToastMessage(t("MassAchivePost.errorSendArchive3"), MESSAGE_TYPES.ERROR);
                onCloseModal();
            }
        }
    };
    return (
        <ModalHeadlessSimple
            className="h-[48rem] w-[55rem] rounded-20 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)]"
            isShow={showModalPosts}
            closeModal={() => setShowModalPosts(false)}>
            <div className="items-center justify-between bg-primary-350 px-8 py-7 sm:flex">
                <div className="items-center justify-center gap-4 text-cyan-500 sm:flex">
                    <ArchivedIcon className="fill-current text-primary-200" width="15" height="15" />
                    <h4 className="text-xl font-semibold text-primary-200">{t("MassAchivePost.titleHead")}</h4>
                </div>
                <button onClick={onCloseModal}>
                    <CloseIcon1 className="fill-current text-xl text-primary-200" width="12" height="12" />
                </button>
            </div>
            <div className="h-[85vh] w-full justify-around sm:flex sm:items-center sm:text-left">
                <FilterMassPostM
                    t={t}
                    filters={conversationFilter}
                    selectedOptions={selectedOptionsConversation}
                    setSelectedOptions={setSelectedOptionsConversation}
                    chooseArchiveType={chooseArchiveType}
                    setChooseHashtag={setChooseHashtag}
                    chooseHashtag={chooseHashtag}
                    onGetPosts={onGetPosts}
                    initialFiltersModal={initialFiltersModal}
                    loadingData={loadingData}
                    handlePageActual={handlePageActual}
                    setChooseArchiveType={setChooseArchiveType}
                    setBotId={setBotId}
                    setChooseAsgmtType={setChooseAsgmtType}
                    camposObligatorios={camposObligatorios}
                />
                <hr className=" h-[85vh] border-l-2 border-gray-34" />
                <ResultMassPostMo
                    t={t}
                    onCloseModal={onCloseModal}
                    loadingData={loadingData}
                    data={data}
                    bot={bot}
                    chooseArchiveType={chooseArchiveType}
                    byHashtagChoose={byHashtagChoose}
                    allCheck={allCheck}
                    setAllCheck={setAllCheck}
                    selected={selected}
                    setSelected={setSelected}
                    onArchivar={onArchivar}
                    loadingArchivar={loadingArchivar}
                    totalPages={totalPages}
                    total={total}
                    page={page}
                    setPage={setPage}
                    setActualPage={setActualPage}
                    actualPage={actualPage}
                    nextPage={nextPage}
                    previousPage={previousPage}
                    onGetPosts={onGetPosts}
                />
            </div>
        </ModalHeadlessSimple>
    );
}
export default MonitoringMassArchivePost2;
