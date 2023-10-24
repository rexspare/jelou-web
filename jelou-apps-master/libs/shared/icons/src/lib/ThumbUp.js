import Icon from './Icon';

const ThumbUp = (props) => (
        <Icon viewBox="0 0 20 19" className={props.className} width={props.width} height={props.height} fill="none">
          <path
            stroke="#727C94"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            strokeDasharray="60"
            height="100%"
            width="100%"
            d="M12 8h4.764a2 2 0 0 1 1.789 2.894l-3.5 7A2 2 0 0 1 13.263 19H9.247c-.163 0-.326-.02-.485-.06L5 18m7-10V3a2 2 0 0 0-2-2h-.096c-.5 0-.904.405-.904.905 0 .714-.211 1.412-.608 2.006L5 9v9m7-10h-2M5 18H3a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h2.5"
          />
        </Icon>
);

export default ThumbUp;
