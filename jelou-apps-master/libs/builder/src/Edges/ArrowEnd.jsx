export const ArrowEndMarkers = ({ color, id }) => {
  return (
  <svg style={{ position: 'absolute', top: 0, left: 0 }}>
    <defs>
      <marker
        id={id}
        viewBox='0 0 40 40'
        markerHeight={25}
        markerWidth={25}
        refX={6}
        refY={6.80}
      >
        <svg
          viewBox='0 0 10 10'
          width={8}
          height={12}
          fill='none'
        >
          <path
            d='M1.761 11.697c1.984-1.654 3.955-3.294 5.94-4.948.399-.339.399-1.159 0-1.498C5.715 3.597 3.744 1.957 1.76.303 1.334-.065.728-.135.301.303-.058.67-.14 1.433.3 1.8L6.24 6.75V5.251C4.255 6.905 2.285 8.559.3 10.199c-.427.367-.372 1.13 0 1.498.428.439 1.034.368 1.461 0Z'
            fill={color}
          />
        </svg>
      </marker>
    </defs>
  </svg>
  );
}
