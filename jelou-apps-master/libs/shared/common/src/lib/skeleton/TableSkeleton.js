import Skeleton from 'react-loading-skeleton';

const TableSkeleton = (props) => {
  const { number } = props;
  const cellStyles = {
    fontSize: '0.813rem',
    whiteSpace: 'nowrap',
    color: '#707C97',
    textAlign: 'left',
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
    paddingBottom: '1rem',
    paddingTop: '1rem',
    lineHeight: '1.25rem',
    fontWeight: 500,
    backgroundColor: '#ffffff',
  };

  let loadingSkeleton = [];

  for (let i = 0; i < Number(number); i++) {
    loadingSkeleton.push(
      <td className="w-44" style={cellStyles} key={i}>
        <Skeleton />
      </td>
    );
  }

  return (
    <tr role="row" className="w-full pr-5">
      {loadingSkeleton}
    </tr>
  );
};
export default TableSkeleton;
