import Icon from "./Icon";

const EditButtonIcon = (props) => (
    <Icon viewBox="0 0 35 36" className={props.className} width={props.width} height={props.height} fill="none">
        <g fill="#00B3C7" clipPath="url(#a)">
          <path d="M13.059 23.214c-1.136 0-2.272 0-3.429.022l.622.621c-.107-1.028-.193-2.057-.3-3.085l-.193.45 3.364-4.072 4.5-5.464.321-.386c.493-.578 1.307-.728 1.95-.257.514.386 1.114.836 1.157 1.522.022.407-.128.75-.385 1.05-1.35 1.65-2.722 3.278-4.072 4.928-1.328 1.607-2.657 3.193-3.964 4.8-.021.021-.043.064-.064.086-.214.257-.257.642 0 .878.214.214.664.257.878 0 1.393-1.693 2.807-3.385 4.2-5.078.943-1.136 1.886-2.293 2.829-3.429.471-.578 1.071-1.157 1.457-1.8a2.657 2.657 0 0 0-.557-3.342c-.686-.6-1.415-1.179-2.379-1.157-.793.021-1.5.385-2.014.985-.214.257-.407.514-.621.75-1.865 2.25-3.707 4.5-5.572 6.75l-1.864 2.25c-.043.064-.107.107-.128.171-.172.257-.129.493-.108.772.065.728.15 1.457.215 2.207.021.171.021.321.043.493.021.342.257.621.621.621 1.136 0 2.271 0 3.428-.021.879 0 .879-1.265.065-1.265Z" />
          <path d="m15.909 13.1 2.957 2.443c.15.107.278.236.428.343.258.214.643.257.879 0 .214-.236.278-.664 0-.878l-2.957-2.443c-.15-.107-.279-.236-.429-.343-.257-.214-.643-.257-.878 0-.215.214-.279.643 0 .878ZM24.03 23.193c-1.629 0-3.257 0-4.886.021-2.571 0-5.142.022-7.735.022H9.63c-.814 0-.814 1.264 0 1.264 1.629 0 3.257 0 4.886-.021 2.571 0 5.142-.022 7.735-.022h1.779c.814-.021.814-1.264 0-1.264Z" />
        </g>
        <rect width={33} height={33} x={0.5} y={0.5} stroke="#00B3C7" rx={16.5} />
        <defs>
          <clipPath id="a">
            <rect width={34} height={34} fill="#fff" rx={17} />
          </clipPath>
        </defs>
    </Icon>
);
export default EditButtonIcon;