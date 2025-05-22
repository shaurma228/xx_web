import React from 'react'
import Circle from "@/components/Circle"

interface Props {
    color: 'red' | 'orange' | 'yellow' | 'green' | 'blue'
    header: string
    description: string
}

function Action({ color, header, description }: Props) {
    return (
        <div className="border border-gray-300 rounded-4xl shadow-md p-4 flex items-center gap-4 w-fit">
            <Circle color={color} size={10} />
            <div>
                <div className="text-xl">{header}</div>
                <div className="">{description}</div>
            </div>
        </div>
    )
}

export default Action