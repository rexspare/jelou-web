import { TrashIcon2 } from "@apps/shared/icons";
import { CloseIcon, SpinnerIcon } from "@builder/Icons";
import { Children, cloneElement, isValidElement } from "react";
import { ModalHeadless } from "./Modal";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode[];
};

export const DeleteModalHeadless = ({ isOpen, onClose, children }: Props) => {
    return (
        <ModalHeadless showBtns={false} className="w-78" showClose={false} isDisable={false} isOpen={isOpen} closeModal={onClose}>
            {Children.map(children, (child) => {
                if (isValidElement(child) && child.type === Header) {
                    return cloneElement(child as React.ReactElement, { onClose });
                }
                return null;
            })}
            <main className="px-8 pt-6 pb-2 text-gray-400">
                {Children.map(children, (child) => {
                    if (isValidElement(child) && child.type === Main) return child;
                    if (isValidElement(child) && child.type === Footer) return cloneElement(child as React.ReactElement, { onSecondaryClick: onClose });
                    return null;
                })}
            </main>
        </ModalHeadless>
    );
};

type HeaderProps = {
    onClose?: () => void;
    children: React.ReactNode | React.ReactNode[] | string;
};

function Header({ onClose, children }: HeaderProps) {
    return (
        <header className="flex w-full items-center justify-between rounded-t-1 bg-[#FEEFEF] px-5 py-4 text-lg text-semantic-error">
            <div className="flex items-center space-x-3 px-3">
                <TrashIcon2 />
                <span className="font-semibold">{children}</span>
            </div>
            <button aria-label="Close" onClick={onClose}>
                <CloseIcon />
            </button>
        </header>
    );
}

type MainProps = {
    actionVerbs: string;
    description: string;
};
function Main({ actionVerbs, description }: MainProps) {
    return (
        <>
            <p className="mb-2 font-semibold">Estas a punto de eliminar {actionVerbs}</p>
            {description && <p>{description}</p>}
            <p className="mt-4 font-semibold">¿Deseas hacerlo?</p>
        </>
    );
}

type FooterProps = {
    secondaryLabel: string;
    loading: boolean;
    className?: string;
    disabled?: boolean;
    onSecondaryClick?: () => void;
    onPrimaryClick: () => void;
    children: React.ReactNode | React.ReactNode[] | string;
};

function Footer({ onPrimaryClick, onSecondaryClick, secondaryLabel, className, disabled, children, loading }: FooterProps) {
    return (
        <footer className={`flex justify-end gap-2 py-4 ${className}`}>
            <button type="button" onClick={onSecondaryClick} className="h-10 min-w-1 rounded-20 bg-primary-700 px-4 font-semibold text-gray-400 disabled:cursor-not-allowed disabled:opacity-40">
                {secondaryLabel}
            </button>
            <button
                type="submit"
                onClick={onPrimaryClick}
                disabled={disabled || loading}
                className="flex h-10 items-center justify-center gap-2 rounded-20 bg-semantic-error px-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
                {loading ? <SpinnerIcon /> : <TrashIcon2 width={20} height={20} />}
                {children}
            </button>
        </footer>
    );
}

DeleteModalHeadless.Header = Header;
DeleteModalHeadless.Main = Main;
DeleteModalHeadless.Footer = Footer;
