import React from "react";
import Icon from "./Icon";

export const IconIVA = ({ fill }) => (
    <Icon
        width={15}
        fill={fill || "currentColor"}
        viewBox="0 0 200 200"
        style={{
            enableBackground: "new 0 0 200 200",
        }}
        xmlSpace="preserve">
        <path d="M188.38 115.3c-3.73-7.18-11.84-9.44-19.72-5.49-4.1 2.05-8.18 4.11-12.27 6.18-8.04 4.06-16.35 8.25-24.58 12.27-1.38.67-2.96.94-4.79 1.25-.6.1-1.2.2-1.83.33 1.72-5.36 1.16-10.34-1.61-14.1-2.93-3.98-7.99-6.18-13.53-5.87-7.74.42-15.65.34-23.29.26-4.46-.05-9.06-.09-13.59-.04-2.23.03-4.63.59-6.77 1.59-6.28 2.93-12.38 5.92-18.83 9.08-2.13 1.05-4.28 2.1-6.44 3.15-1.64-6.56-4.51-8.81-11.05-8.83h-.52c-3.32-.01-6.65-.02-9.98.01-6.46.05-10.03 3.57-10.06 9.91-.07 13.7-.07 27.7 0 41.6.03 5.94 3.53 9.43 9.61 9.58 1.2.03 2.42.04 3.62.04.91 0 1.82 0 2.72-.01.91 0 1.82-.01 2.72-.01 8.58 0 10.3-1.08 13.29-8.76h6.95c6.78.01 13.6.01 20.42-.03 2.47-.01 4.62-.19 6.57-.54 21.39-3.83 42.35-7.63 62.28-11.29 1.98-.37 3.92-1 5.6-1.84 12.88-6.43 25.72-12.94 37.76-19.06 4.16-2.12 7.13-5.36 8.34-9.13 1.07-3.37.72-6.91-1.02-10.25zm-71.25 12.15c-1.33 1.36-3.47 2.08-6.21 2.09-7.51.01-15.02.01-22.53.01h-10.4c-.24 0-.5-.03-.76-.05-.72-.07-1.46-.15-2.04.22l-.51.32c-1.41.89-3.02 1.9-3.27 3.26-.2 1.03.02 1.95.61 2.67.74.89 2.05 1.4 3.6 1.4h11.51c14.01 0 28.51.01 42.76-.06 1.46-.01 2.93-.68 4.3-1.37 5.07-2.54 10.13-5.09 15.2-7.64 7.29-3.67 14.83-7.47 22.26-11.16 2-.99 3.77-1.45 5.15-1.35 2.75.22 4.59 1.98 5.06 4.82.5 3-.71 5.2-3.71 6.71-2.84 1.43-5.75 2.84-8.57 4.2-6.48 3.13-13.19 6.37-19.45 10.12-9.13 5.47-19.39 7.29-29.3 9.05-1.05.19-2.1.37-3.14.56-3.56.65-7.12 1.31-10.68 1.97-10.25 1.9-20.84 3.87-31.31 5.46-4.53.69-9.26.7-13.84.71-1.61 0-3.22.01-4.82.04-3.71.07-7.39.06-11.29.04-1.56-.01-3.15-.01-4.77-.02l-.01-5.47c-.01-6.85-.02-13.32.09-19.83.01-.64.8-1.74 1.51-2.1 8.89-4.45 18.29-9.04 27.91-13.63 1.03-.49 2.4-.56 3.61-.57 13.53-.05 26.83-.04 36.9-.02 4.64.01 7.47 2.15 7.56 5.73.04 1.58-.44 2.88-1.42 3.89zm-99.72 23.68-.01-5.62c0-1.89.01-3.78.03-5.67.03-4.31.07-8.77-.1-13.15-.06-1.63.19-2.65.78-3.22.47-.45 1.22-.67 2.32-.67.27 0 .57.01.89.04 2.66.22 5.37.14 7.99.07l1.12-.03c1.02-.04 1.71.16 2.13.56.41.4.6 1.07.6 2.05-.04 13.99-.03 27.62 0 40.5 0 .85-.16 1.43-.5 1.76-.33.33-.9.49-1.74.48h-.16c-3.63-.04-7.39-.08-11.08.02-.87.03-1.45-.12-1.79-.46-.36-.36-.53-1-.52-2.03.06-4.88.05-9.84.04-14.63zM100.01 97.62h.02c9.93 0 19.26-3.85 26.28-10.85 7.03-7 10.9-16.32 10.9-26.22 0-20.5-16.67-37.18-37.15-37.19h-.02c-20.47 0-37.13 16.66-37.14 37.15-.01 9.93 3.84 19.26 10.84 26.26 6.99 6.99 16.32 10.85 26.27 10.85zm-29.3-36.94c-.04-7.8 2.98-15.16 8.5-20.72 5.54-5.58 12.9-8.66 20.75-8.68h.07c7.81 0 15.16 3.06 20.72 8.61 5.55 5.55 8.6 12.89 8.59 20.67-.03 16.02-13.07 29.14-29.09 29.24-7.9.04-15.26-2.98-20.86-8.52-5.56-5.51-8.64-12.83-8.68-20.6z" />
        <path d="M98.02 73.17c-2.17-.18-4.31-.62-6.57-1.09-1-.21-2.02-.42-3.06-.61l-.51-.1-1.73 6.19 9.48 2.69.29 5.01h5.84v-5.69c6.69-2.32 9.52-5.4 9.74-10.53.22-5.22-2.43-8.62-8.84-11.35l-.91-.39c-1.11-.47-2.27-.95-3.35-1.5-2.11-1.06-3.8-2.14-3.11-4.52.57-1.97 2.15-2.78 4.97-2.54 1.74.15 3.46.5 5.28.87.81.16 1.63.33 2.47.48l.52.09 1.69-6.14-8.05-2.14-.48-4.86H95.6l.29.78c1.43 3.78-.6 4.81-3.68 6.36l-.21.1c-3.15 1.59-5.14 4.56-5.33 7.93-.19 3.48 1.52 6.75 4.59 8.76 1.66 1.09 3.52 1.88 5.32 2.65 1.06.45 2.16.92 3.19 1.44 2.74 1.37 3.69 2.86 3.2 4.98-.71 3.03-3.41 3.26-4.95 3.13z" />
    </Icon>
);

