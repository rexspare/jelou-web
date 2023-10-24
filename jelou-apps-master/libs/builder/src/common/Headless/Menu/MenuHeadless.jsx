import { Menu, Transition } from "@headlessui/react";
import React, { Fragment } from "react";

/**
 * @param {{
 * IconMenu: React.FC<React.SVGProps<SVGSVGElement>>,
 * positionMenu?: string,
 * menuItemsList: Array<{ id: string | number, Icon: React.FC<React.SVGProps<SVGSVGElement>>, label: string, onClick: () => void, separator: boolean, disable: boolean  }>
 * }} props
 */
export function MenuHeadless({ IconMenu, positionMenu = "shadow-nodo", menuItemsList }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button aria-label="menu actions blocks" as="button" className="flex items-center gap-2">
        <span className="sr-only">menuHeadlessBtn</span>
        {IconMenu && <IconMenu />}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95">
        <Menu.Items as="ul" className={`absolute rounded-lg bg-white ${positionMenu}`}>
          {menuItemsList &&
            menuItemsList.map((item) => {
              const { id, Icon, label, onClick, separator, disable = false } = item;

              const disableStyle = disable ? "text-gray-400 text-opacity-30 cursor-not-allowed" : "hover:text-primary-200 text-gray-400";
              const separatorStyle = separator ? "border-grey-75 border-b-0.5 border-opacity-25" : "";

              return (
                <Menu.Item
                  key={id}
                  as="li"
                  className="focus:outline-none focus:ring-transparent focus-visible:outline-none focus-visible:ring-transparent">
                  <button
                    onClick={onClick}
                    className={`flex w-full items-center justify-center gap-2 px-3 py-3 text-sm font-medium ${disableStyle} ${separatorStyle}`}>
                    <Icon fill="currentColor" />
                    {label && <span className="w-20 text-left">{label}</span>}
                  </button>
                </Menu.Item>
              );
            })}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
