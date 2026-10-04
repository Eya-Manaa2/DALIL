'use client'

import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import { CircleMarker, MapContainer, TileLayer, Tooltip, useMap } from 'react-leaflet'
import type { Office } from '@/lib/nearby'

type Props = {
  center: [number, number]
  offices: Office[]
  selectedId: string | null
  onSelect: (id: string) => void
  youLabel: string
}

function FitView({ center, offices, selectedId }: Pick<Props, 'center' | 'offices' | 'selectedId'>) {
  const map = useMap()
  useEffect(() => {
    const selected = offices.find((o) => o.id === selectedId)
    if (selected) {
      map.flyTo([selected.lat, selected.lng], Math.max(map.getZoom(), 15), { duration: 0.6 })
      return
    }
    const points: [number, number][] = [center, ...offices.slice(0, 6).map((o) => [o.lat, o.lng] as [number, number])]
    if (points.length > 1) map.fitBounds(points, { padding: [32, 32], maxZoom: 15 })
    else map.setView(center, 13)
  }, [map, center, offices, selectedId])
  return null
}

export default function OfficesMap({ center, offices, selectedId, onSelect, youLabel }: Props) {
  return (
    <div dir="ltr" className="relative isolate z-0 h-full w-full">
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CircleMarker center={center} radius={9} className="map-you" pathOptions={{ weight: 3, fillOpacity: 1 }}>
          <Tooltip permanent direction="top" offset={[0, -8]}>
            {youLabel}
          </Tooltip>
        </CircleMarker>
        {offices.map((o) => (
          <CircleMarker
            key={o.id}
            center={[o.lat, o.lng]}
            radius={o.id === selectedId ? 11 : 8}
            className={o.id === selectedId ? 'map-office map-office-active' : 'map-office'}
            pathOptions={{ weight: 2, fillOpacity: 0.9 }}
            eventHandlers={{ click: () => onSelect(o.id) }}
          >
            <Tooltip direction="top" offset={[0, -6]}>
              {o.name}
            </Tooltip>
          </CircleMarker>
        ))}
        <FitView center={center} offices={offices} selectedId={selectedId} />
      </MapContainer>
    </div>
  )
}
