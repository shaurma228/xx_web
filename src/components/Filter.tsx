'use client'

import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import Image from "next/image"

const FILTERS = [
    { id: "red", label: "Красный" },
    { id: "orange", label: "Оранжевый" },
    { id: "green", label: "Зелёный" },
]

interface FilterProps {
    activeFilters: string[]
    setActiveFilters: React.Dispatch<React.SetStateAction<string[]>>
}

function Filter({ activeFilters, setActiveFilters }: FilterProps) {
    const handleChange = (id: string) => {
        setActiveFilters((prev: string[]) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild={true}>
                <Button variant="outline" className="h-[50] w-[50] rounded-full p-0">
                    <Image src="/funnel.svg" alt="Filter icon" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={cn("z-[1050] mr-4")}>
                <div>
                    {FILTERS.map((filter) => (
                        <div className="flex items-center space-x-2" key={filter.id}>
                            <Checkbox
                                id={filter.id}
                                checked={activeFilters.includes(filter.id)}
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
