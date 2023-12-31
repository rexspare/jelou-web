export const GridAdd = ({ width = 18, height = 18, stroke = 'currentColor' }) => (
  <svg
    fill='none'
    width={width}
    height={height}
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      stroke={stroke}
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M14 11v6m-3-3h6M3 7h2a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2Zm10 0h2a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2ZM3 17h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2Z'
    />
  </svg>
)
