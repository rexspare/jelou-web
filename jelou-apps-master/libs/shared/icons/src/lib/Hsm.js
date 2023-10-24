import { useTranslation } from "react-i18next";

import Icon from "./Icon";

const Hsm = (props) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col">
            <Icon viewBox="0 0 100 100" className={props.className} width={props.width} height={props.height} fill={props.fill}>
                <path
                    d="M17.71,34.63C38.53,28.09,59.36,21.54,80.18,15c2.53-0.8,6.5-2.83,9.04-2.67c-0.61-0.25-1.22-0.5-1.83-0.76
                c0.17,0.17,0.35,0.35,0.52,0.52c-0.25-0.61-0.5-1.22-0.76-1.83c0.13,2.11-1.53,5.39-2.2,7.52c-1.86,5.93-3.73,11.85-5.59,17.78
                c-4.12,13.1-8.24,26.2-12.36,39.3c-0.61,1.94-1.22,3.89-1.83,5.83c-0.17,0.55-0.91,1.93-0.79,2.51c0.19,0.93,2.78,0.9,2.88-0.03
                c0.02-0.14-0.14-0.3-0.16-0.44c-0.06-0.78-0.6-1.72-0.86-2.46c-0.93-2.66-1.86-5.31-2.78-7.97c-2.34-6.71-4.69-13.41-7.03-20.12
                c-1-2.85-1.58-7.41-4.69-8.55c-6.12-2.26-12.32-4.32-18.48-6.48c-3.61-1.27-7.22-2.53-10.83-3.8c-1.12-0.39-2.24-0.78-3.36-1.18
                c-0.27-0.09-0.7-0.34-0.99-0.35c-0.08,0-0.2-0.11-0.29-0.1c-0.04-0.01-0.07-0.02-0.11-0.04c-0.89-0.32-0.69,0.56,0.6,2.66
                c2.81-1.76,0.22-6.23-2.61-4.46c-2.49,1.56-2.73,4.96-0.03,6.51c0.69,0.39,1.56,0.59,2.3,0.85c3.88,1.36,7.76,2.72,11.65,4.08
                c7.12,2.5,14.24,4.99,21.36,7.49c-0.6-0.6-1.2-1.2-1.8-1.8c2.19,6.27,4.38,12.54,6.57,18.81c2.17,6.2,3.93,12.78,6.57,18.8
                c1.62,3.68,5.83,3.14,7.15-0.41c0.64-1.72,1.11-3.53,1.66-5.28c2.4-7.64,4.81-15.29,7.21-22.93c4.55-14.48,9.73-28.9,13.7-43.56
                c0.81-3-0.85-5.86-4.32-5.25C86.38,7.46,85,8.08,83.7,8.49c-7.37,2.31-14.73,4.63-22.1,6.94c-15.09,4.74-30.18,9.48-45.27,14.22
                C13.17,30.64,14.52,35.63,17.71,34.63z"
                />

                <path
                    d="M70.45,25.4c-6.02,5.59-12.03,11.18-18.05,16.76c-0.85,0.79-1.69,1.57-2.54,2.36
                c-2.44,2.27,1.22,5.91,3.65,3.65C59.52,42.59,65.54,37,71.56,31.41c0.85-0.79,1.69-1.57,2.54-2.36
                C76.54,26.78,72.88,23.14,70.45,25.4L70.45,25.4z"
                />
                <path
                    d="M24.49,44.52c-4.67,4.67-9.34,9.34-14.01,14.01c-0.66,0.66-1.33,1.33-1.99,1.99c-0.96,0.96-1.03,2.71,0,3.65
                c1.03,0.95,2.63,1.02,3.65,0c4.67-4.67,9.34-9.34,14.01-14.01c0.66-0.66,1.33-1.33,1.99-1.99c0.96-0.96,1.03-2.71,0-3.65
                C27.11,43.58,25.51,43.5,24.49,44.52L24.49,44.52z"
                />
                <path
                    d="M51.46,72.47c-4.67,4.67-9.34,9.34-14.01,14.01c-0.66,0.66-1.33,1.33-1.99,1.99c-0.96,0.96-1.03,2.71,0,3.65
                c1.03,0.95,2.63,1.02,3.65,0c4.67-4.67,9.34-9.34,14.01-14.01c0.66-0.66,1.33-1.33,1.99-1.99c0.96-0.96,1.03-2.71,0-3.65
                C54.08,71.52,52.48,71.45,51.46,72.47L51.46,72.47z"
                />
                <path
                    d="M38.22,58.25c-8.4,8.36-16.8,16.72-25.19,25.08c-1.21,1.2-2.41,2.4-3.62,3.6c-2.36,2.35,1.29,6,3.65,3.65
                c8.4-8.36,16.8-16.72,25.19-25.08c1.21-1.2,2.41-2.4,3.62-3.6C44.23,59.56,40.58,55.9,38.22,58.25L38.22,58.25z"
                />
            </Icon>
            <p className="mt-1 text-center text-[0.6rem] leading-3">{t("sideBar.hsm")}</p>
        </div>
    );
};
export default Hsm;