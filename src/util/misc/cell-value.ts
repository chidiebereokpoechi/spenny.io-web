import { Cell } from 'react-table'

export const cellValue = <T extends object>(cell: Cell<T>): T => {
    return cell.row.original
}
