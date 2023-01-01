import { ArrowLongDownIcon, ArrowLongUpIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { Column, TableInstance, TableOptions, usePagination, useSortBy, useTable } from 'react-table'
import { classNames } from '../../util/misc'

type Props<T extends object> = TableOptions<T>

const PAGE_SIZE = 100

export const BasicTable = <T extends object>({ columns, data, ...props }: React.PropsWithRef<Props<T>>) => {
    const defaultColumn: Partial<Column<T>> = React.useMemo(
        () => ({
            minWidth: 100,
        }),
        []
    )

    const { getTableBodyProps, getTableProps, footerGroups, headerGroups, prepareRow, page }: TableInstance<T> =
        useTable<T>(
            {
                columns: columns as any,
                defaultColumn,
                data,
                initialState: { pageSize: PAGE_SIZE },
                ...props,
            },
            useSortBy,
            usePagination
            // useFlexLayout
            // useResizeColumns
        )

    return (
        <div className="h-full overflow-auto bg-slate-100 w-full">
            <table className="border-spacing-0 border-collapse w-full" {...getTableProps()}>
                {/* THEAD */}
                <thead className="w-full">
                    {headerGroups.map((headerGroup) => (
                        // TR
                        <tr {...headerGroup.getHeaderGroupProps()} className="w-full">
                            {headerGroup.headers.map((column, i) => {
                                return (
                                    // TH
                                    <th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        className={classNames(
                                            'font-[500] sticky top-0 py-3 first:pl-8 last:pr-8 border-r-2 border-slate-300 last:border-r-0',
                                            'px-5 m-0 text-left',
                                            column.isSorted ? 'bg-slate-300' : 'bg-slate-200'
                                        )}
                                    >
                                        <div className="flex flex-shrink-0 space-x-2 justify-between items-center">
                                            <span>{column.render('Header')}</span>
                                            {column.isSorted ? (
                                                column.isSortedDesc ? (
                                                    <ArrowLongDownIcon className="!h-3 flex-shrink-0" strokeWidth={2} />
                                                ) : (
                                                    <ArrowLongUpIcon className="!h-3 flex-shrink-0" strokeWidth={2} />
                                                )
                                            ) : (
                                                <ArrowsUpDownIcon
                                                    className="!h-3 flex-shrink-0 text-slate-300"
                                                    strokeWidth={2}
                                                />
                                            )}
                                        </div>
                                        {/* {!isLast && (
                                            <div
                                                {...column.getResizerProps()}
                                                className="inline-block bg-slate-300 w-0.5 h-full absolute right-0 top-0 transform translate-x-[2px] z-[1] touch-none"
                                            />
                                        )} */}
                                    </th>
                                )
                            })}
                        </tr>
                    ))}
                </thead>
                {/* TBODY */}
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row)
                        return (
                            // TR
                            <tr {...row.getRowProps()} key={i}>
                                {row.cells.map((cell, j) => {
                                    return (
                                        // TD
                                        <td
                                            {...cell.getCellProps()}
                                            key={j}
                                            className={classNames(
                                                'px-5 m-0 text-left',
                                                cell.column.isSorted ? 'bg-slate-200' : 'bg-slate-50',
                                                'border-b-2 border-slate-300/50 border-r-2 font-normal text-[11px] text-accent-2 py-3 first:pl-8 last:pr-8 last:border-r-0'
                                            )}
                                        >
                                            {cell.render('Cell')}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                    {footerGroups.map((footerGroup) => (
                        // TR
                        <tr {...footerGroup.getHeaderGroupProps()} className="min-w-auto">
                            {footerGroup.headers.map((column) => {
                                const footer = column.render('Footer')
                                return (
                                    // TD
                                    <td
                                        {...column.getFooterProps()}
                                        className={classNames(
                                            column.isSorted ? 'bg-slate-200' : 'bg-slate-100',
                                            'px-5 m-0 text-left shadow-md',
                                            'border-slate-300/50 border-r-2 font-normal text-[11px] text-accent-2 sticky bottom-0 py-3 last:pr-8 last:border-r-0'
                                        )}
                                    >
                                        {footer}
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
