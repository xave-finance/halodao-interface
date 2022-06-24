import React from 'react'
import PageWarning from '../Layout/PageWarning'
import { GeofenceCountry, useGeofence } from '../../../halo-hooks/useGeofence'

interface GeoBlockedProps {
    children: React.ReactNode
}

const BLOCKED_COUNTRIES = [ GeofenceCountry.SINGAPORE ];

const GeoBlocked = ({ children }: GeoBlockedProps) => {
    const { loading, rejected } = useGeofence(BLOCKED_COUNTRIES)
    
    if (loading) return (
        <div className="flex items-center border border-primary-hover shadow-md rounded-card bg-white m-20 pt-10 pb-10">
            <div className="w-full">
                <PageWarning caption={`Loading...`} />
            </div>
        </div>
    )
    else if (!loading && rejected) return (
        <div className="flex items-center border border-primary-hover shadow-md rounded-card bg-white m-20 pt-10 pb-10">
            <div className="w-full">
                <PageWarning caption={`You are not allowed to access Xave Finance due to the restricted jurisdiction.`} />
            </div>
        </div>
    )

    return <>{children}</>
}

export default GeoBlocked
