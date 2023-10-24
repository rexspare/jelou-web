import React from "react";

import Icon from "./Icon";

const ReasonIcon = (props) => (
    <Icon viewBox="0 0 294 251" className={props.className} width={props.width} height={props.height} fill={props.fill}>
        <path
            d="M263.424 92.2522C251.641 80.451 237.167 72.3203 221.393 68.4255V28.2237C221.393 17.7744 212.903 9.24887 202.467 9.21412L23.705 8.65186C23.686 8.65186 23.6639 8.65186 23.645 8.65186C18.5848 8.65186 13.8273 10.6198 10.2435 14.1987C6.64392 17.7902 4.66272 22.5726 4.66272 27.6614V168.395C4.66272 178.875 13.1806 187.404 23.6482 187.404H46.6213V223.528C46.6213 227.139 48.776 230.367 52.1074 231.747C53.2147 232.205 54.3694 232.429 55.5177 232.429C57.827 232.429 60.089 231.526 61.7926 229.82L99.1704 192.395C100 191.564 101.101 191.106 102.275 191.106H116.389C120.863 201.78 127.409 211.585 135.829 220.015C152.871 237.079 175.529 246.477 199.628 246.477C223.727 246.477 246.385 237.079 263.427 220.015C280.469 202.952 289.855 180.265 289.855 156.135C289.855 132.005 280.466 109.316 263.424 92.2522ZM102.268 175.312C96.8832 175.312 91.8198 177.413 88.0119 181.226L62.392 206.878V184.561C62.392 177.419 56.5904 171.61 49.4574 171.61H23.6419C21.872 171.61 20.4303 170.167 20.4303 168.395V27.6614C20.4303 26.499 21.0234 25.7377 21.3736 25.3839C21.7238 25.0333 22.4872 24.4458 23.6387 24.4458C23.6419 24.4458 23.645 24.4458 23.6482 24.4458L202.41 25.008C204.174 25.0143 205.613 26.4548 205.613 28.2237V65.9932C203.625 65.8637 201.628 65.7911 199.618 65.7911C191.454 65.7911 183.46 66.8714 175.787 68.9625C175.645 68.9562 175.503 68.9499 175.358 68.9499C171.194 68.9499 167.03 68.9499 162.865 68.9499C152.918 68.9499 142.971 68.9499 133.027 68.9499C120.945 68.9499 108.859 68.9499 96.7759 68.9499C86.3651 68.9499 75.9575 68.9499 65.5468 68.9499C60.4581 68.9499 55.3537 68.8298 50.265 68.9499C50.1925 68.953 50.1199 68.9499 50.0473 68.9499C45.9209 68.9499 41.9711 72.5825 42.1604 76.8468C42.3528 81.127 45.6243 84.7438 50.0473 84.7438C54.2117 84.7438 58.376 84.7438 62.5403 84.7438C72.4873 84.7438 82.4343 84.7438 92.3782 84.7438C104.461 84.7438 116.547 84.7438 128.63 84.7438C133.854 84.7438 139.078 84.7438 144.303 84.7438C141.347 87.0497 138.51 89.5546 135.816 92.2522C129.488 98.5887 124.219 105.702 120.09 113.375H65.5531C60.4644 113.375 55.36 113.255 50.2713 113.375C50.1988 113.378 50.1262 113.375 50.0537 113.375C45.9272 113.375 41.9774 117.008 42.1667 121.272C42.3592 125.552 45.6307 129.169 50.0537 129.169H113.471C110.793 137.786 109.398 146.852 109.398 156.135C109.398 162.661 110.089 169.08 111.43 175.312H102.268ZM252.269 208.846C238.208 222.928 219.509 230.68 199.622 230.68C179.734 230.68 161.039 222.925 146.975 208.846C141.668 203.533 137.261 197.557 133.832 191.106C131.169 186.1 129.1 180.805 127.649 175.312C126.018 169.131 125.169 162.699 125.169 156.135C125.169 136.222 132.914 117.504 146.975 103.422C161.036 89.343 179.734 81.5881 199.622 81.5881C201.634 81.5881 203.631 81.6703 205.616 81.8282C211.014 82.2546 216.298 83.256 221.39 84.8101C232.927 88.3227 243.498 94.6434 252.269 103.425C266.333 117.504 274.074 136.226 274.074 156.139C274.074 176.052 266.333 194.767 252.269 208.846Z"
            fill="#7F809C"
            fillOpacity={props.fillOpacity}
        />
        <path
            d="M178.788 137.398C178.567 135.986 178.958 139.192 178.816 137.413C178.772 136.88 178.747 136.346 178.737 135.812C178.728 135.209 178.74 134.608 178.775 134.005C178.788 133.781 178.806 133.56 178.825 133.335C178.939 132.006 178.857 133.364 178.728 133.888C178.977 132.89 179.097 131.87 179.381 130.878C179.519 130.385 179.674 129.899 179.844 129.418C179.939 129.144 180.053 128.875 180.147 128.597C180.444 127.725 179.27 130.477 179.948 129.074C180.393 128.155 180.854 127.248 181.384 126.373C181.649 125.934 181.93 125.508 182.217 125.085C182.34 124.905 182.469 124.725 182.595 124.545C183.482 123.262 181.693 125.615 182.299 124.917C182.98 124.134 183.64 123.347 184.375 122.611C184.744 122.242 185.119 121.885 185.507 121.534C185.728 121.335 185.955 121.136 186.182 120.943C186.409 120.751 187.492 119.907 186.432 120.713C185.39 121.506 186.791 120.463 187.088 120.261C187.523 119.961 187.968 119.67 188.419 119.393C189.391 118.792 190.397 118.243 191.429 117.747C191.637 117.646 192.057 117.516 192.255 117.365C192.164 117.434 190.403 118.091 191.618 117.639C192.041 117.481 192.463 117.32 192.889 117.175C194.035 116.783 195.205 116.461 196.385 116.205C196.905 116.092 197.426 115.994 197.953 115.905C199.861 115.586 196.502 116.013 197.893 115.912C199.114 115.823 200.322 115.728 201.549 115.735C202.622 115.741 203.679 115.833 204.748 115.912C206.139 116.016 202.78 115.586 204.688 115.908C205.288 116.009 205.884 116.13 206.477 116.265C207.584 116.518 208.682 116.834 209.755 117.21C210.181 117.358 210.6 117.551 211.029 117.69C208.748 116.957 210.812 117.62 211.414 117.927C212.358 118.407 213.269 118.941 214.149 119.528C214.588 119.822 215.001 120.157 215.443 120.448C215.329 120.372 213.96 119.212 214.913 120.069C215.14 120.271 215.373 120.467 215.597 120.672C216.506 121.499 217.355 122.397 218.14 123.341C218.301 123.534 218.446 123.752 218.62 123.932C217.396 122.665 218.008 123.117 218.298 123.556C218.677 124.121 219.061 124.68 219.412 125.265C219.718 125.776 220.008 126.298 220.282 126.828C220.437 127.132 220.569 127.447 220.733 127.744C221.147 128.493 220.453 127.03 220.453 127.027C220.828 128.332 221.38 129.567 221.68 130.903C221.752 131.222 222.084 133.219 221.891 131.851C221.711 130.565 221.913 132.435 221.929 132.821C221.951 133.411 221.945 134.005 221.916 134.599C221.901 134.937 221.857 135.278 221.841 135.616C221.79 136.643 222.163 134.046 221.907 135.054C221.588 136.32 221.311 137.562 220.894 138.806C220.822 139.021 220.459 139.858 220.907 138.825C221.38 137.739 220.904 138.8 220.774 139.065C220.472 139.688 220.14 140.297 219.784 140.888C219.472 141.409 219.121 141.902 218.79 142.407C218.348 143.08 218.159 142.644 219.077 142.044C218.897 142.161 218.718 142.471 218.572 142.635C218.175 143.083 217.758 143.513 217.323 143.92C217.077 144.151 216.815 144.363 216.566 144.593C215.528 145.554 217.569 143.917 216.774 144.439C214.72 145.784 212.641 146.991 210.455 148.109C205.559 150.617 200.767 153.571 197.293 157.933C193.167 163.11 190.873 169.039 190.801 175.717C190.757 179.848 194.46 183.803 198.688 183.614C202.997 183.421 206.527 180.145 206.575 175.717C206.581 175.098 206.628 174.485 206.654 173.869C206.682 173.174 207.089 172.962 206.534 174.633C206.619 174.377 206.638 174.024 206.688 173.765C206.916 172.637 207.408 171.591 207.66 170.486C207.266 172.204 207.061 171.803 207.37 171.219C207.499 170.972 207.616 170.72 207.745 170.473C208.007 169.984 208.288 169.503 208.591 169.036C209.032 168.35 210.146 167.415 208.575 168.938C208.972 168.553 209.294 168.069 209.673 167.662C210.452 166.822 211.304 166.073 212.165 165.321C212.654 164.895 213.077 164.983 211.597 165.751C211.837 165.628 212.096 165.384 212.31 165.236C212.856 164.851 213.414 164.487 213.985 164.137C216.209 162.772 218.598 161.701 220.888 160.454C226.57 157.355 231.529 152.932 234.4 147.035C237.589 140.481 238.545 133.329 236.782 126.212C233.778 114.083 223.715 104.505 211.786 101.315C200.82 98.3803 188.315 100.203 178.955 106.757C173.768 110.387 169.153 115.119 166.433 120.909C163.304 127.574 162.465 134.343 163.594 141.599C163.878 143.428 165.695 145.427 167.219 146.318C168.91 147.31 171.402 147.727 173.295 147.114C175.204 146.495 177.046 145.31 178.008 143.485C179.046 141.488 179.131 139.615 178.788 137.398Z"
            fill="#7F809C"
            fillOpacity={props.fillOpacity}
        />
        <path
            d="M200.606 211.004C206.591 211.004 211.443 206.146 211.443 200.153C211.443 194.161 206.591 189.303 200.606 189.303C194.621 189.303 189.769 194.161 189.769 200.153C189.769 206.146 194.621 211.004 200.606 211.004Z"
            fill="#7F809C"
            fillOpacity={props.fillOpacity}
        />
    </Icon>
);
export default ReasonIcon;
