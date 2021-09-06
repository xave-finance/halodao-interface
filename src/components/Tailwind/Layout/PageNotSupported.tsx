import React from 'react'
import BunnyAnnouncement from 'assets/svg/bunny-announcement.svg'

interface PageNotSupportedProps {
  caption: string
}

const PageNotSupported = ({ caption }: PageNotSupportedProps) => {
  return (
    <div className="flex flex-col justify-center mt-4">
      <div className="flex justify-center">
        <img src={BunnyAnnouncement} alt="Switch" />
      </div>
      <p className="p-8 text-md text-center">{caption}</p>
    </div>
  )
}

export default PageNotSupported
