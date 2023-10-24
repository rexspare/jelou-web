import { Menu, Transition } from "@headlessui/react";

const OptionsCard = ({ items, card }) => {
    return (
        <Menu as="div">
            <Menu.Button
                onClick={(evt) => {
                    evt.stopPropagation();
                }}
                as="button"
                className="flex items-start justify-end">
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M12.1353 5L12.1353 5.01M12.1353 12L12.1353 12.01M12.1353 19L12.1353 19.01M12.1353 6C11.5847 6 11.1383 5.55228 11.1383 5C11.1383 4.44772 11.5847 4 12.1353 4C12.686 4 13.1323 4.44772 13.1323 5C13.1323 5.55228 12.686 6 12.1353 6ZM12.1353 13C11.5847 13 11.1383 12.5523 11.1383 12C11.1383 11.4477 11.5847 11 12.1353 11C12.686 11 13.1323 11.4477 13.1323 12C13.1323 12.5523 12.686 13 12.1353 13ZM12.1353 20C11.5847 20 11.1383 19.5523 11.1383 19C11.1383 18.4477 11.5847 18 12.1353 18C12.686 18 13.1323 18.4477 13.1323 19C13.1323 19.5523 12.686 20 12.1353 20Z"
                        stroke="#727C94"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </Menu.Button>
            <Transition
                as="section"
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95">
                <Menu.Items as="ul" className="absolute right-0 z-120 w-36 min-w-36 overflow-hidden rounded-10 bg-white shadow-menu">
                    {items.map((item, index) => (
                        <Menu.Item key={`datastore-card-${index}`} as="li">
                            <button
                                onClick={(evt) => {
                                    evt.stopPropagation();
                                    item.onClick(card);
                                }}
                                className={`w-full px-4 py-3 text-left text-sm ${
                                    item?.color ? "text-[#f12b2c]" : "text-gray-400 hover:text-primary-200"
                                } hover:bg-primary-200 hover:bg-opacity-10 focus:outline-none`}>
                                {item.text}
                            </button>
                        </Menu.Item>
                    ))}
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default OptionsCard;
