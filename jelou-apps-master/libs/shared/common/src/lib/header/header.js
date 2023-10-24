import { Link } from "react-router-dom";
import { Fragment } from "react";

const Header = (props) => {
    const { title, tabs, tab, showChildren, children } = props;

    return (
        <div className="my-5 flex h-60 items-center rounded-1 bg-white px-6 shadow-outline-input">
            {title && (
                <h1 className="mr-6 block justify-start whitespace-nowrap font-primary font-bold leading-9 text-primary-200 sm:text-2xl">{title}</h1>
            )}
            <div className="flex h-full w-full items-center">
                <div className="flex h-full flex-1 items-end space-x-4">
                    {tabs.map((item) => (
                        <div key={item.key}>
                            {item.allowedPermission && (
                                <Link to={`/hsm/${item.key}`} replace>
                                    <div
                                        key={item.key}
                                        id={item.key}
                                        className={`${
                                            tab === item.key ? "border-b-5 border-primary-200" : "border-transparent"
                                        } transition-border mr-3 inline-flex h-54 items-center border-b-4 text-base font-normal capitalize text-gray-400/75 duration-100 hover:border-primary-200`}>
                                        {item.name}
                                    </div>
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
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

export default Header;
