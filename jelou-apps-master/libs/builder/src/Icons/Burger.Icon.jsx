export const BurgerIcon = ({ width = 18, height = 12, color = 'currentColor' } = {}) => (
  <svg
    width={width}
    height={height}
    viewBox='0 0 18 12'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <rect width={18} height={2} rx={1} fill={color} />
    <rect y={5} width={18} height={2} rx={1} fill={color} />
    <rect y={10} width={18} height={2} rx={1} fill={color} />
  </svg>
)
