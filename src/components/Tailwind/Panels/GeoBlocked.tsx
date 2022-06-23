import React from 'react'
import PageWarning from '../Layout/PageWarning'
import { GeofenceCountry, useGeofence } from '../../../halo-hooks/useGeofence'

interface GeoBlockedProps {
    children: React.ReactNode,
    country: GeofenceCountry
}

const GeoBlocked = ({children, country}: GeoBlockedProps) => {
    const { loading, rejected } = useGeofence(country)
    if (loading) return (
        <>
            <div className="flex items-center border border-primary-hover shadow-md rounded-card bg-white m-20 pt-10 pb-10">
                <div className="w-full">
                    <PageWarning caption={`Loading...`} />
                </div>
            </div>
        </>
    )
    else if (!loading && rejected) return (
        <>
             <div className="flex items-center border border-primary-hover shadow-md rounded-card bg-white m-20 pt-10 pb-10">
                <div className="w-full">
                    <PageWarning caption={`Oops! Content is blocked on your location.`} />
                </div>
            </div>
        </>
    )

    return (
        <>
            {children}
        </>
    )
}

export default GeoBlocked
