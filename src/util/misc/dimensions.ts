import { useCallback, useLayoutEffect, useState } from 'react'

export interface DimensionObject {
    width: number
    height: number
    top: number
    left: number
    x: number
    y: number
    right: number
    bottom: number
}

export type UseDimensionsHook = [any, DimensionObject, HTMLElement | null]

export interface UseDimensionsArgs {
    liveMeasure?: boolean
}

function getDimensionObject(node: HTMLElement): DimensionObject {
    const rect = node.getBoundingClientRect()

    return {
        width: rect.width,
        height: rect.height,
        top: 'x' in rect ? rect.x : rect.top,
        left: 'y' in rect ? rect.y : rect.left,
        x: 'x' in rect ? rect.x : rect.left,
        y: 'y' in rect ? rect.y : rect.top,
        right: rect.right,
        bottom: rect.bottom,
    }
}

function useDimensions({ liveMeasure = true }: UseDimensionsArgs = {}): UseDimensionsHook {
    const [dimensions, setDimensions] = useState({})
    const [node, setNode] = useState<HTMLElement | null>(null)

    const ref = useCallback((node_: any) => {
        setNode(node_)
    }, [])

    useLayoutEffect(() => {
        if (node) {
            const measure = () => window.requestAnimationFrame(() => setDimensions(getDimensionObject(node)))
            measure()

            if (liveMeasure) {
                window.addEventListener('resize', measure)
                window.addEventListener('scroll', measure)

                return () => {
                    window.removeEventListener('resize', measure)
                    window.removeEventListener('scroll', measure)
                }
            }
        }
    }, [node, liveMeasure])

    return [ref, dimensions as DimensionObject, node]
}

export default useDimensions
