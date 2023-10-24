import Icon from "./Icon";

const MailIcon = (props) => (
    <Icon viewBox="0 0 100 100" className={props.className} width={props.width} height={props.height}>
        <g clipPath="url(#clip0_2570_6)">
            <path d="M102 -2.5H-2V102.5H102V-2.5Z" fill="#2091A0" />
            <path
                d="M75.71 73H25.29C21.82 73 19 70.18 19 66.71V34.29C19 30.81 21.82 28 25.29 28H75.7C79.18 28 81.99 30.82 81.99 34.29V66.7C82 70.18 79.18 73 75.71 73Z"
                fill="white"
            />
            <path
                d="M82 34.29C82 34.18 81.99 34.06 81.98 33.95C81.98 33.86 81.98 33.77 81.97 33.68C81.66 30.5 78.98 28 75.71 28H25.29C22.02 28 19.33 30.5 19.03 33.7C19.02 33.79 19.01 33.88 19.02 33.97C19.01 34.07 19 34.18 19 34.29H19.06C19.15 34.7 19.38 35.09 19.81 35.39L46.17 54.06C48.99 56.06 52.92 56.03 55.71 54L81.23 35.38C81.64 35.08 81.87 34.69 81.96 34.29H82V34.29Z"
                fill="#ABF9FF"
            />
        </g>
        <defs>
            <clipPath id="clip0_2570_6">
                <rect width="100" height="100" rx="50" fill="white" />
            </clipPath>
        </defs>
    </Icon>
);

export default MailIcon;
