export const SortIcon = ({ width = 20, height = 20, stroke = '#727C94' }) => (
  <svg
    fill='none'
    width={width}
    height={height}
    viewBox='0 0 20 20'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M2.5 3.5a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1v1.92a1 1 0 0 1-.293.706l-5.247 5.248a1 1 0 0 0-.293.707v2.086L8.333 17.5v-5.42a1 1 0 0 0-.293-.706L2.793 6.126A1 1 0 0 1 2.5 5.42V3.5Z'
      stroke={stroke}
      strokeWidth={1.6}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)
