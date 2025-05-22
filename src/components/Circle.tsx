import React from 'react'

interface Props {
    color: 'red' | 'blue' | 'green' | 'yellow' | 'orange'
    size: number
}

function Circle({ color, size }: Props) {
    return (
        <div
            className={`rounded-full opacity-50 h-${size} w-${size}`}
            style={{ backgroundColor: color }}
        />
    )
}

export default Circle