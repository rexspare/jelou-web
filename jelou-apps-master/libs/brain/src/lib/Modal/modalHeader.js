import { CloseIcon1 } from "@apps/shared/icons";

const ModalHeader = (props) => {
    const { title, closeModal, background = "bg-primary-350", icon } = props;

    return (
        <header className={`right-0 top-0 flex items-center justify-between ${background} rounded-t-20  px-10 py-4`}>
            <div className="flex items-center gap-x-4">
                {icon}
                <div className="text-base font-semibold text-primary-200">{title}</div>
            </div>
            <button onClick={closeModal}>
                <CloseIcon1 width={"16px"} height={"16px"} className="fill-current text-primary-200" />
            </button>
        </header>
    );
};

export default ModalHeader;
