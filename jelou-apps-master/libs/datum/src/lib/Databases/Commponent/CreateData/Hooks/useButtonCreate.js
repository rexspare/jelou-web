import { useState } from "react";

export function useButtonCreate() {
    const [isOpen, setIsOpen] = useState(false);
    const [isShow, setShow] = useState(false);

    function closeModalFromFile() {
        setIsOpen(false);
    }

    function openModalFromFile() {
        setIsOpen(true);
    }

    function closeModalFromCreation() {
        setShow(false);
    }

    function openModalFromCreation() {
        setShow(true);
    }

    return { isOpen, isShow, closeModalFromFile, openModalFromFile, closeModalFromCreation, openModalFromCreation };
}
