export const formatAsCurrency = (amount?: number | null) => {
    if (amount === null || amount === undefined) {
        return ''
    }

    return `£${amount.toLocaleString('en-GB', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    })}`
}
