import React from 'react'

interface SegmentControlProps {
  segments: string[]
  activeSegment: number
  disabledSegments?: number[]
  didChangeSegment: (activeSegment: number) => void
  className?: string
}

const SegmentControl = ({
  segments,
  activeSegment,
  disabledSegments,
  didChangeSegment,
  className
}: SegmentControlProps) => {
  const isSegmentDisabled = (segment: number) => {
    return disabledSegments && disabledSegments.includes(segment)
  }

  return (
    <div className="flex rounded bg-primary-disabled">
      {segments.map((segment, i) => (
        <div
          key={i}
          className={`
            py-1 px-2 flex-auto
            text-white 
            text-xs 
            text-center 
            font-bold
            rounded
            transition-all
            ${className}
            ${activeSegment === i ? 'bg-primary' : 'bg-transparent'}
            ${isSegmentDisabled(i) ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
          onClick={() => {
            if (!isSegmentDisabled(i)) {
              didChangeSegment(i)
            }
          }}
        >
          {segment}
        </div>
      ))}
    </div>
  )
}

export default SegmentControl
