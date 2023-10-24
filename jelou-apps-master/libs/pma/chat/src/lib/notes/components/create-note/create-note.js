import { useTranslation } from "react-i18next";

export function CreateNote(props) {
    const { savingNote, createNote, noteChanged, updateNote, createNewNote, editNote, updatingNote } = props;
    const { t } = useTranslation();

    return (
        <footer className="sticky bottom-0 grid h-18 border-t-default border-[#DCDEE4] bg-white">
            {!(createNote || editNote) && (
                <button
                    onClick={() => createNewNote()}
                    className="m-4 flex justify-between rounded-[4px] border-default border-[#DCDEE4] bg-transparent px-6 py-2 text-sm text-[#B0B6C2] disabled:cursor-not-allowed"
                >
                    <p>{t("pma.Escribe una nota")}</p>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M15.8333 9.16668H10.8333V4.16668C10.8333 3.94566 10.7455 3.7337 10.5892 3.57742C10.433 3.42114 10.221 3.33334 9.99998 3.33334C9.77897 3.33334 9.567 3.42114 9.41072 3.57742C9.25444 3.7337 9.16665 3.94566 9.16665 4.16668V9.16668H4.16665C3.94563 9.16668 3.73367 9.25447 3.57739 9.41075C3.42111 9.56703 3.33331 9.779 3.33331 10C3.33331 10.221 3.42111 10.433 3.57739 10.5893C3.73367 10.7455 3.94563 10.8333 4.16665 10.8333H9.16665V15.8333C9.16665 16.0544 9.25444 16.2663 9.41072 16.4226C9.567 16.5789 9.77897 16.6667 9.99998 16.6667C10.221 16.6667 10.433 16.5789 10.5892 16.4226C10.7455 16.2663 10.8333 16.0544 10.8333 15.8333V10.8333H15.8333C16.0543 10.8333 16.2663 10.7455 16.4226 10.5893C16.5788 10.433 16.6666 10.221 16.6666 10C16.6666 9.779 16.5788 9.56703 16.4226 9.41075C16.2663 9.25447 16.0543 9.16668 15.8333 9.16668Z"
                            fill="#727C94"
                        />
                    </svg>
                </button>
            )}

            {(createNote || editNote) && (
                <button
                    disabled={!noteChanged}
                    onClick={() => updateNote()}
                    className="m-4 flex items-center justify-center rounded-full bg-primary-200 px-6 py-2 text-center text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-[#F1F3F5] disabled:text-[#DCDEE4]"
                >
                    {(savingNote || updatingNote) && (
                        <svg className="mr-4 h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    {t("pma.Guardar nota")}
                </button>
            )}
        </footer>
    );
}
export default CreateNote;
