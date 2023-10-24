import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CloseIcon } from "@apps/shared/icons";

const SlideOver = (props) => {
  const { isOpen, closeModal, children, title = "" } = props;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10" onClose={closeModal}>
        <div className="relative min-h-screen">
          <Dialog.Overlay className="fixed inset-0" />

          <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-500 sm:duration-700"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-500 sm:duration-700"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full">
            <div className="absolute top-0 right-0 mb-2 h-full w-80 transform overflow-y-auto bg-white opacity-100 shadow-xl drop-shadow-default transition-all">
              <Dialog.Title as="h3" className="break-word flex justify-between pt-4 pb-2 pl-6 pr-2 text-2xl font-bold leading-6 text-primary-200">
                <span className="text-xl">{title}</span>
                <button onClick={closeModal}>
                  <CloseIcon className="fill-current text-gray-400/25" width="0.953125rem" height="0.954375rem" />
                </button>
              </Dialog.Title>
              <Dialog.Description>{children}</Dialog.Description>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
export default SlideOver;
