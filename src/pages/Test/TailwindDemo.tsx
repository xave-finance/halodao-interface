import React from 'react'
import RNBWToken from '../../assets/images/rnbw-token.png'

const TailwindDemo = () => {
  return (
    <>
      <div className="container mx-auto mb-8">
        <div className="text-2xl font-extrabold">Tailwind Components</div>
      </div>

      <div className="container mx-auto p-8 bg-yellow-50 mb-8">
        <div className="text-xl font-bold">Container</div>
        <p>Responsive width, aligned center. Refer to https://tailwindcss.com/docs/container for actual sizes.</p>
      </div>

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

      <div className="container mx-auto mb-8">
        <div className="text-xl font-bold">Page header (filled)</div>
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-8 md:items-center">
          <div className="md:w-5/12">
            <div className="text-sm font-extrabold tracking-widest">ADD LIQUIDITY</div>
            <div className="text-4xl font-fredoka text-primary mb-4">Pools</div>
            <div className="mb-1 md:pr-16">
              Zcash rejoins the public key for some fork. Ravencoin halving the orphan in lots of ERC20 token standard!
              ICO thought!
            </div>
            <div className="text-link">
              <a href="">Learn more about Add Liquidity</a>
            </div>
          </div>
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
    </>
  )
}

export default TailwindDemo
