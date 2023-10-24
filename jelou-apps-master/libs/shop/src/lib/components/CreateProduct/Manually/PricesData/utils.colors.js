const combinations = [
    ["#987001", "#FFECB7"],
    ["#5E8E3E", "#F1FFD8"],
    ["#006757", "#C1E1DC"],
    ["#006986", "#BAE2ED"],
    ["#9C5E91", "#FFE7FB"],
    ["#78261D", "#F5AFA7"],
    ["#FFD970", "#FFFBF1"],
    ["#03C100", "#F3FFF3"],
    ["#209F8B", "#E9F5F3"],
    ["#00A2CF", "#E6F6FA"],
    ["#F71963", "#FFEFF4"],
    ["#EC5F4F", "#FDEFED"],

    ["#FFECB7", "#987001"],
    ["#F1FFD8", "#5E8E3E"],
    ["#C1E1DC", "#006757"],
    ["#BAE2ED", "#006986"],
    ["#FFE7FB", "#9C5E91"],
    ["#F5AFA7", "#78261D"],
    ["#FFFBF1", "#FFD970"],
    ["#F3FFF3", "#03C100"],
    ["#E9F5F3", "#209F8B"],
    ["#E6F6FA", "#00A2CF"],
    ["#FFEFF4", "#F71963"],
    ["#FDEFED", "#EC5F4F"],
];

export const getColors = () => {
    const index = Math.floor(Math.random() * combinations.length);
    return combinations[index];
};

export const initDefaultTags = (defaultTags) => {
    if (!defaultTags || (defaultTags && defaultTags.length === 0)) return [];

    return defaultTags.map((tag) => {
        const [backgroundColor, color] = getColors();
        return { name: tag, backgroundColor, color };
    });
};
