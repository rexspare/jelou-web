import Avatar from "react-avatar";
import emojiStrip from "emoji-strip";
import toUpper from "lodash/toUpper";

// import MessengerIcon from "../../Icons/MessengerIcon";
// import TwitterColoredIcon from "../../Icons/TwitterColoredIcon";

// const SocialIcon = ({ type }) => {
//     switch (toUpper(type)) {
//         case "TWITTER_REPLIES":
//             return (
//                 <div className="absolute bottom-0 right-0 mr-[0.6rem] -mb-1 border-2 border-transparent rounded-full overflow-hidden">
//                     <TwitterColoredIcon className="fill-current mt-8" height="1rem" width="1rem" />
//                 </div>
//             );
//         default:
//         case "FACEBOOK":
//         case "FACEBOOK_COMMENTS":
//         case "FACEBOOK_FEED":
//             return (
//                 <div className="absolute bottom-0 right-0 mr-[0.6rem] -mb-1 border-2 border-transparent rounded-full overflow-hidden">
//                     <MessengerIcon className="fill-current" height="1rem" width="1rem" />
//                 </div>
//             );
//     }
// };

const PostAvatar = ({ src, name, type, showIcon = false }) => {
    return (
        <div className="relative inline-block">
            <Avatar
                src={src}
                name={emojiStrip(name)}
                className="mr-3 font-semibold"
                fgColor="white"
                size="38"
                round={true}
                color="#2A8BF2"
                textSizeRatio={2}
            />
            {/* {showIcon && <SocialIcon type={type} />} */}
        </div>
    );
};

export default PostAvatar;