export const IconDiscount = ({ fill }) => (
    <Icon
        width={15}
        fill={fill || "currentColor"}
        viewBox="0 0 200 200"
        style={{
            enableBackground: "new 0 0 200 200",
        }}
        xmlSpace="preserve">
        <path d="M140.96 172.86c-3.83-.53-8.67-1.06-13.45-1.93-3.18-.58-5.64.01-7.9 2.44-2.9 3.11-6.07 5.96-9.14 8.91-6.02 5.77-15.1 5.77-21.09 0-3.43-3.29-6.86-6.58-10.25-9.91-1.41-1.38-3.01-1.93-4.97-1.63-4.48.67-8.98 1.24-13.46 1.91-9.02 1.35-16.32-3.92-17.87-12.93-.76-4.41-1.56-8.81-2.3-13.23-.36-2.12-1.43-3.61-3.37-4.6-4.13-2.12-8.23-4.31-12.3-6.52-7.56-4.12-10.27-12.59-6.51-20.31 2.01-4.12 3.98-8.26 6.06-12.35.98-1.94 1.02-3.74.04-5.69-2.04-4.04-4-8.13-5.98-12.21-3.91-8.05-1.23-16.43 6.62-20.66 3.99-2.15 7.98-4.29 12.01-6.36 2.05-1.05 3.12-2.64 3.48-4.89.73-4.58 1.56-9.15 2.37-13.72 1.39-7.83 8.4-13.12 16.52-12.3 4.45.45 8.88 1.12 13.29 1.88 2.85.49 5.12-.03 7.19-2.21 2.96-3.13 6.15-6.04 9.26-9.02 6.27-6.02 15.15-6.02 21.45 0 3.28 3.13 6.56 6.25 9.76 9.46 1.63 1.63 3.44 2.23 5.7 1.87 4.26-.67 8.54-1.19 12.8-1.84 9.28-1.42 16.54 3.76 18.13 12.98.75 4.36 1.57 8.7 2.28 13.06.36 2.2 1.47 3.71 3.46 4.73 4.08 2.09 8.13 4.25 12.16 6.44 7.72 4.18 10.36 12.68 6.47 20.58-2 4.06-3.94 8.16-5.98 12.21-.98 1.95-.94 3.76.04 5.69 2.07 4.09 4.05 8.23 6.06 12.35 3.76 7.72 1.06 16.19-6.51 20.31-4.03 2.19-8.07 4.36-12.16 6.44-2.12 1.08-3.2 2.7-3.57 5.02-.72 4.58-1.55 9.15-2.37 13.72-1.33 7.19-7.6 12.34-15.97 12.31zm.62-9.99c2.91.08 4.98-1.56 5.5-4.3.88-4.67 1.7-9.35 2.49-14.03.88-5.16 3.64-8.91 8.25-11.35 4.01-2.12 8-4.26 12-6.38 3.36-1.78 4.2-4.29 2.55-7.71-2.02-4.18-4.08-8.33-6.1-12.51-2.16-4.46-2.2-8.95-.05-13.42 2.03-4.23 4.12-8.44 6.17-12.66 1.64-3.4.78-5.92-2.59-7.7-4.05-2.15-8.11-4.29-12.15-6.46-4.48-2.4-7.17-6.1-8.05-11.12-.78-4.46-1.55-8.93-2.36-13.38-.72-3.99-2.91-5.51-6.94-4.92-4.43.65-8.86 1.25-13.29 1.88-5.18.75-9.59-.79-13.31-4.43-3.24-3.17-6.49-6.33-9.77-9.45-2.69-2.56-5.33-2.54-8.02.03-3.52 3.36-6.96 6.8-10.52 10.11-3.3 3.07-7.27 4.37-11.75 3.82-4.72-.58-9.42-1.28-14.12-1.96-3.94-.57-6.17.94-6.87 4.8-.8 4.4-1.59 8.81-2.32 13.22-.89 5.36-3.77 9.19-8.57 11.67-3.93 2.03-7.81 4.14-11.72 6.21-3.35 1.78-4.19 4.31-2.54 7.72 2.02 4.18 4.08 8.34 6.1 12.51 2.19 4.52 2.17 9.06-.02 13.58-2 4.12-4.03 8.24-6.03 12.36-1.72 3.55-.91 6.02 2.53 7.84 4.15 2.2 8.32 4.36 12.44 6.62 4.27 2.35 6.87 5.97 7.72 10.8.8 4.57 1.59 9.14 2.43 13.71.69 3.79 2.9 5.33 6.74 4.78 4.38-.63 8.76-1.21 13.13-1.88 5.43-.83 10.01.77 13.89 4.62 3.09 3.08 6.25 6.1 9.4 9.12 2.84 2.71 5.39 2.71 8.26-.03 3.44-3.28 6.8-6.64 10.27-9.89 3.43-3.2 7.54-4.52 12.2-3.9 5.08.66 10.17 1.4 15.02 2.08z" />
        <path d="M138.37 67c-.79 1.26-1.39 2.72-2.41 3.76-9.44 9.55-18.95 19.02-28.44 28.52-12.18 12.19-24.38 24.36-36.55 36.56-1.32 1.33-2.78 2.2-4.7 1.94-1.97-.27-3.38-1.36-4.05-3.23-.72-2.01-.25-3.82 1.25-5.33 4.99-5.01 10-10.01 15-15.01 16.87-16.87 33.74-33.73 50.6-50.61 1.53-1.53 3.28-2.24 5.4-1.57 1.98.62 3.09 2.04 3.44 4.07.04.22.06.44.09.66.12.08.24.16.37.24zM96.93 73.09c0 10.11-8.29 18.42-18.33 18.38-10.14-.04-18.36-8.25-18.38-18.34-.02-10.14 8.32-18.43 18.51-18.37 9.99.05 18.2 8.31 18.2 18.33zm-26.7-.1c-.13 4.51 3.58 8.36 8.18 8.49 4.5.13 8.4-3.6 8.53-8.16.12-4.54-3.51-8.38-8.11-8.57-4.56-.2-8.47 3.54-8.6 8.24zM102.93 126.51c.04-10.33 8.38-18.46 18.84-18.36 9.77.09 17.92 8.53 17.87 18.5-.04 9.97-8.38 18.24-18.35 18.21-10.12-.02-18.4-8.3-18.36-18.35zm26.7 0c.06-4.51-3.72-8.32-8.3-8.38-4.5-.05-8.36 3.74-8.42 8.28-.05 4.53 3.65 8.34 8.23 8.46 4.57.12 8.43-3.67 8.49-8.36z" />
    </Icon>
);

