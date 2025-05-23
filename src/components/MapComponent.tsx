'use client'

import React, { useState, useEffect } from "react"
import { MapContainer, TileLayer, CircleMarker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
// import Filter from "@/components/Filter"
import { Button} from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import axios from "axios"

interface Event {
    id: string
    position: [number, number]
    color: string
    radius: number | null
    titles: string[]
    statuses: string[]
    descriptions: string[]
}

const startTopLeft: [number, number] = [55.751244, 37.618423] // Тут задать стартовые координаты
const startBottomRight: [number, number] = [55.751244, 37.618423]
const apiUrl = process.env.NEXT_PUBLIC_API_URL

function MapComponent() {
    const [topLeft, setTopLeft] = useState<[number, number]>(startTopLeft)
    const [bottomRight, setBottomRight] = useState<[number, number]>(startBottomRight)
    const [bounds, setBounds] = useState<[[number, number], [number, number]]>([topLeft, bottomRight])
    const [events, setEvents] = useState<Event[]>([])
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

    function postBounds(boundsData: [[number, number], [number, number]]) {
        axios.post(`${apiUrl}/api/postBounds`, boundsData)
            .then(response => console.log('Bounds sent successfully:', response.data))
            .catch(error => console.error('Error sending bounds:', error))
    }

    async function checkEvents() {
        axios.get(`${apiUrl}/api/checkEvents`)
            .then(response => {
                console.log('Events checked successfully:', response.data)
                if (response.data) {
                    postBounds(response.data)
                }
            })
            .catch(error => console.error('Error checking events:', error))
    }
    
    async function fetchEvents() {
        axios.get(`${apiUrl}/api/getEvents`)
            .then(response => {
                setEvents(response.data)
                console.log(events)
            })
            .catch(error => console.error('Error fetching actions:', error))
    }

    function MapEventHandler() {
        useMapEvents({
            moveend: (event) => {
                const map = event.target
                const currentBounds = map.getBounds()
                setTopLeft([currentBounds.getNorthEast().lat, currentBounds.getNorthEast().lng])
                setBottomRight([currentBounds.getSouthWest().lat, currentBounds.getSouthWest().lng])
                setBounds([topLeft, bottomRight])
                // console.log(topLeft[0] - bottomRight[0], topLeft[1] - bottomRight[1])
                postBounds(bounds)
            },
        })
        return null
    }

    useEffect(() => {
        fetchEvents()
    })

    useEffect(() => {
        checkEvents()
    });

    function handleRefresh() {
        window.location.reload()
    }

    function handleMarkerClick(event: Event) {
        setSelectedEvent(event)
        setIsDrawerOpen(true)
    }

    return (
        <div className="relative w-full h-full">
            <div className="absolute top-4 left-4 z-[1000]">
                <Button
                    onClick={handleRefresh}
                    variant="outline"
                    className="h-[50] w-[50] rounded-full p-0"
                >
                    <Image src="/refresh-ccw.svg" alt="Reload Icon" width={30} height={30} />
                </Button>
            </div>
            {/*<div className="absolute top-4 right-4 z-[1000]">*/}
            {/*    <Filter activeFilters={activeFilters} setActiveFilters={setActiveFilters} />*/}
            {/*</div>*/}
            <MapContainer
                className="leaflet-container z-0"
                bounds={bounds}
                style={{ height: "100vh", width: "100%" }}
                attributionControl={false}
                zoomControl={false}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapEventHandler />
                {events.map((event) => (
                    <CircleMarker
                        key={event.id}
                        center={event.position}
                        radius={event.radius || 15}
                        pathOptions={{
                            color: event.color,
                            fillColor: event.color,
                            fillOpacity: 0.4,
                            weight: 1,
                        }}
                        eventHandlers={{
                            click: () => handleMarkerClick(event)
                        }}
                    />
                ))}
            </MapContainer>

            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle className="text-center">Проишествия</DrawerTitle>
                    </DrawerHeader>
                    <div className="flex flex-col items-center">
                        {selectedEvent ? (
                            selectedEvent.titles.map((title, i) => (
                                <Accordion type="single" collapsible className="w-[80%] mb-2" key={i}>
                                    <AccordionItem value={title}>
                                        <AccordionTrigger className="w-full text-center">
                                            {title}: {selectedEvent.statuses[i]}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-center">
                                            {selectedEvent.descriptions[i]}
                                        </AccordionContent>
                                        <Separator className="my-2" />
                                    </AccordionItem>
                                </Accordion>
                            ))
                        ) : 'Нет выбранного события'}
                    </div>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button
                                variant="outline"
                                className="mx-auto"
                            >
                                Закрыть</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default MapComponent

