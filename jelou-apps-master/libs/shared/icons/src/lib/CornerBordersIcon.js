import React from "react";

import Icon from "./Icon";

const CornerBordersIcon = (props) => {
    return(
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={props.width || "18"}
            height={props.height || "17"}
            viewBox="0 0 18 17"
            fill="none">
                <path
                    d="M15.5615 15.7421H15.2065V16.0971H15.5615V15.7421ZM16.2715 15.7421V16.0971H16.6265V15.7421H16.2715ZM16.2715 1.71004V1.35504H15.9165V1.71004H16.2715ZM16.71 1.71004V2.06504H17.065V1.71004H16.71ZM16.71 1.00004H17.065V0.645041H16.71V1.00004ZM1.09087 1.00004V0.645041H0.735871V1.00004H1.09087ZM1.09087 1.71004H0.735871V2.06504H1.09087V1.71004ZM15.5615 1.71004H15.9165V1.35504H15.5615V1.71004ZM15.9165 15.7421V15.3871H15.2065V15.7421H15.9165ZM16.2715 15.3871H15.5615V16.0971H16.2715V15.3871ZM15.9165 15.3871V15.7421H16.6265V15.3871H15.9165ZM15.9165 1.71004V15.3871H16.6265V1.71004H15.9165ZM16.355 1.35504H16.2715V2.06504H16.355V1.35504ZM16.71 1.35504H16.355V2.06504H16.71V1.35504ZM16.355 1.00004V1.71004H17.065V1.00004H16.355ZM16.355 1.35504H16.71V0.645041H16.355V1.35504ZM16.2715 1.35504H16.355V0.645041H16.2715V1.35504ZM15.5615 1.35504H16.2715V0.645041H15.5615V1.35504ZM1.44587 1.35504H15.5615V0.645041H1.44587V1.35504ZM1.09087 1.35504H1.44587V0.645041H1.09087V1.35504ZM1.44587 1.71004V1.00004H0.735871V1.71004H1.44587ZM1.44587 1.35504H1.09087V2.06504H1.44587V1.35504ZM15.5615 1.35504H1.44587V2.06504H15.5615V1.35504ZM15.9165 15.3871V1.71004H15.2065V15.3871H15.9165Z"
                    fill={props.className || "#1D262C"}
                />
        </svg>
    );
};

export default CornerBordersIcon;