type Arg = string | null | undefined | boolean

export const classNames = (...args: Arg[]) => {
    return args.filter(Boolean).join(' ')
}
