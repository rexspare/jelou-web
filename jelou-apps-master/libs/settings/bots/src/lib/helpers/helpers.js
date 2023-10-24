import { Facebook, Instagram, MailIcon, SmsIcon, Twitter, WebIcon, WhatsappColoredIcon } from "@apps/shared/icons";

const botTypeicon = {
    Facebook: <Facebook width="1.2rem" height="1.2rem" />,
    Facebook_Feed: <Facebook width="1.2rem" height="1.2rem" />,
    Whatsapp: <WhatsappColoredIcon width="1.2rem" height="1.2rem" />,
    Twitter: <Twitter width="1.2rem" height="1.2rem" />,
    Twitter_replies: <Twitter width="1.2rem" height="1.2rem" />,
    Instagram: <Instagram width="1.2rem" height="1.2rem" />,
    Widget: <WebIcon width="1.2rem" height="1.2rem" />,
    email: <MailIcon width="1.2rem" height="1.2rem" />,
    Sms: <SmsIcon width="1.2rem" height="1.2rem" />,
};

const getTimeInSeconds = (value, format) => {
    switch (format) {
        case "days":
            return value * 86400;
        case "hours":
            return value * 3600;
        case "minutes":
            return value * 60;
        case "seconds":
            return value;
        default:
            return value;
    }
};

const getTimeByUnity = (seconds, unity) => {
    switch (unity) {
        case "hours":
            return seconds / 3600;
        case "minutes":
            return seconds / 60;
        case "days":
            return seconds / 86400;
        default:
            return seconds;
    }
};

const getTypeIcon = (botType) => {
    switch (botType) {
        case "Whatsapp":
            return botTypeicon[botType];
        case "Facebook":
            return botTypeicon[botType];
        case "Facebook_Feed":
            return botTypeicon[botType];
        case "Twitter":
            return botTypeicon[botType];
        case "Twitter_replies":
            return botTypeicon[botType];
        case "Instagram":
            return botTypeicon[botType];

        default:
            return botTypeicon[botType];
    }
};

const getTitleBotColor = (botType) => {
    switch (botType) {
        case "Whatsapp":
            return "text-green-1000";
        case "Facebook":
            return "text-blue-960";
        case "Facebook_Feed":
            return "text-blue-960";
        case "Twitter":
            return "text-teal-960";
        case "Twitter_replies":
            return "text-teal-960";
        case "Instagram":
            return "text-purple-960";
        case "Widget":
            return "text-blue-650";
        case "Sms":
            return "text-[#0072F0]";
        case "email":
            return "text-[#2091A0]";
        default:
            break;
    }
};

export { getTitleBotColor, getTypeIcon, getTimeInSeconds, getTimeByUnity };