export const IconCategory = ({ fill }) => (
    <Icon
        width={15}
        fill={fill || "currentColor"}
        viewBox="0 0 200 200"
        style={{
            enableBackground: "new 0 0 200 200",
        }}
        xmlSpace="preserve">
        <path d="M52.83 17.03c6.6 0 13.21-.07 19.81.01 9.4.11 15.74 6.31 15.82 15.67.12 13.21.12 26.42 0 39.63-.08 8.91-5.87 15.32-14.79 15.55-13.95.36-27.92.37-41.86-.01-8.89-.24-14.64-6.73-14.7-15.64-.1-13.21-.11-26.42 0-39.63.08-9.19 6.35-15.41 15.53-15.56 6.73-.1 13.46-.02 20.19-.02zm-.18 10.53c-6.44 0-12.87-.04-19.31.01-4.78.04-5.69.87-5.71 5.45-.05 13.01-.05 26.01 0 39.02.02 4.3 1.14 5.4 5.38 5.41 13.14.04 26.27.04 39.41 0 4.37-.01 5.51-1.06 5.52-5.28.06-13.13-.01-26.27.05-39.4.02-3.66-1.62-5.26-5.25-5.22-6.69.07-13.39.01-20.09.01zM52.83 111.51c6.6 0 13.21-.07 19.81.01 9.4.11 15.74 6.31 15.82 15.67.12 13.21.12 26.42 0 39.63-.08 8.91-5.87 15.32-14.79 15.55-13.95.36-27.92.37-41.86-.01-8.89-.24-14.64-6.73-14.7-15.64-.1-13.21-.11-26.42 0-39.63.08-9.19 6.35-15.41 15.53-15.56 6.73-.11 13.46-.02 20.19-.02zm-.18 10.53c-6.44 0-12.87-.04-19.31.01-4.78.04-5.69.87-5.71 5.45-.05 13.01-.05 26.01 0 39.02.02 4.3 1.14 5.4 5.38 5.41 13.14.04 26.27.04 39.41 0 4.37-.01 5.51-1.06 5.52-5.28.05-13.14-.02-26.27.04-39.41.02-3.66-1.62-5.26-5.25-5.22-6.68.08-13.38.02-20.08.02zM146.98 111.51c6.6 0 13.21-.07 19.81.01 9.4.11 15.74 6.31 15.82 15.67.12 13.21.12 26.42 0 39.63-.08 8.91-5.87 15.32-14.79 15.55-13.95.36-27.92.37-41.86-.01-8.89-.24-14.64-6.73-14.7-15.64-.1-13.21-.11-26.42 0-39.63.08-9.19 6.35-15.41 15.53-15.56 6.73-.11 13.46-.02 20.19-.02zm-.17 10.53c-6.44 0-12.87-.04-19.31.01-4.78.04-5.69.87-5.71 5.45-.05 13.01-.05 26.01 0 39.02.02 4.3 1.14 5.4 5.38 5.41 13.14.04 26.27.04 39.41 0 4.37-.01 5.51-1.06 5.52-5.28.05-13.14-.02-26.27.04-39.41.02-3.66-1.62-5.26-5.25-5.22-6.68.08-13.38.02-20.08.02zM182.68 52.79c-.26 19.71-16.5 35.61-35.97 35.23-19.63-.39-35.13-16.3-34.94-35.86.2-19.94 16.22-35.4 36.35-35.08 19.33.3 34.81 16.29 34.56 35.71zM146.9 26.9c-14.43.38-25.79 12.14-25.36 26.24.43 14.03 12.29 25.36 26.22 25.06 14.04-.31 25.47-12.2 25.11-26.12-.37-14.24-12.04-25.55-25.97-25.18z" />
    </Icon>
);

export const IconStatus = ({ fill }) => (
    <Icon width={8} height={8} fill="none">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
            fill="#727C94"
            fillOpacity={0.75}
        />
    </Icon>
);