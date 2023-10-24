// import last from "lodash/last";
import isEmpty from "lodash/isEmpty";

import { Link, useLocation } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";

const TopNav = ({ options, currentOptionId, title, showChildren = false, children, lang, view = "", hasTabs = false, rounded = true }) => {
    const [items, setItems] = useState([]);
    const [hiddenItems, setHiddenItems] = useState([]);

    useEffect(() => {
        if (!isEmpty(options)) {
            setItems(options.filter((option) => !option.hidden));
            setHiddenItems(options.filter((option) => option.hidden));
        }
    }, [options, lang]);

    const location = useLocation();
    return (
        <div className={`flex h-60 items-center ${rounded ? "rounded-xl" : "rounded-t-xl"}  bg-white px-6 shadow-outline-input`}>
            {title && (
                <h1 className="mr-6 block justify-start whitespace-nowrap font-primary font-bold leading-9 text-primary-200 sm:text-2xl">{title}</h1>
            )}
            <div className="flex h-full w-full items-center">
                <div className="flex h-full flex-1 items-end">
                    {hasTabs
                        ? items.map((option, index) => (
                              <Link to={`/${view}/${option.name}`} key={index}>
                                  <button
                                      onClick={option.handleClick}
                                      key={index}
                                      className={`transition-border mr-3 inline-flex h-54 items-center border-b-4 text-base font-normal capitalize duration-100 hover:border-primary-200 ${
                                          location.pathname.includes(option.name) ? "border-primary-200" : "border-transparent"
                                      } max-w-[225px] truncate px-3 text-gray-400/75 ${index !== 0 && "px-4"}`}>
                                      {option.name.includes("live") && (
                                          <div className="heart mr-1 flex h-3 w-3 items-center justify-center rounded-full bg-green-500"></div>
                                      )}
                                      {option.label}
                                  </button>
                              </Link>
                          ))
                        : items.map((option, index) => (
                              <button
                                  onClick={option.handleClick}
                                  key={index}
                                  className={`transition-border mr-3 inline-flex h-54 items-center border-b-4 text-base font-normal duration-100 hover:border-primary-200 ${
                                      currentOptionId === option.id ? "border-primary-200" : "border-transparent"
                                  } max-w-[225px] truncate px-3 text-gray-400/75 ${index !== 0 && "px-4"}`}>
                                  {option.label}
                              </button>
                          ))}
                </div>

                {!isEmpty(hiddenItems) && (
                    <Menu as="div" className="relative flex h-full w-12 items-center justify-center">
                        <Menu.Button>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-500 hover:text-primary-200"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </Menu.Button>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95">
                            <Menu.Items className="absolute top-0 right-0 z-40 mt-14 flex w-[300px] flex-col overflow-hidden rounded-1 bg-white py-3 px-4 shadow-dropdown">
                                {hiddenItems.map((option, index) => (
                                    <Menu.Item key={index}>
                                        {({ active }) => (
                                            <Link to={option.name === "archive_posts" ? "" : `/${view}/${option.name}`} key={index}>
                                                <button
                                                    onClick={option.handleClick}
                                                    key={index}
                                                    className={`transition-border w-full truncate py-2 px-3 text-left font-normal capitalize duration-100 hover:text-primary-200 ${
                                                        currentOptionId === option.id ? "text-primary-200" : "text-gray-400/75"
                                                    } ${index !== 0 && "px-4"}`}>
                                                    {option.label}
                                                </button>
                                            </Link>
                                        )}
                                    </Menu.Item>
                                ))}
                            </Menu.Items>
                        </Transition>
                    </Menu>
                )}

                {showChildren && (
                    <Fragment>
                        <div className="h-30 border-r-1 border-gray-400/75"></div>
                        {children}
                    </Fragment>
                )}
            </div>
        </div>
    );
};

export default TopNav;
