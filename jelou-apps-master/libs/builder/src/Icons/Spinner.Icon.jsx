export const SpinnerIcon = ({ width = 20, heigth = 20, color = 'currentColor' }) => {
  return (
    <svg
      width={width}
      heigth={heigth}
      className='animate-spin'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
    >
      <circle className='opacity-25' cx='12' cy='12' r='10' stroke={color} strokeWidth='4' />
      <path
        className='opacity-75'
        fill='currentColor'
        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
      />
    </svg>
  )
}

export const ArrowLoadingIcon = ({ width = 16, height = 16, color = 'currentColor' } = {}) => (
  <svg width={width} height={height} fill='none' viewBox='0 0 16 16'>
    <path
      d='M10.935 3.07c-.7-.4-1.42-.64-2.19-.72-1.95-.19-3.63.41-4.93 1.86-1.48 1.64-1.91 3.59-1.23 5.69.69 2.11 2.18 3.43 4.35 3.89 3.19.67 6.26-1.42 6.86-4.61.06-.33.08-.68.1-1.02.02-.41.28-.69.66-.69.37.01.63.3.63.7a7.106 7.106 0 0 1-5.64 6.88c-3.9.83-7.77-1.79-8.44-5.73a7.081 7.081 0 0 1 5.68-8.19c1.77-.33 3.43-.02 4.98.9.09.06.14.05.22-.03.25-.26.51-.51.77-.77.21-.21.45-.29.74-.18.26.1.4.34.4.66v2.45c0 .44-.26.7-.7.7h-2.45c-.31 0-.54-.11-.66-.4-.12-.29-.03-.54.19-.75.2-.18.42-.41.66-.64Z'
      fill={color}
      stroke={color}
    />
  </svg>
)
