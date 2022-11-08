import { camelCase, startCase } from 'lodash'

export const titleCase = (str: string) => {
    return startCase(camelCase(str))
}
