import React from "react";
import Icon from "./Icon";

const ScheduleIconTab = (props) => (
    <Icon viewBox="0 0 20 18" className={props.className} width={props.width} height={props.height}>
        <path
            d="M0.850092 11.7456C1.75316 10.8426 2.65624 9.9395 3.55931 9.03643C3.68688 8.90885 3.8165 8.77923 3.94408 8.65166C4.12968 8.46606 4.14325 8.12759 3.94408 7.9459C3.74491 7.76421 3.43545 7.74858 3.23832 7.9459C2.33525 8.84897 1.43218 9.75204 0.529107 10.6551C0.401532 10.7827 0.27191 10.9123 0.144335 11.0399C-0.0412638 11.2255 -0.0548396 11.564 0.144335 11.7456C0.343509 11.9294 0.652778 11.943 0.850092 11.7456Z"
            fill="#00B3C7"
        />
        <path
            d="M9.15943 13.3508C8.96026 13.167 8.6508 13.1535 8.45349 13.3508C7.55042 14.2538 6.64734 15.1569 5.74427 16.06C5.6167 16.1876 5.48707 16.3172 5.3595 16.4448C5.1739 16.6304 5.16032 16.9688 5.3595 17.1507C5.55867 17.3344 5.86813 17.348 6.06526 17.1507C6.96833 16.2476 7.8714 15.3446 8.77447 14.4415C8.90205 14.3139 9.03167 14.1843 9.15924 14.0565C9.34503 13.8709 9.35861 13.5326 9.15943 13.3508Z"
            fill="#00B3C7"
        />
        <path
            d="M6.59918 11.3068C7.05555 10.8543 6.34979 10.1465 5.89342 10.6009C4.26916 12.2175 2.6447 13.8341 1.0223 15.4508C0.788349 15.6829 0.556258 15.9148 0.322307 16.1469C-0.134064 16.6014 0.571694 17.3071 1.02806 16.8526C2.65233 15.236 4.27678 13.6195 5.89919 12.0029C6.13314 11.771 6.36504 11.5389 6.59918 11.3068Z"
            fill="#00B3C7"
        />
        <path d="M18.9872 10.3855C18.9831 10.3524 18.9686 10.276 18.9872 10.3855V10.3855Z" fill="#00B3C7" />
        <path
            d="M14.2457 7.64819C14.2429 7.64931 14.2401 7.65042 14.2374 7.65154C14.2215 7.65861 14.2057 7.66512 14.1901 7.67237C14.1896 7.67256 14.189 7.67293 14.1884 7.67311C14.1752 7.68037 14.1791 7.68111 14.2457 7.64819Z"
            fill="#00B3C7"
        />
        <path d="M18.9872 11.2689C18.9686 11.3784 18.9833 11.302 18.9872 11.2689V11.2689Z" fill="#00B3C7" />
        <path
            d="M19.1505 8.32159C18.6196 7.58013 17.8941 7.02389 17.0371 6.71035C16.3275 6.45073 15.5626 6.39699 14.8299 6.52549C15.3502 4.93898 15.8601 3.34838 16.2949 1.74252C16.4515 1.16248 16.1305 0.609404 15.4595 0.727309C15.2063 0.779567 14.9394 0.899332 14.688 0.978741C13.2627 1.42544 11.8394 1.874 10.4144 2.3207C7.532 3.22619 4.64947 4.1315 1.76711 5.03699C1.69198 5.0407 1.61294 5.06488 1.53279 5.11509C1.05131 5.41674 1.00482 6.07414 1.52702 6.37393C1.66036 6.44943 1.82867 6.48811 1.97186 6.53832C2.72207 6.80129 3.47246 7.06425 4.22471 7.32721C5.51553 7.78042 6.80635 8.23214 8.09717 8.68517C8.49068 9.81177 8.8842 10.9384 9.27771 12.065C9.69744 13.2639 10.0378 14.5364 10.5483 15.7003C10.8616 16.4119 11.6756 16.3075 11.9308 15.6211C12.0546 15.2884 12.1454 14.9384 12.2517 14.6001C12.3245 14.3686 12.3974 14.1371 12.4703 13.9054C12.8372 14.2762 13.2696 14.5832 13.7436 14.7952C14.6007 15.1789 15.5382 15.2893 16.4608 15.106C18.1924 14.7619 19.6156 13.2903 19.881 11.5417C19.9171 11.3044 19.9412 11.0673 19.942 10.8272C19.9388 9.93935 19.6688 9.04539 19.1505 8.32159ZM11.7374 12.9262C11.6444 13.2217 11.5514 13.5172 11.4586 13.8129C11.3777 14.0701 11.2968 14.3281 11.2161 14.5856C11.0682 14.1629 10.9204 13.741 10.7742 13.3179C10.3217 12.0204 9.86723 10.7247 9.41477 9.42719C9.31286 9.13689 9.23345 8.7549 9.09323 8.42611C10.1746 7.42206 11.2575 6.41651 12.3405 5.41079C12.5049 5.2581 12.6672 5.10728 12.8316 4.95441C13.3034 4.51552 12.5956 3.81163 12.1258 4.24866C10.9617 5.3297 9.79954 6.41056 8.63537 7.48956C8.54982 7.56916 8.46483 7.64819 8.37966 7.72705C7.2378 7.30843 6.08237 6.92328 4.93419 6.52066C4.23605 6.27499 3.53811 6.03137 2.83997 5.78589C2.82026 5.77901 2.80055 5.77213 2.78065 5.76525C6.52256 4.58973 10.2656 3.41291 14.0073 2.23757C14.3586 2.12655 14.8537 1.89279 15.2866 1.7812C15.1897 2.12227 15.0168 2.49868 14.9297 2.77503C14.5701 3.92172 14.2083 5.06655 13.8487 6.21325C13.7748 6.44794 13.701 6.68264 13.6272 6.91733C13.0936 7.17955 12.6122 7.54963 12.2281 8.01549C11.6379 8.73129 11.2864 9.59028 11.2133 10.5159C11.148 11.344 11.3375 12.1974 11.7374 12.9262ZM18.9997 11.1385C18.9963 11.1811 18.9922 11.2237 18.9874 11.2662C18.9874 11.267 18.9872 11.2679 18.987 11.2689C18.9883 11.2614 18.9896 11.2532 18.9913 11.2441C18.9855 11.2774 18.9816 11.3113 18.9761 11.3447C18.9446 11.5346 18.8993 11.7221 18.8401 11.9051C18.8111 11.9945 18.7782 12.0825 18.7436 12.1699C18.7378 12.1827 18.7321 12.1957 18.7263 12.2086C18.7025 12.2606 18.6778 12.3123 18.6517 12.3633C18.5649 12.5336 18.4654 12.6977 18.3545 12.8535C18.3287 12.8898 18.3008 12.9247 18.2751 12.9612C18.3674 12.8303 18.2666 12.9703 18.2417 13.0001C18.1794 13.0746 18.1143 13.1468 18.0468 13.2165C17.9848 13.2805 17.9207 13.3422 17.8545 13.4017C17.8184 13.4343 17.7816 13.4661 17.7444 13.4971C17.7258 13.5128 17.707 13.5282 17.688 13.5433C17.6869 13.5442 17.6858 13.5449 17.6847 13.5459C17.5327 13.6549 17.3801 13.7596 17.2159 13.8497C17.137 13.8931 17.0568 13.9336 16.9752 13.9714C16.9547 13.9809 16.9339 13.99 16.9135 13.9993C16.8647 14.0186 16.8162 14.0378 16.7669 14.0554C16.5865 14.1201 16.4015 14.1715 16.2135 14.2087C16.1638 14.2185 16.114 14.2275 16.0639 14.2353C16.0535 14.2369 16.0429 14.2384 16.0325 14.2399C15.9226 14.2514 15.8127 14.2611 15.7022 14.2648C15.5042 14.2713 15.3076 14.2606 15.1109 14.2399C15.0921 14.2371 15.0733 14.2343 15.0545 14.2312C15.0128 14.2243 14.9714 14.2167 14.9301 14.2085C14.8235 14.1873 14.7177 14.1616 14.6132 14.1315C14.5256 14.1062 14.4389 14.0779 14.3534 14.0467C14.3175 14.0337 14.2822 14.0195 14.2466 14.0056C14.2504 14.0075 14.2539 14.0091 14.258 14.0112C14.252 14.0082 14.2457 14.0056 14.2396 14.0028C14.2353 14.0011 14.2308 13.9995 14.2266 13.9976C14.2154 13.9931 14.2016 13.9864 14.1931 13.982C14.1847 13.9784 14.1764 13.9749 14.1682 13.971C13.9906 13.8888 13.8191 13.7932 13.6558 13.6852C13.5812 13.6359 13.5106 13.5814 13.4377 13.5301C13.5686 13.6223 13.4286 13.5215 13.3988 13.4966C13.3614 13.4655 13.3248 13.4335 13.2887 13.4012C13.1444 13.2712 13.0096 13.1306 12.8859 12.9807C12.8617 12.9515 12.7784 12.8336 12.8679 12.9606C12.8398 12.9208 12.8095 12.8827 12.7814 12.8429C12.725 12.7633 12.6719 12.6815 12.6216 12.5978C12.5755 12.5208 12.532 12.4423 12.4913 12.3624C12.469 12.3187 12.4476 12.2744 12.4269 12.2299C12.4167 12.208 12.407 12.1859 12.397 12.1637C12.3964 12.1624 12.3961 12.1615 12.3955 12.1602C12.3243 11.9833 12.2663 11.8011 12.2218 11.6157C12.2002 11.5257 12.182 11.4349 12.1669 11.3438C12.1638 11.3248 12.161 11.3059 12.1582 11.2871C12.1521 11.2289 12.1457 11.1707 12.1415 11.1121C12.1271 10.9135 12.1277 10.7137 12.1433 10.5151C12.1472 10.4651 12.1528 10.4152 12.158 10.3654C12.1602 10.3507 12.1625 10.3362 12.1647 10.3215C12.1814 10.2177 12.2025 10.1147 12.2276 10.0126C12.272 9.83204 12.331 9.65649 12.3992 9.48372C12.4083 9.46345 12.4174 9.44299 12.4267 9.42272C12.4457 9.38181 12.4652 9.34146 12.4855 9.30129C12.5314 9.21035 12.5811 9.12108 12.6341 9.03405C12.6806 8.95761 12.7297 8.88285 12.7812 8.80995C12.8093 8.77015 12.8396 8.73203 12.8677 8.69223C12.7766 8.82148 12.877 8.68238 12.9012 8.65336C13.0258 8.50422 13.1613 8.36437 13.3064 8.2353C13.3367 8.20834 13.3674 8.18193 13.3984 8.15608C13.4282 8.13116 13.568 8.03036 13.4373 8.12261C13.5169 8.06644 13.5941 8.0073 13.6759 7.95412C13.8394 7.84756 14.0108 7.75327 14.1886 7.67219C14.1951 7.66847 14.2057 7.66326 14.2148 7.65973C14.2225 7.65675 14.2299 7.65377 14.2375 7.6508C14.2442 7.64782 14.2511 7.64485 14.2578 7.64169C14.2535 7.64392 14.2498 7.64559 14.2459 7.64764C14.2814 7.6335 14.3171 7.61956 14.3532 7.60635C14.4466 7.57213 14.5412 7.54163 14.637 7.51467C14.7337 7.48752 14.8313 7.46408 14.9299 7.44456C14.9712 7.43637 15.0127 7.42875 15.0543 7.42187C15.0744 7.41852 15.0945 7.41555 15.1148 7.41257C15.1198 7.41201 15.1257 7.41145 15.1326 7.41052C15.3303 7.38839 15.5295 7.38133 15.7281 7.38914C15.8281 7.39304 15.9276 7.40234 16.0271 7.41257C16.0394 7.41424 16.0517 7.41592 16.0639 7.41778C16.1223 7.42708 16.1804 7.43749 16.2382 7.44939C16.4257 7.48789 16.6103 7.54033 16.7902 7.60617C16.8315 7.62123 16.8722 7.63741 16.9129 7.65359C16.9337 7.66307 16.9546 7.67218 16.9752 7.68167C17.0643 7.72277 17.1517 7.7674 17.2372 7.8152C17.4014 7.90688 17.5519 8.01493 17.7057 8.12261C17.5748 8.03074 17.7146 8.13116 17.7446 8.15608C17.7819 8.18714 17.8186 8.21912 17.8547 8.25148C17.9268 8.31639 17.9966 8.38408 18.0639 8.45419C18.1254 8.51854 18.1849 8.58493 18.242 8.65318C18.267 8.68293 18.3678 8.82278 18.2755 8.69205C18.3036 8.73184 18.3339 8.76997 18.362 8.80977C18.4747 8.96933 18.5755 9.13745 18.6633 9.31207C18.6852 9.35596 18.7064 9.40022 18.7269 9.44504C18.7326 9.45787 18.7384 9.47089 18.7442 9.48372C18.7787 9.57113 18.8118 9.65909 18.8407 9.74854C18.9024 9.93972 18.9493 10.1355 18.9807 10.334C18.9846 10.3591 18.9876 10.3844 18.9919 10.4095C18.9904 10.4004 18.9889 10.3922 18.9876 10.3847C18.9878 10.3857 18.9878 10.3864 18.988 10.3874C18.9928 10.4299 18.9967 10.4725 19.0002 10.5151C19.0084 10.6187 19.0121 10.7225 19.0125 10.8264C19.0116 10.9311 19.0079 11.0349 18.9997 11.1385Z"
            fill="#00B3C7"
        />
        <path
            d="M14.1929 13.9829C14.2085 13.9896 14.224 13.9966 14.2394 14.0037C14.2418 14.0046 14.244 14.0056 14.2465 14.0065C14.1797 13.9736 14.1775 13.9745 14.1929 13.9829Z"
            fill="#00B3C7"
        />
        <path
            d="M17.3356 10.9108C16.8127 10.9108 16.2897 10.9108 15.7668 10.9108C15.7668 10.2895 15.7668 9.66799 15.7668 9.04667C15.7668 8.94271 15.7668 8.83894 15.7668 8.73498C15.7668 8.54046 15.5957 8.35411 15.3948 8.36304C15.1932 8.37215 15.0229 8.52651 15.0229 8.73498C15.0229 9.48035 15.0229 10.2257 15.0229 10.9711C15.0229 11.075 15.0229 11.1788 15.0229 11.2828C15.0229 11.4838 15.1932 11.6547 15.3948 11.6547C15.9596 11.6547 16.5244 11.6547 17.0892 11.6547C17.1714 11.6547 17.2534 11.6547 17.3356 11.6547C17.5301 11.6547 17.7165 11.4836 17.7076 11.2828C17.6986 11.0812 17.5441 10.9108 17.3356 10.9108Z"
            fill="#00B3C7"
        />
    </Icon>
);

export default ScheduleIconTab;