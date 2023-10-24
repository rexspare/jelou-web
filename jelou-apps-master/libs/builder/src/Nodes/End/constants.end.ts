import { StyleNode } from "@builder/helpers/utils";
import { OUTPUT_TYPES } from "@builder/modules/OutputTools/domain/contants.output";

export const DEFAULT_END_COLORS: StyleNode = { bgHeader: "#eff1f4", textColorHeader: "#374361", bg: "#fff" };

export const endColors: Record<OUTPUT_TYPES, StyleNode> = {
    [OUTPUT_TYPES.SUCCESS]: { bgHeader: "#f3fff3", textColorHeader: "#18ba81", bg: "#fff" },
    [OUTPUT_TYPES.FAILED]: { bgHeader: "#FFD0CB", textColorHeader: "#f12b2c", bg: "#FDEFED" },
};

export const bodyColors: Record<OUTPUT_TYPES, string> = {
    [OUTPUT_TYPES.SUCCESS]: "#006757",
    [OUTPUT_TYPES.FAILED]: "#952f23",
};
