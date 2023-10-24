import Icon from "./Icon";

const EyeIcon = (props) => (
    <Icon viewBox="0 0 24 24" className={props.className} width={props.width || 24} height={props.height || 24} fill={props.fill}>
        <path
            d="M21.9236 11.6C19.9036 6.91 16.1036 4 12.0036 4C7.90361 4 4.10361 6.91 2.08361 11.6C2.02854 11.7262 2.00012 11.8623 2.00012 12C2.00012 12.1377 2.02854 12.2738 2.08361 12.4C4.10361 17.09 7.90361 20 12.0036 20C16.1036 20 19.9036 17.09 21.9236 12.4C21.9787 12.2738 22.0071 12.1377 22.0071 12C22.0071 11.8623 21.9787 11.7262 21.9236 11.6ZM12.0036 18C8.83361 18 5.83361 15.71 4.10361 12C5.83361 8.29 8.83361 6 12.0036 6C15.1736 6 18.1736 8.29 19.9036 12C18.1736 15.71 15.1736 18 12.0036 18ZM12.0036 8C11.2125 8 10.4391 8.2346 9.78133 8.67412C9.12353 9.11365 8.61084 9.73836 8.30809 10.4693C8.00534 11.2002 7.92612 12.0044 8.08047 12.7804C8.23481 13.5563 8.61577 14.269 9.17518 14.8284C9.73459 15.3878 10.4473 15.7688 11.2232 15.9231C11.9992 16.0775 12.8034 15.9983 13.5343 15.6955C14.2652 15.3928 14.89 14.8801 15.3295 14.2223C15.769 13.5645 16.0036 12.7911 16.0036 12C16.0036 10.9391 15.5822 9.92172 14.832 9.17157C14.0819 8.42143 13.0645 8 12.0036 8ZM12.0036 14C11.608 14 11.2214 13.8827 10.8925 13.6629C10.5636 13.4432 10.3072 13.1308 10.1558 12.7654C10.0045 12.3999 9.96487 11.9978 10.042 11.6098C10.1192 11.2219 10.3097 10.8655 10.5894 10.5858C10.8691 10.3061 11.2255 10.1156 11.6134 10.0384C12.0014 9.96126 12.4035 10.0009 12.769 10.1522C13.1344 10.3036 13.4468 10.56 13.6665 10.8889C13.8863 11.2178 14.0036 11.6044 14.0036 12C14.0036 12.5304 13.7929 13.0391 13.4178 13.4142C13.0427 13.7893 12.534 14 12.0036 14Z"
            fill={props.fill}
            fillOpacity={props.fillOpacity}
        />
    </Icon>
);

export default EyeIcon;