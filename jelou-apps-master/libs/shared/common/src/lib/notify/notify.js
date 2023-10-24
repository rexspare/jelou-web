import { toast } from "react-toastify";

const notify = (msg, position) => {
    toast.success(
        <div className="relative flex items-center justify-between">
            <div className="flex">
                <svg className="mr-2" width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M9.31301 12.3577L11.3428 14.3875L15.4024 10.3279M21.4919 12.3577C21.4919 17.4024 17.4024 21.4919 12.3577 21.4919C7.31307 21.4919 3.22357 17.4024 3.22357 12.3577C3.22357 7.31307 7.31307 3.22357 12.3577 3.22357C17.4024 3.22357 21.4919 7.31307 21.4919 12.3577Z"
                        stroke="#2BD88F"
                        strokeWidth="1.52236"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                <div className="text-15">{msg}</div>
            </div>
            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.11987 13.8801L14.254 4.74597M5.11987 4.74597L14.254 13.8801" stroke="#374361" strokeWidth="1.52236" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>,
        {
            position: position ? toast.POSITION.position : toast.POSITION.BOTTOM_RIGHT,
        }
    );
};

export default notify;
