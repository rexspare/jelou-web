import React from "react";
import Icon from "./Icon";

const ViewEdit = (props) => (
    <Icon viewBox="0 0 26 16" fill="none" className={props.className} width={props.width} height={props.height}>
        <path d="M18.1332 12.8648C16.6148 13.2742 15.0975 13.6837 13.5792 14.094C13.7793 14.2831 13.9795 14.4721 14.1796 14.6612C14.5038 13.5905 14.827 12.5199 15.1512 11.4492C15.2293 11.1901 15.3084 10.93 15.3865 10.6709C15.409 10.5971 15.4431 10.5187 15.4558 10.4431C15.49 10.2347 15.5173 10.587 15.3582 10.5612C15.4216 10.5713 15.7546 10.1868 15.7995 10.1443C17.7514 8.3009 19.7023 6.45838 21.6541 4.61494C22.4089 3.9021 23.1636 3.18925 23.9184 2.47641C24.2201 2.19146 24.5238 1.93325 24.9964 1.95999C25.6613 1.9978 26.1847 2.69497 26.6153 3.10995C27.5204 3.98417 26.7022 4.68687 26.0431 5.30934C25.1292 6.1725 24.2152 7.03566 23.3013 7.89882C21.5067 9.59379 19.712 11.2888 17.9174 12.9837C17.4721 13.4042 18.1624 14.0562 18.6077 13.6357C20.2432 12.0911 21.8797 10.5455 23.5151 9.00083C24.5335 8.039 25.5529 7.07624 26.5713 6.11441C27.33 5.39787 28.1853 4.72468 27.9647 3.57288C27.8163 2.79733 27.1259 2.29013 26.5674 1.76172C25.8722 1.10513 24.9134 0.815564 23.9877 1.24899C23.2808 1.58005 22.6832 2.33808 22.1394 2.85266C19.9952 4.87776 17.85 6.90379 15.7058 8.9289C15.2908 9.32083 14.6659 9.72935 14.4911 10.2771C14.0908 11.5313 13.7285 12.7965 13.3477 14.0553C13.3116 14.1752 13.2755 14.296 13.2384 14.4159C13.1368 14.7525 13.4825 15.0789 13.8389 14.983C15.3572 14.5736 16.8746 14.1641 18.3929 13.7537C18.9953 13.5914 18.7395 12.7015 18.1332 12.8648Z" />
        <path d="M26.089 5.91798C25.0052 4.89436 23.9204 3.86982 22.8365 2.8462C22.3913 2.42569 21.701 3.07767 22.1462 3.49818C23.23 4.5218 24.3148 5.54634 25.3987 6.56996C25.8439 6.99048 26.5342 6.3385 26.089 5.91798Z" />
        <path d="M11.4603 10.6331C13.419 10.6331 15.0067 9.13362 15.0067 7.28465C15.0067 5.43568 13.419 3.93622 11.4603 3.93622C9.50262 3.93622 7.91497 5.43568 7.91497 7.28465C7.91497 9.13362 9.50262 10.6331 11.4603 10.6331ZM11.4603 4.93955C12.8302 4.93955 13.9443 5.99176 13.9443 7.28465C13.9443 8.57755 12.8302 9.62976 11.4603 9.62976C10.0924 9.62976 8.97731 8.57755 8.97731 7.28465C8.97731 5.99176 10.0924 4.93955 11.4603 4.93955Z" />
        <path d="M13.8574 13.2143C14.0166 12.8389 14.1552 12.4553 14.3056 12.0754C13.4034 12.435 12.4465 12.6582 11.4603 12.6582C7.41407 12.6582 3.83746 8.87726 2.53395 7.31693C3.83746 5.75568 7.41309 1.97474 11.4603 1.97474C14.66 1.97474 17.5649 4.33829 19.2853 6.09965C19.5392 5.79533 19.7794 5.42093 20.1094 5.20606C18.3802 3.50464 15.2 1 11.4613 1C5.92015 1 1.6044 6.50264 1.42376 6.73688L1 7.28465L1.42376 7.83243C1.6044 8.06666 5.92015 13.5693 11.4613 13.5693C12.2883 13.5693 13.088 13.4457 13.8506 13.2364C13.8525 13.229 13.8545 13.2216 13.8574 13.2143Z" />
        <path
            d="M18.1332 12.8648C16.6148 13.2742 15.0975 13.6837 13.5792 14.094C13.7793 14.2831 13.9795 14.4721 14.1796 14.6612C14.5038 13.5905 14.827 12.5199 15.1512 11.4492C15.2293 11.1901 15.3084 10.93 15.3865 10.6709C15.409 10.5971 15.4431 10.5187 15.4558 10.4431C15.49 10.2347 15.5173 10.587 15.3582 10.5612C15.4216 10.5713 15.7546 10.1868 15.7995 10.1443C17.7514 8.3009 19.7023 6.45838 21.6541 4.61494C22.4089 3.9021 23.1636 3.18925 23.9184 2.47641C24.2201 2.19146 24.5238 1.93325 24.9964 1.95999C25.6613 1.9978 26.1847 2.69497 26.6153 3.10995C27.5204 3.98417 26.7022 4.68687 26.0431 5.30934C25.1292 6.1725 24.2152 7.03566 23.3013 7.89882C21.5067 9.59379 19.712 11.2888 17.9174 12.9837C17.4721 13.4042 18.1624 14.0562 18.6077 13.6357C20.2432 12.0911 21.8797 10.5455 23.5151 9.00083C24.5335 8.039 25.5529 7.07624 26.5713 6.11441C27.33 5.39787 28.1853 4.72468 27.9647 3.57288C27.8163 2.79733 27.1259 2.29013 26.5674 1.76172C25.8722 1.10513 24.9134 0.815564 23.9877 1.24899C23.2808 1.58005 22.6832 2.33808 22.1394 2.85266C19.9952 4.87776 17.85 6.90379 15.7058 8.9289C15.2908 9.32083 14.6659 9.72935 14.4911 10.2771C14.0908 11.5313 13.7285 12.7965 13.3477 14.0553C13.3116 14.1752 13.2755 14.296 13.2384 14.4159C13.1368 14.7525 13.4825 15.0789 13.8389 14.983C15.3572 14.5736 16.8746 14.1641 18.3929 13.7537C18.9953 13.5914 18.7395 12.7015 18.1332 12.8648Z"
            fill={props.fill}
        />
        <path
            d="M26.089 5.91798C25.0052 4.89436 23.9204 3.86982 22.8365 2.8462C22.3913 2.42569 21.701 3.07767 22.1462 3.49818C23.23 4.5218 24.3148 5.54634 25.3987 6.56996C25.8439 6.99048 26.5342 6.3385 26.089 5.91798Z"
            fill={props.fill}
        />
        <path
            d="M11.4603 10.6331C13.419 10.6331 15.0067 9.13362 15.0067 7.28465C15.0067 5.43568 13.419 3.93622 11.4603 3.93622C9.50262 3.93622 7.91497 5.43568 7.91497 7.28465C7.91497 9.13362 9.50262 10.6331 11.4603 10.6331ZM11.4603 4.93955C12.8302 4.93955 13.9443 5.99176 13.9443 7.28465C13.9443 8.57755 12.8302 9.62976 11.4603 9.62976C10.0924 9.62976 8.97731 8.57755 8.97731 7.28465C8.97731 5.99176 10.0924 4.93955 11.4603 4.93955Z"
            fill={props.fill}
        />
        <path
            d="M13.8574 13.2143C14.0166 12.8389 14.1552 12.4553 14.3056 12.0754C13.4034 12.435 12.4465 12.6582 11.4603 12.6582C7.41407 12.6582 3.83746 8.87726 2.53395 7.31693C3.83746 5.75568 7.41309 1.97474 11.4603 1.97474C14.66 1.97474 17.5649 4.33829 19.2853 6.09965C19.5392 5.79533 19.7794 5.42093 20.1094 5.20606C18.3802 3.50464 15.2 1 11.4613 1C5.92015 1 1.6044 6.50264 1.42376 6.73688L1 7.28465L1.42376 7.83243C1.6044 8.06666 5.92015 13.5693 11.4613 13.5693C12.2883 13.5693 13.088 13.4457 13.8506 13.2364C13.8525 13.229 13.8545 13.2216 13.8574 13.2143Z"
            fill={props.fill}
        />
        <path
            d="M18.1332 12.8648C16.6148 13.2742 15.0975 13.6837 13.5792 14.094C13.7793 14.2831 13.9795 14.4721 14.1796 14.6612C14.5038 13.5905 14.827 12.5199 15.1512 11.4492C15.2293 11.1901 15.3084 10.93 15.3865 10.6709C15.409 10.5971 15.4431 10.5187 15.4558 10.4431C15.49 10.2347 15.5173 10.587 15.3582 10.5612C15.4216 10.5713 15.7546 10.1868 15.7995 10.1443C17.7514 8.3009 19.7023 6.45838 21.6541 4.61494C22.4089 3.9021 23.1636 3.18925 23.9184 2.47641C24.2201 2.19146 24.5238 1.93325 24.9964 1.95999C25.6613 1.9978 26.1847 2.69497 26.6153 3.10995C27.5204 3.98417 26.7022 4.68687 26.0431 5.30934C25.1292 6.1725 24.2152 7.03566 23.3013 7.89882C21.5067 9.59379 19.712 11.2888 17.9174 12.9837C17.4721 13.4042 18.1624 14.0562 18.6077 13.6357C20.2432 12.0911 21.8797 10.5455 23.5151 9.00083C24.5335 8.039 25.5529 7.07624 26.5713 6.11441C27.33 5.39787 28.1853 4.72468 27.9647 3.57288C27.8163 2.79733 27.1259 2.29013 26.5674 1.76172C25.8722 1.10513 24.9134 0.815564 23.9877 1.24899C23.2808 1.58005 22.6832 2.33808 22.1394 2.85266C19.9952 4.87776 17.85 6.90379 15.7058 8.9289C15.2908 9.32083 14.6659 9.72935 14.4911 10.2771C14.0908 11.5313 13.7285 12.7965 13.3477 14.0553C13.3116 14.1752 13.2755 14.296 13.2384 14.4159C13.1368 14.7525 13.4825 15.0789 13.8389 14.983C15.3572 14.5736 16.8746 14.1641 18.3929 13.7537C18.9953 13.5914 18.7395 12.7015 18.1332 12.8648Z"
            stroke={props.fill}
            strokeWidth="0.2"
        />
        <path
            d="M26.089 5.91798C25.0052 4.89436 23.9204 3.86982 22.8365 2.8462C22.3913 2.42569 21.701 3.07767 22.1462 3.49818C23.23 4.5218 24.3148 5.54634 25.3987 6.56996C25.8439 6.99048 26.5342 6.3385 26.089 5.91798Z"
            stroke={props.fill}
            strokeWidth="0.2"
        />
        <path
            d="M11.4603 10.6331C13.419 10.6331 15.0067 9.13362 15.0067 7.28465C15.0067 5.43568 13.419 3.93622 11.4603 3.93622C9.50262 3.93622 7.91497 5.43568 7.91497 7.28465C7.91497 9.13362 9.50262 10.6331 11.4603 10.6331ZM11.4603 4.93955C12.8302 4.93955 13.9443 5.99176 13.9443 7.28465C13.9443 8.57755 12.8302 9.62976 11.4603 9.62976C10.0924 9.62976 8.97731 8.57755 8.97731 7.28465C8.97731 5.99176 10.0924 4.93955 11.4603 4.93955Z"
            stroke={props.fill}
            strokeWidth="0.2"
        />
        <path
            d="M13.8574 13.2143C14.0166 12.8389 14.1552 12.4553 14.3056 12.0754C13.4034 12.435 12.4465 12.6582 11.4603 12.6582C7.41407 12.6582 3.83746 8.87726 2.53395 7.31693C3.83746 5.75568 7.41309 1.97474 11.4603 1.97474C14.66 1.97474 17.5649 4.33829 19.2853 6.09965C19.5392 5.79533 19.7794 5.42093 20.1094 5.20606C18.3802 3.50464 15.2 1 11.4613 1C5.92015 1 1.6044 6.50264 1.42376 6.73688L1 7.28465L1.42376 7.83243C1.6044 8.06666 5.92015 13.5693 11.4613 13.5693C12.2883 13.5693 13.088 13.4457 13.8506 13.2364C13.8525 13.229 13.8545 13.2216 13.8574 13.2143Z"
            stroke={props.fill}
            strokeWidth="0.2"
        />
    </Icon>
);

export default ViewEdit;
