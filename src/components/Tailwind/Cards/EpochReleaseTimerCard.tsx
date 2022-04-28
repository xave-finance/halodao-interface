import React from 'react'
import EpochCharacter from '../../../assets/svg/epochCharacter.svg'
import GradientCard from './GradientCard'
import { CurrentEpoch } from '../../../halo-hooks/useEpochCountdown'

interface TimeObject {
  event: boolean
  content: Record<string, string>
  countdown?: CurrentEpoch
}

const EpochReleaseTimerCard = ({ event, content, countdown }: TimeObject) => {
  const ConvertToString = (x: any) => {
    return x.toString()
  }
  const IfDoubleDigit = (str: string) => {
    const strLength = str.length
    return strLength === 1
  }
  return (
    <>
      <GradientCard>
        <div className="flex justify-center flex-wrap">
          <div className="flex flex-col justify-around">
            {event ? (
              <>
                <div className="font-semibold text-base leading-8">{content.title}</div>
                <div className="w-full h-auto flex flex-row justify-around gap-x-2.5">
                  <div className="flex flex-col w-20">
                    <p className="font-bold text-xs text-center">Days</p>
                    <h2 className="font-normal text-center text-6xl text-primary-yellow font-fredoka">
                      {IfDoubleDigit(ConvertToString(countdown?.days)) ? `0${countdown?.days}` : countdown?.days}
                    </h2>
                  </div>
                  <div className="flex flex-col w-20">
                    <p className="font-bold text-xs text-center">Hours</p>
                    <h2 className="font-normal text-center text-6xl text-primary-yellow font-fredoka">
                      {' '}
                      {IfDoubleDigit(ConvertToString(countdown?.hours)) ? `0${countdown?.hours}` : countdown?.hours}
                    </h2>
                  </div>
                  <div className="flex flex-col w-20">
                    <p className="font-bold text-xs text-center">Minutes</p>
                    <h2 className="font-normal text-center text-6xl text-primary-yellow font-fredoka">
                      {IfDoubleDigit(ConvertToString(countdown?.minutes))
                        ? `0${countdown?.minutes}`
                        : countdown?.minutes}
                    </h2>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="font-semibold text-base leading-8">{content.title}</div>
                <div className="font-fredoka font-normal text-4xl text-primary-yellow">{content?.liquidity}</div>
              </>
            )}
          </div>
          <img className="h-155.61 hidden sm:block" alt="" src={EpochCharacter} />
        </div>
        <div className="flex flex-col md:flex-row text-center md:text-left mx-4 md:space-x-8 space-y-2 md:space-y-0 mt-4 ">
          <div className="flex flex-col">
            <p className="text-12px bold ">DEPOSIT IN POOL </p>
            <h4 className="text-lg">{content.deposit}</h4>
          </div>
          <div className="flex flex-col">
            <p className="text-12px bold">MONTHLY PROFITS </p>
            <h4 className="text-lg">{content.profit}</h4>
          </div>
        </div>
      </GradientCard>
    </>
  )
}

export default EpochReleaseTimerCard
