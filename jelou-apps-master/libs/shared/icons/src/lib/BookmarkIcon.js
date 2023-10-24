import Icon from './Icon';

const BookmarkIcon = (props) => (
        <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
        fill="none"
        {...props}
        >
          <path
            stroke="#00B3C7"
            strokeLinecap="round"
            strokeLinejoin="round"
            height="100%"
            width="100%"
            strokeWidth={1.8}
            d="M11.333 1.333v10L8 9.667l-3.333 1.666v-10M3 14.667h10c.92 0 1.667-.747 1.667-1.667V3c0-.92-.746-1.667-1.667-1.667H3c-.92 0-1.667.746-1.667 1.667v10c0 .92.747 1.667 1.667 1.667Z"
          />
        </svg>
);

export default BookmarkIcon;
