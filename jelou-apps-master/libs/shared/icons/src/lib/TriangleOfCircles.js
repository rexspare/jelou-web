const TriangleOfCircles = (props) => {
    return(
        <svg width={props.width || "32"} height={props.height || "32"} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M8.00033 20C9.46699 20 10.667 21.2 10.667 22.6667C10.667 24.1333 9.46699 25.3333 8.00033 25.3333C6.53366 25.3333 5.33366 24.1333 5.33366 22.6667C5.33366 21.2 6.53366 20 8.00033 20ZM8.00033 17.3333C5.06699 17.3333 2.66699 19.7333 2.66699 22.6667C2.66699 25.6 5.06699 28 8.00033 28C10.9337 28 13.3337 25.6 13.3337 22.6667C13.3337 19.7333 10.9337 17.3333 8.00033 17.3333ZM16.0003 6.66667C17.467 6.66667 18.667 7.86667 18.667 9.33333C18.667 10.8 17.467 12 16.0003 12C14.5337 12 13.3337 10.8 13.3337 9.33333C13.3337 7.86667 14.5337 6.66667 16.0003 6.66667ZM16.0003 4C13.067 4 10.667 6.4 10.667 9.33333C10.667 12.2667 13.067 14.6667 16.0003 14.6667C18.9337 14.6667 21.3337 12.2667 21.3337 9.33333C21.3337 6.4 18.9337 4 16.0003 4ZM24.0003 20C25.467 20 26.667 21.2 26.667 22.6667C26.667 24.1333 25.467 25.3333 24.0003 25.3333C22.5337 25.3333 21.3337 24.1333 21.3337 22.6667C21.3337 21.2 22.5337 20 24.0003 20ZM24.0003 17.3333C21.067 17.3333 18.667 19.7333 18.667 22.6667C18.667 25.6 21.067 28 24.0003 28C26.9337 28 29.3337 25.6 29.3337 22.6667C29.3337 19.7333 26.9337 17.3333 24.0003 17.3333Z"
                fill={props.className || "#00B3C7"}
            />
        </svg>
    );
};

export default TriangleOfCircles;