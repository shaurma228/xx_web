'use client'

import React from "react"
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
// import axios from "axios"

const topLeft: [number, number] = [55.751244, 37.618423]
const bottomRight: [number, number] = [55.751244, 37.618423]
const bounds: [[number, number], [number, number]] = [topLeft, bottomRight]

function MapEventHandler() {
    useMapEvents({
        moveend: (event) => {
            const map = event.target
            const currentBounds = map.getBounds()
            const boundsData = {
                northEast: [currentBounds.getNorthEast().lat, currentBounds.getNorthEast().lng],
                southWest: [currentBounds.getSouthWest().lat, currentBounds.getSouthWest().lng],
            }
            console.log("Current bounds:", boundsData)
            // axios.post('/api/postBounds', boundsData)
            //     .then(response => console.log('Bounds sent successfully:', response.data))
            //     .catch(error => console.error('Error sending bounds:', error))
        },
    })
    return null
}

function HeatMap() {

    return (
        <MapContainer
            className="leaflet-container"
            bounds={bounds}
            style={{ height: "100vh", width: "100%" }}
            attributionControl={false}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapEventHandler/>
        </MapContainer>
    )
}

export default HeatMap