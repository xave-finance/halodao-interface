import React from 'react'

interface TabsControlProps {
  tabs: string[]
  activeTab: number
  didChangeTab: (activeTab: number) => void
}

const TabsControl = ({ tabs, activeTab, didChangeTab }: TabsControlProps) => {
  return (
    <div className="p-2 flex rounded-card bg-primary-light">
      {tabs.map((tab, i) => (
        <div
          className={`
            py-5 flex-auto
            text-center font-semibold
            rounded-card border
            cursor-pointer
            transition-all
            ${activeTab === i ? 'text-black' : 'text-gray-500'}
            ${activeTab === i ? 'border-primary' : 'border-transparent'}
            ${activeTab === i ? 'bg-white' : 'bg-transparent'}
          `}
          onClick={() => didChangeTab(i)}
        >
          {tab}
        </div>
      ))}
    </div>
  )
}

export default TabsControl
