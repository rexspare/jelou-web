import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CloseIcon2 as CloseIconBold } from "@apps/shared/icons";

export function DeleteSlideOver({ children, open, setOpen, title }) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-20 overflow-hidden"
        onClose={setOpen}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0" />

          <div className="fixed inset-y-0 right-0 flex w-74 pl-10 pointer-events-none">
            <Transition.Child
              as={Fragment}
              enterTo="translate-x-0"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
              enterFrom="translate-x-full"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              enter="transform transition ease-in-out duration-500 sm:duration-700"
            >
              <div className="w-screen max-w-md pointer-events-auto">
                <div className="flex flex-col h-full py-6 overflow-y-scroll bg-white shadow-xl">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                        {
                            title && 
                            <Dialog.Title className="text-lg font-bold text-primary-200">
                                {title}
                            </Dialog.Title>
                        }
                        <div className="flex items-center ml-3 h-7">
                            <button type="button" onClick={() => setOpen(false)}>
                            <CloseIconBold />
                            </button>
                        </div>
                    </div>
                  </div>
                  <div className="relative flex-1 mt-6 text-gray-400">
                    {children}
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
