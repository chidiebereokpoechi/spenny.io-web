import React from 'react'

export interface ColorPreviewProps {
    color: string
    backgroundColor: string
    label: string
}

export const ColorPreview: React.FC<ColorPreviewProps> = ({ color, backgroundColor, label }) => {
    return (
        <div
            className="rounded-lg h-10 px-5 flex justify-center items-center shadow-lg"
            style={{ color, backgroundColor }}
        >
            <span className="font-bold">{label || 'This is what the category will look like'}</span>
        </div>
    )
}
