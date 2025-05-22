'use client'

import React, {
    useState,
    // useEffect
} from "react"
import { MapContainer, TileLayer, CircleMarker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
// import axios from "axios"
//
// interface Action {
//     title: string
//     description: string
//     color: 'red' | 'orange' | 'yellow' | 'green' | 'blue'
// }
import Filter from "@/components/Filter"

interface Event {
    id: string
    position: [number, number]
    color: string
    radius: number
}

const events: Event[] = [
    { id: "1", position: [55.751244, 37.618423], color: "red", radius: 10 },
    { id: "2", position: [55.752244, 37.615423], color: "orange", radius: 10 },
    { id: "3", position: [55.750244, 37.620423], color: "green", radius: 10 },
]

function MapComponent() {
    const [ topLeft, setTopLeft ] = useState<[number, number]>([55.751244, 37.618423])
    const [ bottomRight, setBottomRight ] = useState<[number, number]>([55.751244, 37.618423])
    const [ bounds, setBounds ] = useState<[[number, number], [number, number]]>([topLeft, bottomRight])
    // function postBounds(boundsData: [[number, number], [number, number]]) {
    //     axios.post('/api/postBounds', boundsData)
    //         .then(response => console.log('Bounds sent successfully:', response.data))
    //         .catch(error => console.error('Error sending bounds:', error))
    // }

    // function fetchBounds() {
    //     axios.get('/api/getBounds')
    //         .then(response => {
    //             const data = response.data
    //             setTopLeft([data.topLeft.lat, data.topLeft.lng])
    //             setBottomRight([data.bottomRight.lat, data.bottomRight.lng])
    //             setBounds([topLeft, bottomRight])
    //         })
    //         .catch(error => console.error('Error fetching bounds:', error))
    // }

    // function fetchEvents() {
    //     axios.get('/api/getEvents')
    //         .then(response => {
    //             setActions(response.data)
    //             console.log(actions)
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
    //     fetchActions()
    // })

    return (
        <div className="relative w-full h-full">
            <div className="absolute top-4 left-4 z-[1000]"> {/* Увеличиваем z-index */}
                <Filter />
            </div>
            <MapContainer
                className="leaflet-container z-0" // Устанавливаем z-index карты ниже
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
                        radius={event.radius}
                        pathOptions={{
                            color: event.color,
                            fillColor: event.color,
                            fillOpacity: 0.5,
                        }}
                    />
                ))}
            </MapContainer>
        </div>
    )
}

export default MapComponent
