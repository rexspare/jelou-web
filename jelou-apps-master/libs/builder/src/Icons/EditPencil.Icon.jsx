export const EditPencil = ({ fill = 'currentColor', width = 19, height = 19 }) => (
  <svg
    fill='none'
    width={width}
    height={height}
    viewBox='0 0 19 19'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M7.833 3.667H3.667C2.747 3.667 2 4.413 2 5.333V14.5c0 .92.746 1.667 1.667 1.667h9.166c.92 0 1.667-.747 1.667-1.667v-4.167m-1.178-7.845a1.667 1.667 0 1 1 2.357 2.357L8.523 12H6.167V9.643l7.155-7.155Z'
      stroke={fill}
      strokeWidth={1.5}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)
