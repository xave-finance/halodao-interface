import React from 'react'
import PageWrapper from 'components/Tailwind/Layout/PageWrapper'
import PageHeaderLeft from 'components/Tailwind/Layout/PageHeaderLeft'
import BridgePanel from './BridgePanel'
import InfoCard from 'components/Tailwind/Cards/InfoCard'

const Bridge = () => {
  return (
    <PageWrapper className="mb-8">
      <div className="md:float-left md:w-1/2">
        <PageHeaderLeft
          subtitle=""
          title="Bridge"
          caption="Move your ERC-20 token from EVM bridge to EVM bridge."
          link={{ text: 'Learn about bridge', url: 'https://docs.halodao.com' }}
        />
      </div>
      <div className="md:float-right md:w-1/2">
        <BridgePanel />
      </div>
      <div className="flex items-start md:w-1/2">
        <InfoCard
          title="Bridge Info"
          description={`Use HaloDAO bridge to move your tokens within any of the supported EVM compatible networks. A bridge fee of ${Number(
            process.env.REACT_APP_SHUTTLE_FEE_PERCENTAGE
          ) * 100}% goes to the HaloDAO treasury`}
        />
      </div>
    </PageWrapper>
  )
}

export default Bridge
