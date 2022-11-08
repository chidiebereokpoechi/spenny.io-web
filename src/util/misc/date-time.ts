export const getTimestamp = (date?: Date): number => {
    const milliseconds = date ? date.getTime() : Date.now()
    return Math.floor(milliseconds / 1000)
}
