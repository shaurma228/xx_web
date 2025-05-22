import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface Props {
    color: 'red' | 'orange' | 'yellow' | 'green' | 'blue'
    header: string
    description: string
}

function Action({ color, header, description }: Props) {
    return (
        <Dialog>
            <DialogTrigger>
                <div
                    className="w-32 h-32 rounded-full opacity-50"
                    style={{ backgroundColor: color }}
                />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{header}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default Action