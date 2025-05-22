'use client'

import React, {
    useState, // useEffect
} from "react"
import { MapContainer, TileLayer, CircleMarker, Popup, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import Filter from "@/components/Filter"
// import axios from "axios"

interface Event {
    id: string
    position: [number, number]
    color: string
    title: string
    status: string
}

const events: Event[] = [
    { id: "1", position: [55.751244, 37.618423], color: "red", title: "Событие 1", status: "Статус 1" },
    { id: "2", position: [55.752244, 37.615423], color: "orange", title: "Событие 2", status: "Статус 2" },
    { id: "3", position: [55.750244, 37.620423], color: "green", title: "Событие 3", status: "Статус 3" },
]

// const apiUrl = process.env.NEXT_PUBLIC_API_URL

function MapComponent() {
    const [topLeft, setTopLeft] = useState<[number, number]>([55.751244, 37.618423])
    const [bottomRight, setBottomRight] = useState<[number, number]>([55.751244, 37.618423])
    const [bounds, setBounds] = useState<[[number, number], [number, number]]>([topLeft, bottomRight])
    const [activeFilters, setActiveFilters] = useState<string[]>([])
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
    // const [events, setEvents] = useState<Event[]>([])

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

    return (
        <div className="relative w-full h-full">
            <div className="absolute top-4 left-4 z-[1000]">
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
                            click: () => setSelectedEvent(event),
                        }}
                    >
                        {selectedEvent?.id === event.id && (
                            <Popup
                                position={event.position}
                            >
                                <div>
                                    <h3 className="font-bold">{event.title}</h3>
                                    <p>{event.status}</p>
                                </div>
                            </Popup>
                        )}
                    </CircleMarker>
                ))}
            </MapContainer>
        </div>
    )
}

export default MapComponent
