import { useRef } from "react";
import ChartContainer from "./ChartContainer";
import { useOnClickOutside } from "@apps/shared/hooks";
import toUpper from "lodash/toUpper";

const FullScreenChartContainer = (props) => {
    const {
        fullscreen,
        setFullScreen,
        id,
        title,
        startAt,
        setStartAt,
        endAt,
        setEndAt,
        loading,
        period,
        setPeriod,
        type,
        bots,
        companies,
        bot,
        setBot,
        companySelect,
        setCompanySelect,
        schemaPayload,
        exportChart,
        description,
        getChartToRender,
        botsOptionsAll,
        loadingDownload,
        setLoadingDownload,
        handlePeriodChange,
        multipleBot,
        setMultipleBot,
        invocationName,
        showLabels,
        setTagsChecked,
        onClose,
        handleCompany,
        hasCustomFilters,
        customFilters,
        handleCustomChange,
        clearFilters,
        invokeMetric,
        handleCustomParams,
    } = props;

    const ref = useRef();
    useOnClickOutside(ref, () => onClose());

    return (
        <div>
            {fullscreen && (
                <div className="fixed inset-x-0 top-0 z-[1001] sm:inset-0 sm:flex sm:items-center sm:justify-center">
                    <div className="fixed inset-0 transition-opacity">
                        <div className="absolute inset-0 z-100 bg-gray-490 bg-opacity-40" />
                    </div>
                    <div
                        className={`relative flex flex-col rounded-xl bg-white ${toUpper(type) === "NODES" ? "h-[96%] w-[98%]" : "w-5/6"}`}
                        ref={ref}>
                        <ChartContainer
                            setFullScreen={setFullScreen}
                            fullscreen={fullscreen}
                            id={`chart-${id}`}
                            title={title}
                            startAt={startAt}
                            setStartAt={setStartAt}
                            endAt={endAt}
                            setEndAt={setEndAt}
                            loading={loading}
                            loadingDownload={loadingDownload}
                            setLoadingDownload={setLoadingDownload}
                            period={period}
                            setPeriod={setPeriod}
                            type={type}
                            bots={bots}
                            companies={companies}
                            bot={bot}
                            setBot={setBot}
                            companySelect={companySelect}
                            setCompanySelect={setCompanySelect}
                            schemaPayload={schemaPayload}
                            handlePeriodChange={handlePeriodChange}
                            exportChart={exportChart}
                            invocationName={invocationName}
                            description={description}
                            multipleBot={multipleBot}
                            setMultipleBot={setMultipleBot}
                            botsOptionsAll={botsOptionsAll}
                            setTagsChecked={setTagsChecked}
                            onClose={onClose}
                            handleCompany={handleCompany}
                            showLabels={showLabels}
                            hasCustomFilters={hasCustomFilters}
                            customFilters={customFilters}
                            handleCustomChange={handleCustomChange}
                            clearFilters={clearFilters}
                            invokeMetric={invokeMetric}
                            handleCustomParams={handleCustomParams}>
                            {getChartToRender(true)}
                        </ChartContainer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FullScreenChartContainer;
