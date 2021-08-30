import React from 'react'

interface PageWrapperProps {
  className?: string
  children: React.ReactNode
}

const PageWrapper = ({ className = '', children }: PageWrapperProps) => {
  return <div className={`w-full max-w-container mx-auto ${className}`}>{children}</div>
}

export default PageWrapper
