const Tag = (props) => {
    const { tag } = props;
    return (
        <div className="ml-1 h-6">
            <div className="h-full">
                <div className={`flex items-center px-3 h-full rounded-md text-13 font-bold text-white`} style={{ backgroundColor: tag.color }}>
                    <p className="flex-shrink-0">{tag.name.es}</p>
                </div>
            </div>
        </div>
    );
};
export default Tag;
