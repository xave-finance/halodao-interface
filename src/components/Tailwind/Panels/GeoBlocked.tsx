import React from 'react'
import PageWarning from '../Layout/PageWarning'

const GeoBlocked = () => {
  const caption = `Oops! Content is blocked from your location.`

  return (
    <div
      className="flex items-center border border-primary-hover shadow-md rounded-card bg-white m-20 pt-10 pb-10"
    >
      <div className="w-full">
        <PageWarning caption={caption} />
      </div>
    </div>
  )
}

export default GeoBlocked
