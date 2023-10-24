import { useState } from "react";

import { CreatedTool } from "../../../types.toolkits";
import { testHexColor } from "../../../utils.tools";

export type Color = {
    hex: string;
};

type UseColors = {
    errors: {
        principalColorError: boolean;
        complementaryColorError: boolean;
    };
    display: {
        displayPrincipalPicker: boolean;
        displayComplementaryPicker: boolean;
    };
    colors: {
        principalColor: string;
        complementaryColor: string;
    };
    handlers: {
        handleChangePrincipalColor: (color: React.ChangeEvent<HTMLTextAreaElement> & Color) => void;
        handlePrincipalClick: () => void;
        handlePrincipalClose: () => void;
        handleChangeComplementaryColor: (color: React.ChangeEvent<HTMLTextAreaElement> & Color) => void;
        handleComplementaryClick: () => void;
        handleComplementaryClose: () => void;
    };
};

type Props = {
    createdTool: CreatedTool;
    handleAddData: (tool: Partial<CreatedTool>) => void;
};

export const useColors = ({ createdTool, handleAddData }: Props): UseColors => {
    const [displayPrincipalPicker, setDisplayPrincipalPicker] = useState(false);
    const [principalColor, setPrincipalColor] = useState(createdTool?.principalColor ?? "#E6F6F9");
    const [principalColorError, setPrincipalColorError] = useState(false);

    const [displayComplementaryPicker, setDisplayComplementaryPicker] = useState(false);
    const [complementaryColor, setComplementaryColor] = useState(createdTool?.complementaryColor ?? "#00B3C7");
    const [complementaryColorError, setComplementaryColorError] = useState(false);

    const handleChangePrincipalColor = (color: React.ChangeEvent<HTMLTextAreaElement> & Color): void => {
        setPrincipalColorError(false);

        if (color.hex) {
            setPrincipalColor(color.hex);
            handleAddData({ principalColor: color.hex });
            return;
        }

        if (!testHexColor(color.target.value)) {
            setPrincipalColorError(true);
        }

        if (color.target.value !== "") {
            setPrincipalColor(color.target.value);
            handleAddData({ principalColor: color.target.value });
        }
    };

    const handlePrincipalClick = (): void => {
        setDisplayPrincipalPicker(!displayPrincipalPicker);
    };

    const handlePrincipalClose = (): void => {
        setDisplayPrincipalPicker(false);
    };

    const handleChangeComplementaryColor = (color: React.ChangeEvent<HTMLTextAreaElement> & Color): void => {
        setComplementaryColorError(false);
        if (color.hex) {
            setComplementaryColor(color.hex);
            handleAddData({ complementaryColor: color.hex });
            return;
        }

        if (!testHexColor(color.target.value)) {
            setComplementaryColorError(true);
        }

        if (color.target.value !== "") {
            setComplementaryColor(color.target.value);
            handleAddData({ complementaryColor: color.target.value });
        }
    };

    const handleComplementaryClick = (): void => {
        setDisplayComplementaryPicker(!displayComplementaryPicker);
    };

    const handleComplementaryClose = (): void => {
        setDisplayComplementaryPicker(false);
    };

    return {
        errors: {
            principalColorError,
            complementaryColorError,
        },
        display: {
            displayPrincipalPicker,
            displayComplementaryPicker,
        },
        colors: {
            principalColor,
            complementaryColor,
        },
        handlers: {
            handleChangePrincipalColor,
            handlePrincipalClick,
            handlePrincipalClose,
            handleChangeComplementaryColor,
            handleComplementaryClick,
            handleComplementaryClose,
        },
    };
};
