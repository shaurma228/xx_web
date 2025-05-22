'use client'

import React, {
    useState, // useEffect
} from "react"
import { MapContainer, TileLayer, CircleMarker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import Filter from "@/components/Filter"
import { Button} from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"
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

// import axios from "axios"

interface Event {
    id: string
    position: [number, number]
    color: string
    titles: string[]
    statuses: string[]
    descriptions: string[]
}

const events: Event[] = [
    { id: "1", position: [55.751244, 37.618423], color: "orange", titles: ["Событие 1", "Событие 1.1"], statuses: ["В обработке", "Увы"], descriptions: ["Описание 1", "Описание 1.1"] },
    { id: "2", position: [55.752244, 37.615423], color: "green", titles: ["Событие 2"], statuses: ["Завершено"], descriptions: ["Описание 2"] },
    { id: "3", position: [55.750244, 37.620423], color: "red", titles: ["Событие 3"], statuses: ["Просрочено"], descriptions: ["Описание 3"] },
]

// const apiUrl = process.env.NEXT_PUBLIC_API_URL

function MapComponent() {
    const [topLeft, setTopLeft] = useState<[number, number]>([55.751244, 37.618423])
    const [bottomRight, setBottomRight] = useState<[number, number]>([55.751244, 37.618423])
    const [bounds, setBounds] = useState<[[number, number], [number, number]]>([topLeft, bottomRight])
    const [activeFilters, setActiveFilters] = useState<string[]>([])
    // const [events, setEvents] = useState<Event[]>([])
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

    const filteredEvents = events.filter((event) =>
        activeFilters.length === 0 || activeFilters.includes(event.color)
    )

    // function postBounds(boundsData: [[number, number], [number, number]]) {
    //     axios.post(`${apiUrl}/api/postBounds`, boundsData)
    //         .then(response => console.log('Bounds sent successfully:', response.data))
    //         .catch(error => console.error('Error sending bounds:', error))
    // }
    //
    // function fetchBounds() {
    //     axios.get(`${apiUrl}/api/getBounds`)
    //         .then(response => {
    //             const data = response.data
    //             setTopLeft([data.topLeft.lat, data.topLeft.lng])
    //             setBottomRight([data.bottomRight.lat, data.bottomRight.lng])
    //             setBounds([topLeft, bottomRight])
    //         })
    //         .catch(error => console.error('Error fetching bounds:', error))
    // }
    //
    // function fetchEvents() {
    //     axios.get(`${apiUrl}/api/getEvents`)
    //         .then(response => {
    //             setEvents(response.data)
    //             console.log(events)
    //         })
    //         .catch(error => console.error('Error fetching actions:', error))
    // }

    function MapEventHandler() {
        useMapEvents({
            moveend: (event) => {
                const map = event.target
                const currentBounds = map.getBounds()
                setTopLeft([currentBounds.getNorthEast().lat, currentBounds.getNorthEast().lng])
                setBottomRight([currentBounds.getSouthWest().lat, currentBounds.getSouthWest().lng])
                setBounds([topLeft, bottomRight])
                console.log(bounds)
                // postBounds(bounds)
                // fetchEvents()
            },
        })
        return null
    }

    // useEffect(() => {
    //     fetchBounds()
    // })
    //
    // useEffect(() => {
    //     fetchEvents()
    // })

    function handleRefresh() {
        window.location.reload();
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
                    size="icon"
                >
                    <RefreshCcw />
                </Button>
            </div>
            
            <div className="absolute top-4 right-4 z-[1000]">
                <Filter activeFilters={activeFilters} setActiveFilters={setActiveFilters} />
            </div>
            <MapContainer
                className="leaflet-container z-0"
                bounds={bounds}
                style={{ height: "100vh", width: "100%" }}
                attributionControl={false}
                zoomControl={false}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapEventHandler />
                {filteredEvents.map((event) => (
                    <CircleMarker
                        key={event.id}
                        center={event.position}
                        radius={15}
                        pathOptions={{
                            color: event.color,
                            fillColor: event.color,
                            fillOpacity: 0.5,
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

