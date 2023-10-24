import Icon from "./Icon"

const UploadIcon = (props) => (
  <Icon viewBox="0 0 20 20" className={props.className} width={props.width} height={props.height} fill={props.fill}>
     <path
      stroke="#727C94"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M1 13v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-8L9 1m0 0L5 5m4-4v12"
    />
  </Icon>
)
export default UploadIcon
