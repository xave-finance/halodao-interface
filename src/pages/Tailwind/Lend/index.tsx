import React, { useState } from 'react'
import { ChainId } from '@sushiswap/sdk'
import { HALO } from '../../../constants'
import { useWeb3React } from '@web3-react/core'
import PageWrapper from 'components/Tailwind/Layout/PageWrapper'
import PageHeaderLeft from 'components/Tailwind/Layout/PageHeaderLeft'
import PageHeaderRight from './PageHeaaderRight'
import PageHeaderCenter from './PageHeaderCenter'
import { shortenAddress } from '../../../utils'

const Lend = () => {
  const { account, error } = useWeb3React()
  const [inputValue, setInputValue] = useState('')
  const [showModal, setShowModal] = useState(false)

  return (
    <PageWrapper className="mb-8 border border-black">
      <div className="flex flex-col md:flex-row md:space-x-4">
        <div className="w-full md:w-2/6 border border-black">
          <PageHeaderLeft
            subtitle="Overview"
            title="Lend"
            caption="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Enim potenti faucibus adipiscing sed tempor diam, ipsum porta ."
          />
        </div>
        <div className="invisible md:visible md:w-4/6 border border-black">
          <PageHeaderCenter />
        </div>
        <div className="invisible md:visible md:w-2/6 border border-black">
          <PageHeaderRight />
        </div>
      </div>
    </PageWrapper>
  )
}

export default Lend
