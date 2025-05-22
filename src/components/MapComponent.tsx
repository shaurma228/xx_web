'use client'

import React, { useState, useEffect } from "react"
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import axios from "axios"

interface Action {
    title: string
    description: string
    color: 'red' | 'orange' | 'yellow' | 'green' | 'blue'
}

function MapComponent() {
    const [ topLeft, setTopLeft ] = useState<[number, number]>([55.751244, 37.618423])
    const [ bottomRight, setBottomRight ] = useState<[number, number]>([55.751244, 37.618423])
    const [ bounds, setBounds ] = useState<[[number, number], [number, number]]>([topLeft, bottomRight])
    const [ actions, setActions ] = useState<Action[]>([])

    function postBounds(boundsData: [[number, number], [number, number]]) {
        axios.post('/api/postBounds', boundsData)
            .then(response => console.log('Bounds sent successfully:', response.data))
            .catch(error => console.error('Error sending bounds:', error))
    }

    function fetchBounds() {
        axios.get('/api/getBounds')
            .then(response => {
                const data = response.data
                setTopLeft([data.topLeft.lat, data.topLeft.lng])
                setBottomRight([data.bottomRight.lat, data.bottomRight.lng])
                setBounds([topLeft, bottomRight])
            })
            .catch(error => console.error('Error fetching bounds:', error))
    }

    function fetchActions() {
        axios.get('/api/getActions')
            .then(response => {
                setActions(response.data)
                console.log(actions)
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
                postBounds(bounds)
            },
        })
        return null
    }

    useEffect(() => {
        fetchBounds()
    })

    useEffect(() => {
        fetchActions()
    })

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

export default MapComponent