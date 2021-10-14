import React from 'react'

interface TabsControlProps {
  tabs: string[]
  activeTab: number
  disabledTabs?: number[]
  didChangeTab: (activeTab: number) => void
}

const TabsControl = ({ tabs, activeTab, disabledTabs, didChangeTab }: TabsControlProps) => {
  return (
    <div className="p-2 flex rounded-card bg-primary-lightest">
      {tabs.map((tab, i) => (
        <div
          key={i}
          className={`
            py-5 flex-auto
            text-center font-semibold
            rounded-card border
            cursor-pointer
            transition-all
            ${activeTab === i ? 'text-black' : 'text-gray-500'}
            ${activeTab === i ? 'border-primary' : 'border-transparent'}
            ${activeTab === i ? 'bg-white' : 'bg-transparent'}
            ${disabledTabs?.includes(i) ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}
          `}
          onClick={() => {
            if (!disabledTabs?.includes(i)) {
              didChangeTab(i)
            }
          }}
        >
          {tab}
        </div>
      ))}
    </div>
  )
}

export default TabsControl
