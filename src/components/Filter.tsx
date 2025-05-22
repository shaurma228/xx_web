'use client'

import React, {useState} from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Funnel } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils" // Убедитесь, что у вас есть утилита для объединения классов

const FILTERS = [
    { id: "1", label: "Красный" },
    { id: "2", label: "Оранжевый" },
    { id: "3", label: "Зелёный" },
]

function Filter() {
    const [selected, setSelected] = useState<string[]>([])

    const handleChange = (id: string) => {
        setSelected(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild={true}>
                <Button variant="outline" size="icon">
                    <Funnel/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={cn("z-[1050] ml-4")}>
                <div>
                    {FILTERS.map(filter => (
                        <div className="flex items-center space-x-2" key={filter.id}>
                            <Checkbox
                                id={filter.id}
                                checked={selected.includes(filter.id)}
                                onCheckedChange={() => handleChange(filter.id)}
                            />
                            <label htmlFor={filter.id}>{filter.label}</label>
                        </div>
                    ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default Filter
