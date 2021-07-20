import DoubleCurrencyLogo from 'components/DoubleLogo'
import PoolExpandButton from 'components/Tailwind/Buttons/PoolExpandButton'
import { HALO, USDC } from '../../constants'
import React from 'react'
import { formatNumber, NumberFormat } from 'utils/formatNumber'
import RNBWToken from '../../assets/images/rnbw-token.png'
import { ChainId } from '@sushiswap/sdk'
import ExpandablePoolRow from 'components/Tailwind/Common/ExpandablePoolRow'

const TailwindDemo = () => {
  const pools = [
    { name: 'RNBW/USDT', apy: 1.2, earned: 75 },
    { name: 'XSGD/USDT', apy: 0.85, earned: 0 },
    { name: 'XSGD/USDC', apy: 0.8, earned: 1100 }
  ]

  return (
    <>
      <div className="container mx-auto mb-8">
        <div className="text-2xl font-extrabold">Tailwind Components</div>
      </div>

      {/* ===================== */}
      {/* ===== Container ===== */}
      {/* ===================== */}
      <div className="container mx-auto p-8 bg-yellow-50 mb-8">
        <div className="text-xl font-bold">Container</div>
        <p>Responsive width, aligned center. Refer to https://tailwindcss.com/docs/container for actual sizes.</p>
      </div>

      {/* ======================= */}
      {/* ===== Page Header ===== */}
      {/* ======================= */}
      <div className="container mx-auto mb-8">
        <div className="text-xl font-bold">Page header</div>
        <p>- with 1rem (16px) space between on mobile</p>
        <p>- with 2rem (32px) space between on desktop</p>
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-8">
          <div className="p-8 bg-yellow-50 md:w-5/12">Left (mobile: 100%, desktop: 5/12 or ~41.66%)</div>
          <div className="p-8 bg-yellow-50 flex-auto">
            Right (mobile: 100%, desktop: takes up the rest, 7/12 or ~52.34%)
          </div>
        </div>
      </div>

      {/* ================================ */}
      {/* ===== Page Header (Filled) ===== */}
      {/* ================================ */}
      <div className="container mx-auto mb-8">
        <div className="text-xl font-bold">Page header (filled)</div>
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-8 md:items-center">
          {/* Left side */}
          <div className="md:w-5/12">
            <div className="text-sm font-extrabold tracking-widest">ADD LIQUIDITY</div>
            <div className="text-4xl font-fredoka text-primary mb-4">Pools</div>
            <div className="mb-1 md:pr-16">
              Zcash rejoins the public key for some fork. Ravencoin halving the orphan in lots of ERC20 token standard!
              ICO thought!
            </div>
            <div className="text-link">
              <a href="https://docs.halodao.com">Learn more about Add Liquidity</a>
            </div>
          </div>
          {/* Right side */}
          <div className="flex-auto flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
            <div className="flex-auto flex flex-col space-y-2">
              <div className="flex-auto bg-primary-light py-4 px-6 rounded-xl">
                <div className="text-sm font-extrabold tracking-widest text-primary">TITLE #1</div>
                <div className="text-2xl font-semibold">$123.456</div>
              </div>
              <div className="flex-auto bg-primary-light py-4 px-6 rounded-xl">
                <div className="text-sm font-extrabold tracking-widest text-primary">TITLE #2</div>
                <div className="text-2xl font-semibold">$987.654</div>
              </div>
            </div>
            <div className="flex-auto bg-primary-light py-4 px-6 rounded-xl">
              <div className="hidden md:block md:mb-2">
                <img src={RNBWToken} width="80" alt="RNBW token" />
              </div>
              <div className="text-sm font-extrabold tracking-widest text-primary">TITLE #3</div>
              <div className="text-2xl font-semibold">500 RNBW</div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================== */}
      {/* ===== Pool Table ===== */}
      {/* ====================== */}
      <div className="container mx-auto mb-8">
        <div className="text-xl font-bold">Pool table</div>
        <div className="hidden md:flex flex-row space-x-4 md:mb-4">
          <div className="w-5/12 font-fredoka text-gray-500">Pool</div>
          <div className="w-3/12 font-fredoka text-gray-500">APY</div>
          <div className="w-3/12 font-fredoka text-gray-500">Earned</div>
          <div className="w-1/12">&nbsp;</div>
        </div>
        {pools.map(pool => (
          <ExpandablePoolRow key={pool.name} pool={pool} />
        ))}
      </div>
    </>
  )
}

export default TailwindDemo
