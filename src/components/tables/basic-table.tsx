import React from 'react'
import { TableInstance, TableOptions, usePagination, useSortBy, useTable } from 'react-table'
import { classNames } from '../../util/misc'
import { ArrowLongDownIcon, ArrowLongUpIcon } from '@heroicons/react/24/outline'

type Props<T extends object> = TableOptions<T>

const PAGE_SIZE = 100

export const BasicTable = <T extends object>({ columns, data, ...props }: React.PropsWithRef<Props<T>>) => {
    const { getTableBodyProps, headerGroups, prepareRow, page }: TableInstance<T> = useTable<T>(
        {
            columns: columns as any,
            data,
            initialState: { pageSize: PAGE_SIZE },
            ...props,
        },
        useSortBy,
        usePagination
    )

    return (
        <table>
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th
                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                className={classNames('bg-slate-200 font-[500] sticky top-0 py-3')}
                            >
                                <div className="flex space-x-2 items-center">
                                    <span>{column.render('Header')}</span>
                                    {column.isSorted ? (
                                        column.isSortedDesc ? (
                                            <ArrowLongDownIcon className="h-3" strokeWidth={2} />
                                        ) : (
                                            <ArrowLongUpIcon className="h-3" strokeWidth={2} />
                                        )
                                    ) : null}
                                </div>
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {page.map((row, i) => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()} key={i}>
                            {row.cells.map((cell, j) => {
                                return (
                                    <td
                                        {...cell.getCellProps()}
                                        key={j}
                                        className={classNames(
                                            'border-b border-[#DDDEE3]/30 font-normal text-[11px] text-accent-2 stick top-0 py-3'
                                        )}
                                    >
                                        {cell.render('Cell')}
                                    </td>
                                )
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}
