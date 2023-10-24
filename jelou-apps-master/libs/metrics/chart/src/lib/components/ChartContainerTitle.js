const ChartContainerTitle = (props) => {
    const { 
        title, 
        isTypeNode, 
        fullscreen, 
        setShowChartDetails,
    } = props;

    return (
        <div
            className={`${fullscreen ? "text-xl" : "text-lg"} ${
                isTypeNode ? "items-center" : "mb-4 items-baseline"
            } mr-3 mt-8 flex flex-1 font-medium text-gray-400`}>
            <span
                onClick={() => setShowChartDetails(true)}
                className="relative mr-2 inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-gray-border text-xs text-gray-450 opacity-75 hover:opacity-100"
                style={{ top: "-2px" }}>
                ?
            </span>
            <h2>{title}</h2>
        </div>
    );
};

export default ChartContainerTitle;
