import Icon from "./Icon";

const BackArrowIcon = (props) => (
    <Icon viewBox="0 0 10 14" className={props.className} width={props.width} height={props.height} fill={props.fill}>
        <path
            d="M7.79853 0.353219C5.31816 2.28293 2.85501 4.19615 0.374641 6.12586C-0.124879 6.5217 -0.124879 7.4783 0.374641 7.87414C2.85501 9.80385 5.31816 11.7171 7.79853 13.6468C8.3325 14.0756 9.09039 14.1581 9.62436 13.6468C10.0722 13.218 10.1756 12.3273 9.62436 11.8985C7.14399 9.96879 4.68084 8.05557 2.20047 6.12586C2.20047 6.70312 2.20047 7.29688 2.20047 7.87414C4.68084 5.94443 7.14399 4.01472 9.62436 2.1015C10.1583 1.67268 10.0894 0.782043 9.62436 0.353219C9.09039 -0.158072 8.3325 -0.0756058 7.79853 0.353219Z"
            fill={props.fill}
        />
    </Icon>
);
export default BackArrowIcon;
