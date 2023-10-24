import React from "react";

const ChartContent = (props) => {
    const { title, description, setFullScreen, type, exportChart, requiresBot, requiresCompany, botsOptions, setBot } = props;
    return (
        <div className="flex h-full flex-col">
            <div className="relative mb-6 flex flex-col items-center justify-between 2xl:flex-row">
                <ChartContainerTitle title={props.title} description={props.description} />
                <div className="flex justify-end">
                    <button className="btn mr-4 items-center px-4 py-2" onClick={() => setFullScreen(true)}>
                        <DownloadIcon />
                    </button>
                    {type !== "number" && type !== "table" && (
                        <button className="btn mr-4 items-center px-4 py-2" onClick={exportChart}>
                            <DownloadIcon />
                        </button>
                    )}
                    {requiresBot && (
                        <div className="mr-4 flex">
                            <SelectSearch
                                className="c-select-search"
                                options={botsOptions}
                                search
                                renderValue={(valueProps) => {
                                    // Truncate value to avoid overlapping on input
                                    const value = valueProps.value.length > 15 ? `${valueProps.value.substring(0, 14)}...` : valueProps.value;
                                    return <input {...valueProps} value={value} className="c-select-search__input" />;
                                }}
                                onChange={(value) => {
                                    setBot(bots.find((bot) => bot.id === value));
                                }}
                                value={bot.id}
                                placeholder={t("plugins.Seleccionar Bot")}
                            />
                        </div>
                    )}
                    {requiresCompany && (
                        <div className="mr-4 flex">
                            <SelectSearch
                                options={companiesOptions}
                                search
                                className="c-select-search"
                                renderValue={(valueProps) => {
                                    // Truncate value to avoid overlapping on input
                                    const value = valueProps.value.length > 15 ? `${valueProps.value.substring(0, 14)}...` : valueProps.value;
                                    return <input {...valueProps} value={value} className="c-select-search__input" />;
                                }}
                                onChange={(value) => {
                                    setCompanyId(value);
                                }}
                                value={companyId}
                                placeholder={t("plugins.Seleccionar Compañía")}
                            />
                        </div>
                    )}
                    {requiresPeriod && (
                        <button className="btn py-2 pl-4 pr-2" ref={setReferenceElement} onClick={() => setShowMenu(!showMenu)}>
                            {getPeriodName()}
                            <span className="ml-4 flex h-full items-center justify-center border-l px-3">
                                <Down />
                            </span>
                        </button>
                    )}
                </div>
                <Transition
                    show={showMenu}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                    className="relative z-50">
                    <PeriodPicker
                        period={period}
                        startAt={startAt}
                        setPeriod={setPeriod}
                        setStartAt={setStartAt}
                        endAt={endAt}
                        setPopperElement={setPopperElement}
                        styles={styles}
                        popperElement={popperElement}
                        attributes={attributes}
                        setEndAt={setEndAt}
                        setShowMenu={setShowMenu}
                        handlePeriodChange={handlePeriodChange}
                    />
                </Transition>
            </div>
            {loading ? (
                <div className={`${fullscreen ? "h-[500px]" : "h-300"} flex items-center justify-center`}>
                    <GridLoader size={15} color={"#00B3C7"} loading={loading} />
                </div>
            ) : (
                <div className={`${fullscreen ? "flex h-[550px] flex-1 items-center justify-center" : "h-300"} relative`}>{props.children}</div>
            )}
        </div>
    );
};

export default ChartContent;
