import { CloseIcon } from "@builder/Icons";

type HeaderModalBtnsProps = {
    Icon: React.FC;
    colors: string;
    onClose: () => void;
    title: string;
};

export const HeaderModalBtns = ({ Icon, colors, onClose, title }: HeaderModalBtnsProps) => {
    return (
        <header className={`flex w-full items-center justify-between rounded-t-1 px-5 py-4 text-lg ${colors}`}>
            <div className="flex items-center space-x-3 px-3">
                <Icon />
                <span className="font-semibold">{title}</span>
            </div>
            <button aria-label="Close" onClick={onClose}>
                <CloseIcon />
            </button>
        </header>
    );
};
