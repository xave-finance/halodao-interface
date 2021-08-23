import React from 'react'

interface SegmentControlProps {
  segments: string[]
  activeSegment: number
  didChangeSegment: (activeSegment: number) => void
  className?: string
}

const SegmentControl = ({ segments, activeSegment, didChangeSegment, className }: SegmentControlProps) => {
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
            cursor-pointer
            transition-all
            ${className}
            ${activeSegment === i ? 'bg-primary' : 'bg-transparent'}
          `}
          onClick={() => didChangeSegment(i)}
        >
          {segment}
        </div>
      ))}
    </div>
  )
}

export default SegmentControl
