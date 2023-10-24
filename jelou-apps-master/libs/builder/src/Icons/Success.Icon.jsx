export const SuccessIcon = ({ width = 18, height = 18, color = 'currentColor' }) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} fill='none'>
    <path
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='1.6'
      d='m6.5 9 1.667 1.667L11.5 7.333M16.5 9a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z'
    />
  </svg>
)

export const FailedIcon = ({ width = 22, height = 22, color = 'currentColor' } = {}) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    xmlSpace='preserve'
    viewBox='0 0 22 22'
    width={width}
    height={height}
  >
    <path
      d='M16.8 5.2c-1.6-1.6-3.6-2.4-5.8-2.4-2.2 0-4.3.9-5.8 2.4C3.6 6.7 2.8 8.8 2.8 11c0 2.2.9 4.3 2.4 5.8 1.6 1.6 3.6 2.4 5.8 2.4 2.2 0 4.3-.9 5.8-2.4 1.6-1.6 2.4-3.6 2.4-5.8.1-2.2-.8-4.3-2.4-5.8zm-1 10.5c-1.2 1.2-2.8 2-4.6 2-1.8.1-3.5-.6-4.8-1.8-1.3-1.2-2-2.9-2.1-4.7 0-1.8.6-3.5 1.9-4.8 1.3-1.3 2.9-2 4.7-2 3.7 0 6.7 3 6.7 6.7.1 1.6-.6 3.3-1.8 4.6z'
      fill={color}
    />
    <path
      d='M14.2 8.5c-.2-.3-.5-.5-.8-.4-.2 0-.3.1-.5.3L11.3 10 9.6 8.3C9.3 8 9 8 8.7 8.1c-.4.1-.5.5-.5.8 0 .2.1.3.3.5l1.6 1.6-1.7 1.7c-.3.2-.3.6-.2.9.1.3.5.5.8.4.2 0 .3-.1.5-.3l1.6-1.6 1.7 1.7c.2.2.4.2.6.2.1 0 .2 0 .3-.1.3-.1.5-.5.4-.8 0-.2-.1-.3-.3-.5L12.2 11l1.7-1.7c.4-.1.4-.5.3-.8z'
      fill={color}
    />
  </svg>
)
