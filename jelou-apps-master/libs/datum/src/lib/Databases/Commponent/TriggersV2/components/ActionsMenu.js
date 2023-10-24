import { 
    Dots, 
    EditIcon, 
    TrashIcon, 
    DuplicateIcon,
} from "@apps/shared/icons";
import { useTranslation } from 'react-i18next';
import { Menu , Transition} from '@headlessui/react';

const ActionsMenu = ({handleEditTrigger, handleDuplicateTrigger, handleDeleteTrigger}) => {
    const { t } = useTranslation();
    return (
        <Menu as="div" className="">
            <Menu.Button as="button" className="h-9 w-7">
                <div className="rotate-90 ml-8 mt-4">
                    <Dots width={25} height={25} className="" fill={'rgba(166, 180, 208, 0.60)'}/>
                </div>
            </Menu.Button>
            <Transition
                as="section"
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95">
                <Menu.Items as="ul" className="absolute mr-2 right-0 z-120 w-36 overflow-hidden rounded-10 bg-white shadow-menu bottom-[25%] translate-y-[60%]">
                    <Menu.Item as="li">
                        <button
                            onClick={handleEditTrigger}
                            className="flex gap-2 w-full px-4 py-2 text-left text-13 font-bold text-gray-400 hover:bg-primary-200 hover:bg-opacity-10 hover:text-primary-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        >   
                            <EditIcon width={15} height={15} fill="currentColor"/>
                            {t("shop.prices.editButton")}
                        </button>
                    </Menu.Item>
                    <Menu.Item as="li">
                        <button
                            onClick={handleDuplicateTrigger}
                            className="flex gap-2 w-full px-4 py-2 text-left text-13 font-bold text-gray-400 hover:bg-primary-200 hover:bg-opacity-10 hover:text-primary-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        >   
                            <DuplicateIcon width={15} height={15} fill="currentColor"/>
                            {t("datum.triggers.duplicateBtn")}
                        </button>
                    </Menu.Item>
                    <Menu.Item as="li">
                        <button
                            onClick={handleDeleteTrigger}
                            className="flex gap-2 w-full px-4 py-2 text-left text-13 font-bold text-gray-400 hover:bg-primary-200 hover:bg-opacity-10 hover:text-primary-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50" 
                        >
                            <TrashIcon width={15} height={15} fill="currentColor"/>
                            {t("shop.prices.deleteButton")}
                        </button>
                    </Menu.Item>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}

export default ActionsMenu