import React from 'react'
import { classNames } from '../../../util/misc'

export interface ColorPreviewProps {
    color: string
    backgroundColor: string
    label: string
}

export const ColorPreview: React.FC<ColorPreviewProps> = ({ color, backgroundColor, label }) => {
    return (
        <div className="grid grid-cols-1 gap-2">
            <label className="text-xs text-slate-500">Category preview</label>
            <div
                className={classNames(
                    'p-5 border-[2px] bg-slate-50 px-5 text-xs rounded-lg',
                    'outline-none border-slate-200'
                )}
            >
                <div
                    className="rounded-lg h-10 px-5 flex justify-center items-center shadow-lg"
                    style={{ color, backgroundColor }}
                >
                    <span className="font-bold">{label || 'Enter a label'}</span>
                </div>
            </div>
        </div>
    )
}
