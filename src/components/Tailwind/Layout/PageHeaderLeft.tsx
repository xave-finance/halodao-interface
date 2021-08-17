import React from 'react'

interface PageHeaderLeftProps {
  title: string
  caption: string
  subtitle?: string
  link?: {
    text: string
    url: string
  }
  paddingRight?: string
}

const PageHeaderLeft = ({ title, caption, subtitle, link }: PageHeaderLeftProps) => {
  return (
    <div>
      {subtitle && <div className="text-sm font-extrabold tracking-widest uppercase">{subtitle}</div>}
      <div className="text-4xl font-fredoka text-primary mb-4">{title}</div>
      <div className="mb-1 md:pr-16">{caption}</div>
      {link && (
        <div className="text-link">
          <a href={link.url}>{link.text}</a>
        </div>
      )}
    </div>
  )
}

export default PageHeaderLeft
