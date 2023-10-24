import React from "react";

import Icon from "./Icon";

const OpenFile = (props) => (
    <Icon viewBox="0 0 237 147" className={props.className} width={props.width || 237} height={props.height || 147} fill="none">
        <path 
            d="M236.577 146.533C236.577 146.59 183.614 146.639 118.295 146.639C52.9762 146.639 0 146.59 0 146.533C0 146.475 52.9516 146.426 118.295 146.426C183.638 146.426 236.577 146.475 236.577 146.533Z" 
            fill="#005963"/>
        <path 
            d="M78.3955 10.2349C78.3849 10.1849 78.3849 10.1333 78.3955 10.0833C78.4153 10.0375 78.4439 9.99598 78.4798 9.96123C78.5157 9.92647 78.5581 9.89916 78.6045 9.88085C78.651 9.86254 78.7006 9.85361 78.7506 9.85456C78.8005 9.85551 78.8497 9.86633 78.8955 9.88639C79.3652 10.0909 79.8272 10.3106 80.2893 10.5379C80.3342 10.5596 80.3743 10.5901 80.4071 10.6276C80.4399 10.6651 80.4649 10.7089 80.4804 10.7562C80.496 10.8036 80.5018 10.8536 80.4976 10.9033C80.4934 10.953 80.4793 11.0013 80.456 11.0454C80.4342 11.0902 80.4037 11.1303 80.3664 11.1634C80.3291 11.1964 80.2856 11.2217 80.2384 11.2379C80.1912 11.2541 80.1414 11.2608 80.0916 11.2577C80.0418 11.2546 79.9932 11.2416 79.9485 11.2196C79.5015 10.9924 79.047 10.7803 78.5925 10.5833C78.5304 10.5494 78.479 10.4988 78.4442 10.4372C78.4094 10.3756 78.3925 10.3055 78.3955 10.2349ZM81.1075 11.5984C81.1098 11.532 81.128 11.467 81.1605 11.409C81.2112 11.3232 81.2931 11.2603 81.3891 11.2335C81.4851 11.2067 81.5878 11.218 81.6756 11.2651C82.1226 11.5227 82.5619 11.7878 82.9937 12.0681C83.0724 12.1248 83.1264 12.2095 83.1445 12.3048C83.1625 12.4001 83.1434 12.4986 83.0909 12.5802C83.0385 12.6618 82.9568 12.7202 82.8626 12.7433C82.7684 12.7664 82.6689 12.7525 82.5847 12.7044C82.1604 12.4317 81.7362 12.1741 81.3044 11.9469C81.2459 11.9106 81.1987 11.8589 81.1679 11.7973C81.1372 11.7358 81.1241 11.6669 81.1302 11.5984L81.1075 11.5984ZM83.6679 13.2423C83.6682 13.1615 83.6918 13.0825 83.7361 13.015C83.7965 12.9351 83.8855 12.8817 83.9844 12.8662C84.0833 12.8507 84.1844 12.8741 84.2664 12.9317C84.683 13.2347 85.0921 13.5453 85.486 13.871C85.5641 13.9335 85.6142 14.0243 85.6256 14.1237C85.6369 14.223 85.6085 14.3228 85.5466 14.4013C85.4841 14.4793 85.3933 14.5295 85.294 14.5408C85.1946 14.5522 85.0948 14.5238 85.0163 14.4619C84.6224 14.1437 84.2588 13.8407 83.8194 13.5453C83.772 13.5104 83.7334 13.4647 83.7071 13.4121C83.6808 13.3594 83.6673 13.3012 83.6679 13.2423ZM83.721 29.7943C83.763 29.245 83.8988 28.707 84.1224 28.2035C84.1626 28.1111 84.2379 28.0384 84.3316 28.0015C84.4254 27.9646 84.53 27.9664 84.6224 28.0066C84.7148 28.0467 84.7875 28.122 84.8244 28.2157C84.8614 28.3095 84.8596 28.4141 84.8194 28.5065C84.6274 28.9298 84.512 29.3838 84.4785 29.8474C84.4756 29.8968 84.4629 29.9452 84.441 29.9897C84.4192 30.0341 84.3886 30.0738 84.3512 30.1063C84.3138 30.1387 84.2703 30.1634 84.2232 30.1788C84.1761 30.1942 84.1264 30.2 84.077 30.1958C84.0269 30.1939 83.9777 30.1819 83.9323 30.1605C83.887 30.1391 83.8464 30.1087 83.8132 30.0712C83.7799 30.0336 83.7546 29.9898 83.7387 29.9422C83.7229 29.8946 83.7168 29.8443 83.721 29.7943ZM83.9028 31.3094C83.8877 31.2089 83.9132 31.1066 83.9735 31.0249C84.0339 30.9432 84.1243 30.8889 84.2247 30.8738C84.3252 30.8587 84.4275 30.8842 84.5092 30.9446C84.5909 31.005 84.6452 31.0953 84.6603 31.1958C84.7924 31.6229 85.0204 32.0142 85.3269 32.3396C85.3624 32.3748 85.3906 32.4167 85.4098 32.4629C85.4291 32.5091 85.439 32.5586 85.439 32.6086C85.439 32.6586 85.4291 32.7081 85.4098 32.7542C85.3906 32.8004 85.3624 32.8423 85.3269 32.8775C85.2548 32.9474 85.1584 32.9864 85.058 32.9864C84.9576 32.9864 84.8612 32.9474 84.7891 32.8775C84.3981 32.4644 84.1078 31.9667 83.9406 31.423L83.9028 31.3094ZM84.8876 27.0521C84.8835 26.9636 84.9133 26.8769 84.9709 26.8097C85.3114 26.3936 85.7006 26.0197 86.1299 25.6961C86.211 25.6377 86.3114 25.613 86.4103 25.6271C86.5092 25.6413 86.5987 25.6931 86.6602 25.7718C86.691 25.8112 86.7136 25.8565 86.7265 25.9048C86.7394 25.9531 86.7424 26.0036 86.7353 26.0531C86.7283 26.1026 86.7112 26.1502 86.6853 26.193C86.6594 26.2358 86.6251 26.2729 86.5844 26.3021C86.2053 26.5908 85.8597 26.9211 85.5542 27.2869C85.5233 27.3258 85.4849 27.3582 85.4413 27.382C85.3977 27.4058 85.3497 27.4207 85.3003 27.4256C85.2508 27.4306 85.2009 27.4255 85.1534 27.4108C85.1059 27.3961 85.0619 27.372 85.0239 27.3399C84.9847 27.3006 84.9548 27.2529 84.9364 27.2005C84.9181 27.148 84.9117 27.0921 84.9179 27.0369L84.8876 27.0521ZM85.986 33.2941L85.986 33.2335C86.0028 33.1349 86.0571 33.0466 86.1377 32.9873C86.2182 32.928 86.3186 32.9022 86.4178 32.9154C86.5337 32.9266 86.6504 32.9266 86.7662 32.9154C87.0944 32.9114 87.4196 32.8525 87.7283 32.7411C87.8288 32.708 87.9383 32.7161 88.0327 32.7637C88.1272 32.8113 88.1989 32.8945 88.2321 32.9949C88.2652 33.0954 88.2571 33.2049 88.2095 33.2993C88.1619 33.3938 88.0787 33.4655 87.9783 33.4987C87.5882 33.6338 87.179 33.7054 86.7662 33.7108C86.6099 33.7217 86.4529 33.7217 86.2966 33.7108C86.1985 33.694 86.1109 33.6394 86.0527 33.5586C85.9946 33.4778 85.9706 33.3773 85.986 33.279L85.986 33.2941ZM86.0239 15.1664C86.0265 15.0718 86.0612 14.981 86.1223 14.9088C86.1575 14.8733 86.1994 14.8451 86.2456 14.8259C86.2918 14.8067 86.3413 14.7968 86.3913 14.7968C86.4413 14.7968 86.4908 14.8067 86.5369 14.8259C86.5831 14.8451 86.625 14.8733 86.6602 14.9088C87.0389 15.2497 87.4177 15.6133 87.7738 15.9769C87.8441 16.0493 87.8828 16.1466 87.8814 16.2474C87.8799 16.3483 87.8385 16.4445 87.7662 16.5148C87.6938 16.5851 87.5965 16.6238 87.4957 16.6224C87.3948 16.621 87.2987 16.5795 87.2283 16.5072C86.8799 16.1512 86.5238 15.8027 86.1526 15.4694C86.1076 15.4303 86.0725 15.381 86.0501 15.3257C86.0278 15.2705 86.0188 15.2107 86.0239 15.1512L86.0239 15.1664ZM87.2889 25.234C87.288 25.1609 87.3083 25.0891 87.3473 25.0273C87.3862 24.9654 87.4423 24.9162 87.5086 24.8855C87.9924 24.6655 88.5012 24.5053 89.0237 24.4083C89.1241 24.3902 89.2277 24.4128 89.3115 24.471C89.3953 24.5293 89.4525 24.6184 89.4706 24.7189C89.4887 24.8193 89.4661 24.9228 89.4079 25.0067C89.3497 25.0905 89.2605 25.1477 89.16 25.1658C88.6898 25.2466 88.2316 25.3866 87.7965 25.5825C87.705 25.6234 87.6011 25.6265 87.5074 25.591C87.4137 25.5555 87.3378 25.4844 87.2965 25.3931C87.2807 25.3363 87.2781 25.2767 87.2889 25.2188L87.2889 25.234ZM88.1449 17.3481C88.1457 17.271 88.17 17.1959 88.2145 17.133C88.2591 17.0701 88.3218 17.0222 88.3943 16.9959C88.4667 16.9695 88.5455 16.9659 88.6201 16.9855C88.6947 17.0051 88.7615 17.0471 88.8116 17.1057C89.1449 17.5072 89.4706 17.9162 89.7585 18.3329C89.7874 18.373 89.8079 18.4184 89.819 18.4666C89.8301 18.5148 89.8314 18.5646 89.8229 18.6133C89.8145 18.662 89.7964 18.7085 89.7697 18.7501C89.743 18.7917 89.7083 18.8276 89.6676 18.8556C89.6269 18.8846 89.5808 18.9053 89.532 18.9165C89.4833 18.9277 89.4328 18.9291 89.3835 18.9206C89.3342 18.9122 89.2871 18.894 89.2448 18.8673C89.2025 18.8405 89.166 18.8056 89.1373 18.7647C88.8646 18.3707 88.554 18.0071 88.2283 17.5905C88.1684 17.5186 88.1385 17.4263 88.1449 17.3329L88.1449 17.3481ZM88.8116 32.4078C88.811 32.3489 88.8244 32.2907 88.8507 32.238C88.8771 32.1853 88.9156 32.1397 88.9631 32.1048C89.3096 31.8378 89.6203 31.5272 89.8873 31.1806L89.9479 31.0973C90.0081 31.0169 90.0979 30.9638 90.1973 30.9496C90.2968 30.9354 90.3978 30.9613 90.4781 31.0215C90.558 31.0819 90.6114 31.1709 90.6269 31.2698C90.6425 31.3688 90.619 31.4698 90.5615 31.5518L90.4933 31.6427C90.1833 32.0423 89.8215 32.3989 89.4176 32.7033C89.3627 32.7481 89.296 32.7764 89.2256 32.7846C89.1551 32.7928 89.0838 32.7806 89.02 32.7495C88.9563 32.7184 88.9027 32.6697 88.8658 32.6092C88.8289 32.5486 88.81 32.4787 88.8116 32.4078ZM89.8873 19.8328C89.8862 19.7645 89.9041 19.6972 89.9389 19.6384C89.9736 19.5796 90.0239 19.5315 90.0842 19.4995C90.1721 19.4524 90.2747 19.4411 90.3707 19.4679C90.4667 19.4947 90.5486 19.5576 90.5993 19.6434C90.8572 20.0948 91.0899 20.5601 91.2963 21.0373C91.3243 21.1263 91.3184 21.2225 91.2799 21.3074C91.2413 21.3924 91.1728 21.4601 91.0874 21.4977C91.002 21.5352 90.9057 21.5399 90.8171 21.5109C90.7284 21.4818 90.6536 21.4211 90.6069 21.3403C90.41 20.9009 90.1903 20.454 89.9403 20.0146C89.9015 19.9565 89.8828 19.8873 89.8873 19.8176L89.8873 19.8328ZM90.2206 24.7189C90.2283 24.6191 90.2745 24.5262 90.3494 24.4598C90.4243 24.3933 90.5221 24.3586 90.6221 24.3628C91.1518 24.4031 91.6767 24.4919 92.1902 24.628C92.2385 24.6403 92.2838 24.6621 92.3237 24.692C92.3636 24.722 92.3971 24.7595 92.4224 24.8024C92.4478 24.8453 92.4644 24.8928 92.4713 24.9422C92.4783 24.9916 92.4754 25.0418 92.4629 25.0901C92.4446 25.1551 92.4099 25.2143 92.3622 25.2621C92.3144 25.3098 92.2552 25.3445 92.1902 25.3628C92.2258 25.3971 92.2543 25.4383 92.2738 25.4838C92.2933 25.5294 92.3035 25.5784 92.3038 25.6279L92.3038 25.8703C92.3054 26.3133 92.2801 26.756 92.228 27.196C92.2148 27.2959 92.163 27.3867 92.0837 27.449C92.0045 27.5112 91.904 27.5401 91.8038 27.5293C91.7044 27.5161 91.6143 27.464 91.5533 27.3845C91.4922 27.305 91.4652 27.2045 91.4781 27.1051C91.5239 26.6951 91.5466 26.2829 91.5463 25.8703L91.5463 25.6431C91.5457 25.5719 91.5644 25.502 91.6005 25.4406C91.6365 25.3792 91.6884 25.3288 91.7508 25.2946C91.3618 25.2069 90.9668 25.1487 90.5691 25.1204C90.4699 25.1126 90.3777 25.0661 90.3125 24.991C90.2473 24.9159 90.2143 24.8181 90.2206 24.7189ZM90.6296 30.0216C90.6182 29.9666 90.6182 29.9099 90.6296 29.8549C90.8416 29.4193 91.014 28.9655 91.1448 28.4989C91.1719 28.3985 91.2378 28.3129 91.328 28.2611C91.4182 28.2092 91.5253 28.1953 91.6258 28.2225C91.7263 28.2496 91.8118 28.3155 91.8637 28.4057C91.9155 28.4959 91.9294 28.603 91.9023 28.7035C91.7555 29.2235 91.5654 29.7302 91.3342 30.2185C91.2901 30.3071 91.2131 30.375 91.1197 30.4075C91.0262 30.4401 90.9238 30.4348 90.8342 30.3928C90.7732 30.3535 90.7246 30.2978 90.6938 30.2322C90.6629 30.1666 90.6512 30.0936 90.66 30.0216L90.6296 30.0216ZM91.069 22.6053C91.0677 22.5231 91.0938 22.4427 91.1432 22.3769C91.1926 22.3111 91.2624 22.2636 91.3417 22.2417C91.4372 22.2133 91.5399 22.2236 91.6278 22.2704C91.7157 22.3172 91.7817 22.3967 91.8114 22.4917C91.9643 22.9876 92.0808 23.4939 92.1599 24.0068C92.1678 24.0565 92.1659 24.1073 92.1542 24.1563C92.1425 24.2053 92.1213 24.2516 92.0918 24.2924C92.0622 24.3332 92.0249 24.3677 91.982 24.3941C91.9391 24.4205 91.8914 24.4382 91.8417 24.4462C91.792 24.4541 91.7411 24.4522 91.6921 24.4405C91.6431 24.4288 91.5969 24.4076 91.5561 24.3781C91.5153 24.3485 91.4807 24.3112 91.4544 24.2683C91.428 24.2254 91.4103 24.1777 91.4023 24.128C91.3218 23.6442 91.2104 23.1659 91.069 22.6963L91.069 22.6053ZM93.175 25.4764C93.1645 25.4239 93.1645 25.3698 93.175 25.3173C93.2163 25.226 93.2921 25.1549 93.3858 25.1194C93.4795 25.0839 93.5835 25.0869 93.6749 25.1279C94.1526 25.346 94.6135 25.5992 95.0536 25.8855C95.139 25.9387 95.1998 26.0237 95.2225 26.1217C95.2452 26.2197 95.2281 26.3228 95.1748 26.4082C95.1216 26.4936 95.0366 26.5543 94.9386 26.577C94.8406 26.5997 94.7375 26.5826 94.6521 26.5294C94.2385 26.2694 93.8083 26.0366 93.3643 25.8324C93.3018 25.7977 93.2507 25.7455 93.2171 25.6824C93.1835 25.6192 93.1688 25.5477 93.175 25.4764ZM95.7506 27.0748C95.7516 26.9895 95.7809 26.9069 95.8339 26.84C95.8649 26.8002 95.9035 26.7671 95.9475 26.7425C95.9915 26.7178 96.04 26.7022 96.0901 26.6966C96.1402 26.691 96.1909 26.6954 96.2392 26.7096C96.2876 26.7238 96.3327 26.7475 96.3717 26.7794C96.7657 27.0899 97.1293 27.4384 97.5383 27.802C97.6107 27.8723 97.6521 27.9685 97.6535 28.0694C97.6549 28.1702 97.6162 28.2675 97.5459 28.3399C97.4756 28.4122 97.3794 28.4536 97.2786 28.455C97.1777 28.4565 97.0804 28.4178 97.0081 28.3474C96.6536 28.0032 96.2819 27.677 95.8945 27.3702C95.8487 27.3326 95.8119 27.2852 95.787 27.2314C95.7621 27.1776 95.7496 27.1189 95.7506 27.0596L95.7506 27.0748ZM98.0762 29.4762L98.3186 29.1807L98.6065 28.9307C98.9701 29.355 99.2807 29.7337 99.5837 30.1201C99.6448 30.1995 99.6719 30.2999 99.6591 30.3993C99.6463 30.4987 99.5947 30.589 99.5155 30.6503C99.4766 30.6816 99.4317 30.7046 99.3837 30.7181C99.3356 30.7317 99.2854 30.7353 99.2359 30.729C99.1864 30.7226 99.1387 30.7063 99.0956 30.6811C99.0525 30.6559 99.015 30.6222 98.9852 30.5822C98.6898 30.1958 98.3943 29.8246 98.0762 29.461L98.0762 29.4762ZM99.7882 31.5897C99.7888 31.5272 99.8042 31.4658 99.8332 31.4105C99.8621 31.3552 99.9039 31.3075 99.9549 31.2715C100.04 31.2163 100.143 31.1965 100.242 31.2163C100.341 31.2361 100.428 31.294 100.485 31.3776C100.773 31.8018 101.046 32.2336 101.303 32.6805C101.354 32.7661 101.368 32.8681 101.344 32.9644C101.32 33.0608 101.259 33.1438 101.174 33.1956C101.088 33.2464 100.985 33.2613 100.887 33.2373C100.789 33.2132 100.705 33.1521 100.652 33.0669C100.399 32.6376 100.134 32.2134 99.8564 31.7942C99.8095 31.7308 99.7854 31.6534 99.7882 31.5745L99.7882 31.5897ZM101.303 34.2032C101.303 34.1331 101.322 34.0644 101.358 34.0044C101.394 33.9444 101.446 33.8952 101.508 33.8623C101.597 33.8174 101.701 33.8097 101.796 33.8409C101.891 33.8721 101.97 33.9397 102.015 34.0289C102.25 34.491 102.47 34.9531 102.682 35.4228C102.72 35.5154 102.721 35.6193 102.685 35.7126C102.648 35.8059 102.576 35.8813 102.485 35.9228C102.439 35.9428 102.39 35.9536 102.34 35.9546C102.29 35.9555 102.241 35.9466 102.194 35.9283C102.148 35.91 102.105 35.8827 102.069 35.8479C102.033 35.8132 102.005 35.7717 101.985 35.7258C101.788 35.2713 101.568 34.8168 101.341 34.3774C101.326 34.3154 101.324 34.251 101.334 34.188L101.303 34.2032ZM102.53 36.9833C102.512 36.8829 102.535 36.7793 102.593 36.6955C102.651 36.6117 102.741 36.5545 102.841 36.5364C102.942 36.5183 103.045 36.5408 103.129 36.5991C103.213 36.6573 103.27 36.7465 103.288 36.847C103.47 37.3242 103.636 37.809 103.796 38.3014C103.827 38.3968 103.819 38.5007 103.773 38.5902C103.728 38.6797 103.649 38.7475 103.553 38.7787C103.457 38.8073 103.353 38.7973 103.264 38.7506C103.175 38.7039 103.107 38.6243 103.076 38.5287C102.924 38.0514 102.758 37.5818 102.584 37.1121C102.562 37.0674 102.554 37.0173 102.561 36.9682L102.53 36.9833ZM103.47 39.8695C103.469 39.7872 103.495 39.7069 103.544 39.6411C103.593 39.5753 103.663 39.5277 103.743 39.5059C103.84 39.4801 103.944 39.4934 104.031 39.5429C104.119 39.5925 104.184 39.6743 104.212 39.771C104.341 40.2634 104.47 40.7634 104.576 41.2861C104.587 41.3348 104.588 41.3853 104.58 41.4346C104.571 41.4839 104.553 41.5311 104.527 41.5733C104.5 41.6156 104.465 41.6521 104.424 41.6809C104.383 41.7096 104.337 41.7299 104.288 41.7406C104.24 41.7517 104.19 41.753 104.141 41.7445C104.092 41.736 104.045 41.7178 104.004 41.6909C103.962 41.6641 103.926 41.6292 103.898 41.5883C103.87 41.5474 103.851 41.5013 103.841 41.4527C103.727 40.9603 103.614 40.4755 103.477 39.9907L103.47 39.8695ZM104.046 59.4896L104.046 59.429L104.258 57.9139C104.263 57.865 104.279 57.8177 104.303 57.7748C104.327 57.7319 104.359 57.6942 104.398 57.6638C104.437 57.6335 104.481 57.6112 104.528 57.5982C104.576 57.5853 104.625 57.5818 104.674 57.5882C104.774 57.6014 104.865 57.6532 104.927 57.7325C104.99 57.8117 105.018 57.9122 105.008 58.0124L104.795 59.5275C104.788 59.6279 104.742 59.7215 104.666 59.7875C104.59 59.8536 104.491 59.8867 104.39 59.8797C104.29 59.8727 104.196 59.826 104.13 59.75C104.064 59.674 104.031 59.5749 104.038 59.4744L104.046 59.4896ZM104.129 42.8239C104.124 42.7741 104.13 42.724 104.145 42.6763C104.16 42.6287 104.184 42.5844 104.216 42.5461C104.28 42.4686 104.373 42.4201 104.474 42.411C104.574 42.402 104.674 42.4332 104.751 42.4979C104.829 42.5625 104.877 42.6552 104.886 42.7557C104.977 43.2557 105.053 43.7632 105.129 44.2708C105.142 44.3711 105.115 44.4724 105.054 44.5532C104.993 44.6339 104.903 44.6875 104.803 44.7026C104.704 44.7155 104.603 44.6884 104.524 44.6274C104.444 44.5663 104.392 44.4762 104.379 44.3768L104.144 42.8618L104.129 42.8239ZM104.439 56.4595L104.439 56.414L104.583 54.8989C104.591 54.7985 104.639 54.7053 104.716 54.64C104.792 54.5746 104.892 54.5424 104.992 54.5505C105.093 54.5585 105.186 54.6061 105.251 54.6828C105.317 54.7596 105.349 54.8591 105.341 54.9595C105.303 55.4671 105.258 55.9746 105.197 56.4746C105.186 56.5739 105.135 56.6646 105.057 56.7271C104.979 56.7895 104.88 56.8186 104.78 56.8079C104.697 56.7942 104.62 56.752 104.563 56.6886C104.507 56.6252 104.474 56.5443 104.47 56.4595L104.439 56.4595ZM104.546 45.854C104.54 45.7536 104.576 45.6552 104.643 45.5806C104.711 45.5061 104.805 45.4613 104.905 45.4563C105.006 45.4513 105.104 45.4864 105.179 45.5539C105.253 45.6213 105.298 45.7157 105.303 45.8161C105.356 46.3237 105.402 46.8388 105.432 47.3312C105.437 47.3814 105.432 47.4321 105.416 47.4802C105.401 47.5283 105.376 47.5726 105.342 47.6104C105.309 47.6481 105.268 47.6785 105.222 47.6996C105.176 47.7206 105.126 47.7319 105.076 47.7327C104.977 47.739 104.879 47.7059 104.804 47.6407C104.729 47.5755 104.682 47.4834 104.674 47.3842C104.674 46.8767 104.599 46.3767 104.553 45.8692L104.546 45.854ZM104.682 53.4293C104.682 52.9294 104.727 52.4218 104.742 51.9143C104.743 51.8645 104.754 51.8155 104.774 51.7699C104.794 51.7243 104.823 51.6831 104.859 51.6486C104.895 51.6142 104.937 51.5871 104.983 51.569C105.03 51.5509 105.079 51.5421 105.129 51.5431C105.227 51.5505 105.32 51.594 105.388 51.6653C105.457 51.7366 105.497 51.8306 105.5 51.9294C105.5 52.4445 105.5 52.9521 105.439 53.4445C105.434 53.5456 105.388 53.6404 105.313 53.7084C105.238 53.7765 105.139 53.8122 105.038 53.8081C104.947 53.7952 104.864 53.7497 104.804 53.68C104.744 53.6103 104.711 53.5212 104.712 53.4293L104.682 53.4293ZM104.742 48.8841C104.742 48.7837 104.782 48.6873 104.853 48.6163C104.924 48.5453 105.021 48.5054 105.121 48.5054C105.222 48.5054 105.318 48.5453 105.389 48.6163C105.46 48.6873 105.5 48.7837 105.5 48.8841L105.5 50.3992C105.5 50.4997 105.46 50.596 105.389 50.667C105.318 50.7381 105.222 50.778 105.121 50.778C105.072 50.779 105.023 50.7701 104.977 50.7519C104.931 50.7337 104.889 50.7065 104.854 50.672C104.819 50.6374 104.791 50.5961 104.771 50.5506C104.752 50.5051 104.742 50.4562 104.742 50.4068C104.742 49.8992 104.742 49.3993 104.742 48.8917L104.742 48.8841Z" 
            fill="#B8BDC9"/>
        <path 
            d="M114.961 50.648C115.018 50.1356 115.116 49.6288 115.257 49.1329C115.27 49.0832 115.292 49.0365 115.323 48.9955C115.354 48.9545 115.393 48.92 115.438 48.8939C115.482 48.8679 115.531 48.8509 115.582 48.8438C115.633 48.8367 115.684 48.8397 115.734 48.8526C115.784 48.8656 115.831 48.8882 115.872 48.9192C115.913 48.9501 115.947 48.9889 115.973 49.0332C115.999 49.0775 116.016 49.1265 116.023 49.1774C116.03 49.2283 116.027 49.2801 116.014 49.3299C115.887 49.7915 115.799 50.2627 115.749 50.7389C115.745 50.7887 115.73 50.8371 115.706 50.8813C115.683 50.9255 115.651 50.9645 115.612 50.9962C115.573 51.0279 115.529 51.0516 115.481 51.066C115.433 51.0803 115.382 51.085 115.333 51.0798C115.278 51.0805 115.225 51.0693 115.175 51.047C115.126 51.0247 115.082 50.9918 115.046 50.9506C115.011 50.9094 114.985 50.861 114.97 50.8087C114.956 50.7564 114.953 50.7015 114.961 50.648ZM115.719 47.7466C115.712 47.704 115.712 47.6605 115.719 47.6178L116.227 46.2088C116.242 46.1607 116.268 46.1163 116.301 46.0782C116.334 46.0401 116.375 46.009 116.421 45.9869C116.466 45.9648 116.516 45.952 116.566 45.9493C116.617 45.9466 116.667 45.9541 116.715 45.9714C116.763 45.9886 116.806 46.0152 116.844 46.0496C116.881 46.084 116.911 46.1255 116.931 46.1717C116.952 46.2178 116.964 46.2677 116.965 46.3183C116.966 46.3689 116.957 46.4193 116.939 46.4664L116.431 47.8754C116.423 47.9252 116.404 47.9727 116.378 48.0155C116.351 48.0582 116.316 48.0952 116.275 48.1244C116.233 48.1536 116.187 48.1744 116.138 48.1856C116.089 48.1968 116.038 48.1982 115.988 48.1898C115.938 48.1813 115.891 48.1632 115.848 48.1363C115.805 48.1095 115.768 48.0745 115.739 48.0333C115.71 47.9922 115.689 47.9457 115.678 47.8965C115.667 47.8473 115.665 47.7964 115.674 47.7466L115.719 47.7466ZM116.734 44.9286C116.727 44.886 116.727 44.8425 116.734 44.7998L117.264 43.3908C117.281 43.3441 117.307 43.3013 117.341 43.2648C117.375 43.2284 117.415 43.1991 117.46 43.1786C117.506 43.1581 117.554 43.1469 117.604 43.1456C117.654 43.1443 117.703 43.153 117.749 43.1711C117.796 43.1888 117.839 43.2156 117.876 43.2499C117.912 43.2843 117.942 43.3256 117.962 43.3714C117.982 43.4172 117.994 43.4666 117.995 43.5168C117.996 43.5669 117.987 43.6168 117.969 43.6635L117.446 45.065C117.411 45.158 117.34 45.2332 117.249 45.2743C117.158 45.3154 117.055 45.3192 116.961 45.2846C116.891 45.2564 116.831 45.2068 116.791 45.143C116.75 45.0792 116.73 45.0042 116.734 44.9286ZM117.787 42.1409C117.776 42.0936 117.776 42.0443 117.787 41.997C117.969 41.5349 118.158 41.0652 118.355 40.6031C118.395 40.5123 118.469 40.4404 118.56 40.4023C118.652 40.3642 118.755 40.3629 118.848 40.3986C118.939 40.4401 119.011 40.515 119.049 40.608C119.087 40.7009 119.088 40.8048 119.052 40.8985C118.855 41.3531 118.673 41.8152 118.492 42.2772C118.473 42.3235 118.446 42.3658 118.411 42.4015C118.377 42.4372 118.335 42.4657 118.289 42.4854C118.244 42.5051 118.194 42.5156 118.145 42.5163C118.095 42.517 118.045 42.5078 117.999 42.4894C117.934 42.4583 117.879 42.4088 117.841 42.3469C117.803 42.285 117.785 42.2133 117.787 42.1409ZM118.946 39.3759C118.935 39.326 118.935 39.2743 118.946 39.2244L119.575 37.8533C119.596 37.8078 119.626 37.7669 119.663 37.7331C119.7 37.6993 119.743 37.6732 119.791 37.6563C119.838 37.6394 119.888 37.632 119.938 37.6346C119.988 37.6372 120.037 37.6497 120.082 37.6715C120.173 37.7157 120.243 37.7935 120.276 37.8883C120.31 37.9831 120.306 38.0874 120.264 38.179C120.045 38.6259 119.84 39.0729 119.643 39.5274C119.623 39.6279 119.564 39.7162 119.479 39.7731C119.393 39.8299 119.289 39.8505 119.189 39.8304C119.088 39.8103 119 39.7512 118.943 39.6659C118.886 39.5807 118.865 39.4764 118.886 39.3759L118.946 39.3759ZM120.234 36.6715C120.234 36.6105 120.249 36.5504 120.279 36.4973C120.507 36.0503 120.741 35.6034 120.991 35.164C121.015 35.1201 121.047 35.0813 121.086 35.0501C121.125 35.0189 121.17 34.9959 121.218 34.9825C121.266 34.969 121.317 34.9655 121.366 34.9719C121.416 34.9784 121.464 34.9948 121.507 35.0201C121.594 35.0694 121.658 35.1514 121.685 35.2479C121.712 35.3445 121.7 35.4478 121.651 35.5352C121.408 35.967 121.173 36.4064 120.946 36.8457C120.924 36.89 120.893 36.9293 120.855 36.9614C120.817 36.9934 120.773 37.0176 120.726 37.0324C120.678 37.0472 120.629 37.0524 120.579 37.0477C120.53 37.043 120.482 37.0284 120.438 37.0048C120.376 36.9725 120.324 36.9236 120.288 36.8634C120.252 36.8032 120.233 36.7341 120.234 36.6639L120.234 36.6715ZM121.696 34.058C121.698 33.9892 121.716 33.9218 121.749 33.8611C122.014 33.4293 122.287 33.0051 122.567 32.5808C122.595 32.5393 122.631 32.5037 122.673 32.4762C122.715 32.4487 122.762 32.4299 122.812 32.4207C122.861 32.4115 122.912 32.4123 122.961 32.4229C123.01 32.4334 123.056 32.4537 123.097 32.4824C123.139 32.5098 123.174 32.5452 123.202 32.5865C123.229 32.6278 123.248 32.6742 123.257 32.7229C123.266 32.7716 123.265 32.8217 123.255 32.8702C123.244 32.9186 123.224 32.9645 123.196 33.0051C122.923 33.4141 122.671 33.8308 122.438 34.255C122.396 34.3266 122.331 34.3823 122.254 34.4133C122.176 34.4443 122.091 34.4489 122.011 34.4265C121.93 34.4041 121.86 34.3558 121.81 34.2892C121.76 34.2226 121.733 34.1413 121.734 34.058L121.696 34.058ZM123.37 31.5354C123.368 31.4532 123.395 31.3729 123.446 31.3082L123.794 30.8537C123.984 30.6037 124.181 30.3537 124.385 30.0961C124.417 30.0578 124.456 30.0262 124.5 30.003C124.544 29.9798 124.592 29.9655 124.642 29.9609C124.692 29.9563 124.742 29.9616 124.789 29.9763C124.837 29.9911 124.881 30.0151 124.919 30.0469C124.958 30.0787 124.989 30.1178 125.012 30.1619C125.036 30.2059 125.05 30.2541 125.054 30.3037C125.059 30.3533 125.054 30.4033 125.039 30.4509C125.024 30.4985 125 30.5427 124.968 30.581C124.772 30.8234 124.575 31.0582 124.393 31.3385L124.052 31.7854C124.004 31.849 123.938 31.896 123.862 31.9197C123.786 31.9434 123.705 31.9426 123.629 31.9175C123.554 31.8924 123.488 31.8441 123.442 31.7796C123.395 31.7152 123.37 31.6377 123.37 31.5582L123.37 31.5354ZM125.287 29.2629C125.289 29.1668 125.327 29.075 125.393 29.0053C125.741 28.6341 126.097 28.2478 126.468 27.9296C126.503 27.8943 126.544 27.8663 126.59 27.8472C126.635 27.828 126.684 27.8182 126.734 27.8182C126.783 27.8182 126.832 27.828 126.877 27.8472C126.923 27.8663 126.964 27.8943 126.999 27.9296C127.034 27.9648 127.062 28.0067 127.082 28.0529C127.101 28.099 127.111 28.1485 127.111 28.1985C127.111 28.2485 127.101 28.298 127.082 28.3442C127.062 28.3903 127.034 28.4322 126.999 28.4674C126.643 28.8008 126.294 29.1492 125.961 29.5128C125.926 29.5483 125.884 29.5765 125.838 29.5957C125.791 29.615 125.742 29.6249 125.692 29.6249C125.642 29.6249 125.592 29.615 125.546 29.5957C125.5 29.5765 125.458 29.5483 125.423 29.5128C125.385 29.4822 125.353 29.4443 125.33 29.4014C125.307 29.3585 125.292 29.3114 125.287 29.2629ZM127.468 27.2099C127.468 27.1548 127.48 27.1002 127.503 27.0503C127.527 27.0004 127.562 26.9566 127.605 26.9221C127.991 26.5963 128.362 26.2782 128.802 25.9827C128.884 25.9252 128.985 25.9017 129.084 25.9173C129.182 25.9328 129.272 25.9862 129.332 26.0661C129.361 26.1063 129.383 26.152 129.394 26.2005C129.406 26.2489 129.408 26.2992 129.4 26.3485C129.393 26.3978 129.375 26.445 129.349 26.4876C129.323 26.5301 129.289 26.5671 129.249 26.5963C128.855 26.8842 128.491 27.1872 128.09 27.4978C128.012 27.5619 127.912 27.5931 127.811 27.5846C127.711 27.5761 127.618 27.5286 127.552 27.4524C127.499 27.3826 127.469 27.2976 127.468 27.2099ZM129.892 25.4525C129.892 25.3879 129.908 25.3243 129.938 25.2674C129.969 25.2105 130.013 25.1622 130.067 25.1267C130.498 24.854 130.945 24.5965 131.392 24.3692C131.482 24.323 131.586 24.3142 131.682 24.3447C131.778 24.3753 131.857 24.4427 131.904 24.5321C131.95 24.6215 131.959 24.7256 131.928 24.8215C131.898 24.9174 131.83 24.9972 131.741 25.0434C131.317 25.2707 130.892 25.5131 130.468 25.8009C130.426 25.8274 130.379 25.8452 130.33 25.8534C130.281 25.8617 130.23 25.8601 130.182 25.8488C130.133 25.8376 130.087 25.8168 130.047 25.7878C130.006 25.7588 129.972 25.7221 129.945 25.6797C129.908 25.6183 129.889 25.5471 129.892 25.4752L129.892 25.4525ZM132.536 24.051C132.536 23.9771 132.557 23.9047 132.598 23.8428C132.638 23.7809 132.696 23.7321 132.764 23.7026C133.243 23.4955 133.721 23.3137 134.195 23.1571C134.244 23.134 134.296 23.1214 134.35 23.1201C134.403 23.1188 134.456 23.1288 134.506 23.1496C134.555 23.1703 134.599 23.2013 134.636 23.2404C134.672 23.2796 134.7 23.326 134.717 23.3767C134.735 23.4273 134.741 23.4811 134.736 23.5344C134.731 23.5877 134.715 23.6393 134.688 23.6858C134.662 23.7324 134.626 23.7728 134.583 23.8044C134.539 23.836 134.49 23.8581 134.438 23.8692C133.983 24.0207 133.521 24.2025 133.067 24.3995C132.974 24.438 132.87 24.4389 132.777 24.4022C132.683 24.3654 132.608 24.2938 132.567 24.2025C132.549 24.1538 132.539 24.1027 132.536 24.051ZM135.377 23.0965C135.377 23.0123 135.405 22.9303 135.457 22.8642C135.509 22.7982 135.583 22.7518 135.665 22.7329C136.165 22.6112 136.67 22.5151 137.18 22.4451C137.229 22.4376 137.28 22.4402 137.328 22.4527C137.376 22.4652 137.422 22.4873 137.461 22.5177C137.501 22.5481 137.534 22.5862 137.559 22.6297C137.583 22.6732 137.599 22.7212 137.604 22.7708C137.617 22.8691 137.591 22.9686 137.532 23.0479C137.472 23.1272 137.384 23.18 137.286 23.195C136.809 23.2632 136.324 23.3541 135.847 23.4677C135.749 23.4885 135.648 23.471 135.563 23.4188C135.479 23.3665 135.417 23.2837 135.392 23.1874L135.377 23.0965Z" 
            fill="#B8BDC9"/>
        <path 
            d="M148.749 23.5515C150.753 25.8114 153.409 27.3943 156.35 28.0821C159.291 28.7699 162.373 28.5289 165.172 27.3921C165.172 27.3921 165.036 22.0894 158.846 20.3547C152.657 18.6199 148.749 23.5515 148.749 23.5515Z" 
            fill="white"/>
        <path 
            d="M148.37 23.5513C148.367 23.4653 148.397 23.3814 148.453 23.3165C148.453 23.2634 152.582 18.2334 158.945 19.9833C165.308 21.7332 165.551 27.3238 165.551 27.3844C165.55 27.463 165.526 27.5397 165.481 27.6045C165.437 27.6693 165.374 27.7193 165.301 27.748C162.425 28.8957 159.266 29.1312 156.253 28.4224C153.239 27.7137 150.516 26.0951 148.453 23.7861C148.397 23.7212 148.367 23.6373 148.37 23.5513ZM164.771 27.1344C164.649 26.0587 163.869 22.1271 158.71 20.7181C153.551 19.3091 150.082 22.6271 149.218 23.5513C151.143 25.6527 153.661 27.1204 156.438 27.7602C159.214 28.4 162.12 28.1818 164.771 27.1344Z" 
            fill="#B8BDC9"/>
        <path 
            d="M144.816 24.226C144.817 24.1493 144.84 24.0744 144.883 24.011C144.926 23.9476 144.988 23.8985 145.059 23.8699C153.225 20.8398 164.853 26.8016 165.345 27.0516C165.434 27.0998 165.5 27.1806 165.53 27.2768C165.559 27.373 165.55 27.477 165.505 27.5667C165.458 27.6546 165.378 27.7205 165.283 27.7503C165.188 27.7801 165.085 27.7713 164.997 27.7258C164.876 27.6652 153.172 21.6655 145.301 24.582C145.255 24.6001 145.206 24.6088 145.156 24.6075C145.106 24.6063 145.058 24.595 145.012 24.5746C144.967 24.5541 144.926 24.5248 144.893 24.4883C144.859 24.4518 144.833 24.409 144.816 24.3623C144.809 24.3171 144.809 24.2711 144.816 24.226Z" 
            fill="#B8BDC9"/>
        <path 
            d="M71.7168 14.256C69.7119 16.515 67.0562 18.0972 64.1152 18.785C61.1742 19.4728 58.0923 19.2323 55.2935 18.0967C55.2935 18.0967 55.4223 12.794 61.6189 11.0593C67.8155 9.32451 71.7168 14.256 71.7168 14.256Z" 
            fill="white"/>
        <path 
            d="M54.9136 18.0955C54.9136 18.0425 55.1257 12.4595 61.5193 10.702C67.9128 8.94456 71.9732 13.9746 72.0111 14.0276C72.0658 14.0951 72.0957 14.1793 72.0957 14.2662C72.0957 14.3531 72.0658 14.4374 72.0111 14.5048C69.9457 16.8122 67.2211 18.429 64.2063 19.1363C61.1914 19.8436 58.032 19.6072 55.156 18.4592C55.083 18.431 55.0205 18.3809 54.9771 18.3158C54.9337 18.2507 54.9115 18.1738 54.9136 18.0955ZM71.2157 14.2549C70.0509 12.9502 68.5468 11.9946 66.8709 11.4943C65.195 10.9941 63.4131 10.969 61.7238 11.4217C56.5953 12.8383 55.8075 16.7699 55.6636 17.838C58.3181 18.8559 61.2161 19.0587 63.9866 18.4204C66.7571 17.7821 69.2741 16.3317 71.2157 14.2549Z" 
            fill="#B8BDC9"/>
        <path 
            d="M54.9141 18.0971C54.9146 18.0281 54.934 17.9607 54.97 17.902C55.006 17.8432 55.0574 17.7954 55.1186 17.7637C55.611 17.5062 67.2391 11.5747 75.4053 14.5821C75.4983 14.6178 75.5736 14.6887 75.6147 14.7794C75.6558 14.8702 75.6595 14.9735 75.625 15.0669C75.5908 15.1613 75.5205 15.2383 75.4296 15.2809C75.3387 15.3235 75.2346 15.3283 75.1402 15.2942C67.2846 12.4004 55.5807 18.3773 55.4443 18.4379C55.3549 18.4829 55.2513 18.4906 55.1562 18.4593C55.0611 18.4281 54.9822 18.3605 54.9368 18.2713C54.9145 18.2161 54.9066 18.1561 54.9141 18.0971Z" 
            fill="#B8BDC9"/>
        <path 
            d="M117.364 17.2477C115.53 14.8477 114.485 11.9384 114.372 8.92C114.26 5.90163 115.085 2.92253 116.735 0.392578C116.735 0.392578 121.94 1.53645 122.432 7.9679C122.924 14.3993 117.364 17.2477 117.364 17.2477Z" 
            fill="white"/>
        <path 
            d="M113.977 8.34597C114.007 5.45234 114.85 2.62542 116.409 0.187355C116.45 0.120897 116.51 0.0690228 116.583 0.0391044C116.655 0.00918606 116.734 0.00274474 116.81 0.0206967C116.871 0.0206967 122.302 1.30092 122.81 7.91418C123.317 14.5274 117.598 17.55 117.507 17.5803C117.432 17.6209 117.344 17.6341 117.26 17.6175C117.176 17.6009 117.1 17.5556 117.045 17.4894C115.074 14.8464 113.999 11.6428 113.977 8.34597ZM116.909 0.831256C115.384 3.22854 114.62 6.03147 114.719 8.87108C114.818 11.7107 115.774 14.4538 117.462 16.7394C118.96 15.8437 120.18 14.5506 120.988 13.0035C121.795 11.4564 122.159 9.71579 122.037 7.97478C121.651 2.67206 117.939 1.14942 116.909 0.831256Z" 
            fill="#B8BDC9"/>
        <path 
            d="M115.644 20.6043C115.642 20.5349 115.661 20.4666 115.697 20.4073C120.037 13.2562 116.409 0.628168 116.371 0.499388C116.343 0.398933 116.356 0.291422 116.407 0.2005C116.458 0.109579 116.543 0.042695 116.644 0.0145676C116.744 -0.0135598 116.852 -0.000627161 116.943 0.0505162C117.033 0.10166 117.1 0.186825 117.128 0.28728C117.28 0.817552 120.916 13.3547 116.371 20.8012C116.327 20.8694 116.262 20.9216 116.186 20.9502C116.111 20.9789 116.028 20.9824 115.95 20.9604C115.872 20.9383 115.803 20.8918 115.753 20.8277C115.704 20.7636 115.676 20.6853 115.674 20.6043L115.644 20.6043Z" 
            fill="#B8BDC9"/>
        <path 
            d="M87.1273 62.4137L72.6375 136.911L70.7402 146.664L167.473 146.189C171.812 146.168 175.66 142.312 177.057 136.588L194.211 66.2533C195.272 61.9056 192.944 57.3857 189.65 57.3857L91.7455 57.4882C89.5818 57.4882 87.6928 59.5084 87.1273 62.4137Z" 
            fill="#00B3C7"/>
        <g opacity="0.5">
            <path 
                d="M87.1273 62.4132L72.6375 136.911L70.7402 146.664L167.473 146.188C171.812 146.168 175.66 142.312 177.057 136.587L194.211 66.2529C195.272 61.9051 192.944 57.3853 189.65 57.3853L91.7455 57.4877C89.5818 57.4877 87.6928 59.5079 87.1273 62.4132Z" 
                fill="#011B34"/>
        </g>
        <path d="M158.195 131.863L147.954 49.3297C147.536 45.949 144.84 43.4248 141.66 43.4371L119.2 43.5108C117.537 43.5149 115.943 44.2238 114.762 45.4778L104.1 56.8122L41.6374 57.14C37.8224 57.1605 34.8884 60.7707 35.3924 64.8316L44.9034 141.112C45.3254 144.488 48.0136 147.009 51.1894 147L160.047 146.787C172.172 147.037 173.328 143.46 173.328 143.46C159.432 146.537 158.195 131.875 158.195 131.867V131.863Z" 
        fill="#00B3C7"/>
        <g opacity="0.5">
            <path 
                d="M111.259 115.345L107.587 119.287L79.3125 93.8522L82.9841 89.9102L111.259 115.345Z" 
                fill="white"/>
            <path 
                d="M106.047 89.0332L110.108 92.6843L84.5216 120.164L80.4648 116.513L106.047 89.0332Z" 
                fill="white"/>
        </g>
    </Icon>
);
export default OpenFile;
