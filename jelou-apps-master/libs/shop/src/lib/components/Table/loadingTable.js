import { DownIcon } from '@apps/shared/icons';
import { headerStyles, Styles } from '../styles/table';
import { TableSkeleton } from '@apps/shared/common';

export function LoadingTable({
  structureColumns,
  getTableProps,
  headerGroups,
  isProduct,
}) {
  const loadingSkeleton = [];
  const numberColums = isProduct
    ? structureColumns.length - 1
    : structureColumns.length;
  for (let i = 0; i < 7; i++) {
    loadingSkeleton.push(<TableSkeleton number={numberColums} key={i} />);
  }

  return (
    <Styles>
      <table {...getTableProps()} className="">
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={i}>
              {headerGroup.headers.map((column, i) => {
                if (column.id === 'selection') return null;
                return (
                  <th
                    {...column.getHeaderProps()}
                    style={{
                      ...column.getHeaderProps().style,
                      ...headerStyles,
                      ...(column.width ? { minWidth: column.width } : {}),
                    }}
                    key={i}
                  >
                    <span className="grid items-center justify-start h-12 grid-flow-col grid-rows-none gap-2">
                      <h3>{column.render('Header')}</h3>
                      {column.render('Header') !== ' ' &&
                        column.render('Header') !== 'Imágen' && (
                          <DownIcon
                            className="ml-1"
                            width="0.938rem"
                            fill="rgba(112, 124, 149, 0.7)"
                          />
                        )}
                    </span>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>{loadingSkeleton}</tbody>
      </table>
    </Styles>
  );
}
