import { ClipLoader } from "react-spinners";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useContext } from "react";
import { CircularProgressbar } from "react-circular-progressbar";

import get from "lodash/get";
import trim from "lodash/trim";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import compact from "lodash/compact";
import orderBy from "lodash/orderBy";

import { DateContext } from "@apps/context";
import { Note } from "./components/note/note";
import { CloseIcon } from "@apps/shared/icons";
import { mergeById } from "@apps/shared/utils";
import { JelouApiV1 } from "@apps/shared/modules";
import { Search } from "./components/search/search";
import { setShowDisconnectedModal } from "@apps/redux/store";
import { checkIfOperatorIsOnline } from "@apps/shared/utils";
import { useOperatorData, usePrevious } from "@apps/shared/hooks";
import { CreateNote } from "./components/create-note/create-note";
import { notify, NotifyError, NoteSkeleton } from "@apps/shared/common";

export function Notes(props) {
    const { currentRoom } = props;
    const [notes, setNotes] = useState([]);

    const [loadingSearch, setLoadingSearch] = useState(false);
    const [loadingNotes, setLoadingNotes] = useState(true);
    const [savingNote, setSavingNotes] = useState(false);
    const [updatingNote, setUpdatingNote] = useState(false);
    const [createNote, setCreateNote] = useState(false);
    const [editNote, setEditNote] = useState(false);

    const [originalNote, setOriginalNote] = useState({ title: "", content: "" });
    const [storedNote, setStoredNote] = useState({ title: "", content: "" });
    const [noteChanged, setNoteChaged] = useState(false);
    const userSession = useSelector((state) => state.userSession);
    const company = useSelector((state) => state.company);

    const dayjs = useContext(DateContext);

    const TODAY = [dayjs().startOf("day").format(), dayjs().endOf("day").format()];
    const LAST_24_HOURS = [dayjs().add(-1, "day").format(), dayjs().format()];

    const DEFAULT_DATE = company.properties?.has24HoursAttention ? LAST_24_HOURS : TODAY;
    const [startDate, setStartDate] = useState(DEFAULT_DATE[0]);
    const [endDate, setEndDate] = useState(DEFAULT_DATE[1]);
    const [selectedOptions, setSelectedOptions] = useState({ date: [] });
    const [operatorSelected, setOperatorSelected] = useState("");

    const [hasMoreNotes, setHasMoreNotes] = useState(true);
    const [loadingMoreNotes, setLoadingMoreNotes] = useState(false);
    const [pag, setPag] = useState(1);

    const [showSortOptions, setShowSortOptions] = useState(false);
    const [sortOrder, setSortOrder] = useState(-1);
    const [selectedDates, setSelectedDates] = useState(false);
    const [clearFilters, setClearFilters] = useState(false);

    const { data: operatorOptions = [] } = useOperatorData(company, { shouldPaginate: false, team: userSession?.teams });

    const [countName, setCountName] = useState(0);
    const [countTitle, setCountTitle] = useState(0);
    const [percentageName, setPercentageName] = useState(0);
    const [percentageTitle, setPercentageTitle] = useState(0);
    const MAXIMUM_CHARACTERS_NAME = 150;
    const MAXIMUM_CHARACTERS_TITLE = 60;

    const roomId = currentRoom?.archived ? currentRoom?.roomId : currentRoom?.id;
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    const prevCurrentRoom = usePrevious(currentRoom);

    //search
    const [query, setQuery] = useState("");
    const [searchBy, setSearchBy] = useState({});

    const typeSearchBy = [
        { id: 0, name: "Título", searchBy: "title", isNumber: false },
        { id: 1, name: "Contenido", searchBy: "content", isNumber: false },
    ];

    const [open, setOpen] = useState(false);
    const { t } = useTranslation();

    const statusOperator = useSelector((state) => state.statusOperator);
    const dispatch = useDispatch();

    useEffect(() => {
        setNoteChaged(!isEqual(originalNote, storedNote));
    }, [storedNote]);

    useEffect(() => {
        getNotes();
    }, [query, searchBy, sortOrder, clearFilters]);

    useEffect(() => {
        if (!isEmpty(currentRoom) && prevCurrentRoom?.id !== currentRoom?.id) {
            getNotes();
        }
    }, [currentRoom]);

    const handleLoadMoreNotes = async () => {
        const pagination = pag + 1;
        setPag(pagination);

        try {
            setLoadingMoreNotes(true);
            const notes = await getNotes(pagination, true);
            if (notes) {
                if (notes.length > 0) {
                    setHasMoreNotes(true);
                } else {
                    setHasMoreNotes(false);
                }
                setLoadingMoreNotes(false);
            }
            setLoadingMoreNotes(false);
        } catch (error) {
            console.log(error, "error");
            setLoadingMoreNotes(false);
        }
    };

    const findPercentageCharName = (numPercentge) => {
        setPercentageName((numPercentge * 100) / MAXIMUM_CHARACTERS_NAME);
    };

    const findPercentageCharTitle = (numPercentge) => {
        setPercentageTitle((numPercentge * 100) / MAXIMUM_CHARACTERS_TITLE);
    };

    const handleNewNote = (e) => {
        setStoredNote({
            ...storedNote,
            [e.target.name]: e.target.value,
        });
        if (e.target.name === "content") {
            setCountName(e.target.value.length);
            findPercentageCharName(e.target.value.length);
        }
        if (e.target.name === "title") {
            setCountTitle(e.target.value.length);
            findPercentageCharTitle(e.target.value.length);
        }
    };

    const getNotes = async (pagination, loadingMoreNotes = false) => {
        loadingMoreNotes ? setLoadingNotes(false) : setLoadingNotes(true);
        const search_by = searchBy.searchBy ? searchBy.searchBy : "content";
        return JelouApiV1.get(`rooms/${roomId}/notes`, {
            params: {
                ...(selectedDates ? { startDate } : {}),
                ...(selectedDates ? { endDate } : {}),
                ...(!isEmpty(operatorSelected) ? { operatorId: operatorSelected?.providerId } : {}),
                ...(sortOrder ? { sort: sortOrder } : {}),
                ...(!isEmpty(query) ? { search: query } : {}),
                ...(!isEmpty(searchBy) ? { searchBy: search_by } : {}),
                limit: 10,
                page: pagination ? pagination : pag,
            },
        })
            .then((resp) => {
                const data = get(resp, "data.data", []);
                const sortedDat = sortOrder === -1 ? "desc" : "asc";

                if (!isEmpty(query) || !isEmpty(searchBy) || !isEmpty(operatorSelected) || selectedDates) {
                    setNotes(orderBy(data, ["createdAt"], [sortedDat]));
                } else {
                    setNotes(orderBy(compact(mergeById(notes, data, "_id")), ["createdAt"], [sortedDat]));
                }
                setLoadingNotes(false);
                return data;
            })
            .catch((error) => {
                setLoadingNotes(false);
                console.log(error);
            });
    };

    const updateNote = async () => {
        if (checkIfOperatorIsOnline(statusOperator)) {
            dispatch(setShowDisconnectedModal(true));
            return;
        }
        editNote ? setUpdatingNote(true) : setSavingNotes(true);
        try {
            if (isEmpty(trim(storedNote.title)) || isEmpty(trim(storedNote.content))) {
                NotifyError(t("pma.Todos los campos son obligatorios"), "TOP_RIGHT");
                editNote ? setUpdatingNote(false) : setSavingNotes(false);
                return;
            }

            const uri = editNote ? `update` : `add`;

            editNote
                ? await JelouApiV1.put(`rooms/${roomId}/notes/${uri}`, {
                      title: storedNote.title,
                      content: storedNote.content,
                      ...(editNote ? { noteId: originalNote._id } : {}),
                      operatorId: userSession?.operatorId,
                  })
                : await JelouApiV1.post(`rooms/${roomId}/notes/${uri}`, {
                      title: storedNote.title,
                      content: storedNote.content,
                      ...(editNote ? { noteId: originalNote._id } : {}),
                      operatorId: userSession?.operatorId,
                  });

            const message = editNote ? t("pma.Haz editado una nota exitosamente") : t("pma.Haz creado una nota nueva exitosamente");

            notify(message, "TOP_RIGHT");
            getNotes();
        } catch (err) {
            const { response } = err;
            const { data } = response;

            let errorMessage = get(data, `error.clientMessages.${lang}`, editNote ? t("pma.No se ha podido editar la nota") : t("pma.No se ha podido creado una nota nueva"));

            NotifyError(errorMessage, "TOP_RIGHT");
            editNote ? setUpdatingNote(false) : setSavingNotes(false);
            console.log(err);
        }
        editNote ? setUpdatingNote(false) : setSavingNotes(false);
        editNote ? setStoredNote({ title: "", content: "", noteId: "" }) : setStoredNote({ title: "", content: "" }); //reset stored note
        setCountName(0);
        setCountTitle(0);
        setPercentageTitle(0);
        setPercentageName(0);
        setCreateNote(false);
        setEditNote(false);
    };

    async function handleKeyDown(e) {
        if (e.key === "Enter") {
            setLoadingSearch(false);
        }
    }

    const dateChange = (range) => {
        const [startDate, endDate] = range;
        setSelectedOptions({ ...selectedOptions, date: [dayjs(startDate).format(), dayjs(endDate).format()] });
        setSelectedDates(true);

        setStartDate(dayjs(startDate).format());
        setEndDate(dayjs(endDate).format());
    };

    const selectOperator = (operator) => {
        setOperatorSelected(operator);
    };

    const editExistingNote = (note) => {
        setEditNote(true);
        setStoredNote({ ...note });
        setOriginalNote({ ...note });
        setCountName(get(note, "content", "").length);
        setCountTitle(get(note, "title", "").length);
        findPercentageCharName(get(note, "content", "").length);
        findPercentageCharTitle(get(note, "title", "").length);
    };

    const cleanOperatorSelected = () => {
        setOperatorSelected("");
    };

    const cleanDateSelected = () => {
        setSelectedOptions({ ...selectedOptions, date: [] });
        setStartDate([null]);
        setEndDate([null]);
        setSelectedDates(false);
    };

    const filters = [
        {
            label: t("pma.Fecha"),
            type: "rangeDate",
            value: selectedOptions.date,
            handleChange: dateChange,
            clean: cleanDateSelected,
            selectedDates: selectedDates,
        },
        {
            label: t("monitoring.Operador"),
            type: "select",
            options: operatorOptions,
            value: operatorSelected,
            handleChange: selectOperator,
            clean: cleanOperatorSelected,
        },
    ];

    let loadingSkeleton = [];

    for (let i = 0; i < 6; i++) {
        loadingSkeleton.push(<NoteSkeleton key={i} />);
    }

    const cleanFilter = () => {
        setQuery("");
        setSearchBy({});
    };

    const cleanFilters = () => {
        setOperatorSelected("");
        setSelectedOptions({ ...selectedOptions, date: [] });
        setStartDate([null]);
        setEndDate([null]);
        setSelectedDates(false);
        setClearFilters(!clearFilters);
        setPag(1);
    };

    const createNewNote = () => {
        setCreateNote(true);
        if (editNote) {
            setEditNote(false);
            setStoredNote({ title: "", content: "" });
            setOriginalNote({ title: "", content: "" });
            setCountName(0);
            setCountTitle(0);
            setPercentageName(0);
            setPercentageTitle(0);
        }
    };

    const closeNote = () => {
        setCreateNote(false);
        setEditNote(false);
        setStoredNote({ title: "", content: "" });
        setOriginalNote({ title: "", content: "" });
        setCountName(0);
        setCountTitle(0);
        setPercentageName(0);
        setPercentageTitle(0);
    };

    return (
        <main className="relative flex max-w-xs flex-col">
            <div className="border-b-default border-b-[#DCDEE4] py-4">
                <Search
                    loadingSearch={loadingSearch}
                    handleKeyDown={handleKeyDown}
                    filters={filters}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                    showSortOptions={showSortOptions}
                    setShowSortOptions={setShowSortOptions}
                    getNotes={getNotes}
                    open={open}
                    setOpen={setOpen}
                    notes={notes}
                    cleanFilters={cleanFilters}
                    //search
                    setQuery={setQuery}
                    query={query}
                    searchBy={searchBy}
                    setSearchBy={setSearchBy}
                    clean={cleanFilter}
                    typeSearchBy={typeSearchBy}
                    cleanOperatorSelected={cleanOperatorSelected}
                    cleanDateSelected={cleanDateSelected}
                />
            </div>
            {loadingNotes ? (
                <div className="h-sidebar overflow-y-auto px-4 pb-28">
                    <div className="space-y-4">
                        <span>{loadingSkeleton}</span>
                    </div>
                </div>
            ) : isEmpty(notes) && !createNote ? (
                <div className="h-full min-h-full overflow-y-scroll pb-[20rem]">
                    <p className="mt-4 text-center text-sm font-bold text-gray-400">{t("pma.No hay notas sobre el usuario")}</p>
                </div>
            ) : createNote || editNote ? (
                <div className="h-full min-h-full overflow-y-scroll px-4 pb-[20rem]">
                    <div className="mt-3 mb-5 flex items-center justify-between">
                        <p className="text-sm font-bold text-gray-400">{createNote ? t("pma.Crear nota") : t("pma.Editar nota")}</p>
                        <span
                            onClick={() => {
                                closeNote();
                            }}
                        >
                            <CloseIcon className="cursor-pointer fill-current text-gray-400" width="0.5rem" height=".5rem" />
                        </span>
                    </div>
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="title">
                                <p className="pl-2 text-sm font-bold text-gray-400">{t("pma.Título de la nota")}</p>
                                <textarea
                                    name="title"
                                    className={`mb-2 flex w-full resize-none justify-between rounded-9 border-default px-2 py-2 text-sm text-[#374361] placeholder:text-[#B0B6C2] ${
                                        countTitle !== 0 && countTitle === MAXIMUM_CHARACTERS_TITLE
                                            ? "!border-red-950 bg-red-1010 bg-opacity-10"
                                            : "focus:ring-0 border-[#DCDEE4] bg-transparent focus:border-primary-200 focus:ring-transparent"
                                    }`}
                                    placeholder="P. ej. Cliente nuevo"
                                    type="text"
                                    value={storedNote.title}
                                    onChange={handleNewNote}
                                    rows="2"
                                    maxLength={MAXIMUM_CHARACTERS_TITLE}
                                />
                                <div className="flex items-end justify-end ">
                                    <span className="pr-1 text-xs text-[#959DAF]">{countTitle + `/${MAXIMUM_CHARACTERS_TITLE}`}</span>
                                    <div style={{ width: 18, height: 18 }}>
                                        <CircularProgressbar value={percentageTitle} />
                                    </div>
                                </div>
                            </label>
                        </div>
                        <div>
                            <label htmlFor="content">
                                <p className="pl-2 text-sm font-bold text-gray-400">{t("pma.Nota")}</p>
                                <div className="relative">
                                    <textarea
                                        name="content"
                                        className={`mb-2 flex w-full justify-between rounded-9 border-default px-2 py-2 text-sm text-[#374361] placeholder:text-[#B0B6C2] ${
                                            countName !== 0 && countName === MAXIMUM_CHARACTERS_NAME
                                                ? "!border-red-950 bg-red-1010 bg-opacity-10"
                                                : "focus:ring-0 border-[#DCDEE4] bg-transparent focus:border-primary-200 focus:ring-transparent"
                                        }`}
                                        onChange={handleNewNote}
                                        type="text"
                                        maxLength={MAXIMUM_CHARACTERS_NAME}
                                        value={storedNote.content}
                                        rows="4"
                                        cols="36"
                                    />
                                    <div className="flex items-end justify-end ">
                                        <span className="pr-1 text-xs text-[#959DAF]">{countName + `/${MAXIMUM_CHARACTERS_NAME}`}</span>
                                        <div style={{ width: 18, height: 18 }}>
                                            <CircularProgressbar value={percentageName} />
                                        </div>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-sidebar overflow-y-auto px-4 pb-18">
                    <div className="space-y-4">
                        {notes.map((note, index) => {
                            return (
                                <Note
                                    note={note}
                                    key={index}
                                    index={index}
                                    editNote={editNote}
                                    countName={countName}
                                    closeNote={closeNote}
                                    storedNote={storedNote}
                                    updateNote={updateNote}
                                    updatingNote={updatingNote}
                                    originalNote={originalNote}
                                    handleNewNote={handleNewNote}
                                    percentageName={percentageName}
                                    editExistingNote={editExistingNote}
                                    MAXIMUM_CHARACTERS_NAME={MAXIMUM_CHARACTERS_NAME}
                                    MAXIMUM_CHARACTERS_TITLE={MAXIMUM_CHARACTERS_TITLE}
                                />
                            );
                        })}
                    </div>
                    {notes.length >= 9 && hasMoreNotes && (
                        <div className="my-4 flex items-center justify-center sm:my-6">
                            {loadingMoreNotes ? (
                                <ClipLoader color="#00B3C7" size={"1.75rem"} />
                            ) : (
                                <button onClick={handleLoadMoreNotes} className="h-8 rounded-full border-transparent bg-primary-200 px-6 text-white hover:bg-primary-100 focus:outline-none">
                                    {t("pma.Cargar más")}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
            <CreateNote
                notes={notes}
                editNote={editNote}
                updateNote={updateNote}
                savingNote={savingNote}
                createNote={createNote}
                noteChanged={noteChanged}
                updatingNote={updatingNote}
                createNewNote={createNewNote}
            />
        </main>
    );
}
export default Notes;
