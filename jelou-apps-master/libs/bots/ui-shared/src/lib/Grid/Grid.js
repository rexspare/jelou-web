const Grid = ({ className = "", children, status, templateColumns }) => {
    return (
        <div className={`grid grid-flow-row ${className}`} style={templateColumns ? { gridTemplateColumns: templateColumns } : null}>
            {children}
        </div>
    );
};

export default Grid;
