type NoContentProps = {
    message: string;
};

export const NoContent = ({ message }: NoContentProps) => {
    return (
        <div className="mx-6 flex h-32 w-[42rem] items-center justify-center rounded-10 border-1 border-gray-330">
            <p>{message}</p>
        </div>
    );
};
